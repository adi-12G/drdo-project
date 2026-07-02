from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt
from db import get_connection
from decorators import any_user_required

dashboard_bp = Blueprint("dashboard", __name__)


def _counts(cursor):
    cursor.execute("SELECT COUNT(*) AS c FROM employee WHERE deleted = FALSE")
    employees = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM cadre WHERE deleted = FALSE")
    cadres = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM designation WHERE deleted = FALSE")
    designations = cursor.fetchone()["c"]

    cursor.execute("SELECT COUNT(*) AS c FROM employee_group WHERE deleted = FALSE")
    groups = cursor.fetchone()["c"]

    return {
        "employees": employees,
        "cadres": cadres,
        "designations": designations,
        "groups": groups,
    }


def _status_breakdown(cursor):
    cursor.execute("""
        SELECT
            SUM(CASE WHEN status = TRUE THEN 1 ELSE 0 END) AS active,
            SUM(CASE WHEN status = FALSE THEN 1 ELSE 0 END) AS inactive
        FROM employee
        WHERE deleted = FALSE
    """)
    row = cursor.fetchone()
    return {
        "active": row["active"] or 0,
        "inactive": row["inactive"] or 0,
    }


def _employees_by_cadre(cursor):
    cursor.execute("""
        SELECT cadre.full_name AS name, COUNT(employee.emp_id) AS count
        FROM cadre
        LEFT JOIN employee
            ON employee.cadre_id = cadre.cadre_id AND employee.deleted = FALSE
        WHERE cadre.deleted = FALSE
        GROUP BY cadre.cadre_id, cadre.full_name
        ORDER BY count DESC
    """)
    return cursor.fetchall()


def _employees_by_group(cursor):
    cursor.execute("""
        SELECT employee_group.full_name AS name, COUNT(employee.emp_id) AS count
        FROM employee_group
        LEFT JOIN employee
            ON employee.group_id = employee_group.group_id AND employee.deleted = FALSE
        WHERE employee_group.deleted = FALSE
        GROUP BY employee_group.group_id, employee_group.full_name
        ORDER BY count DESC
    """)
    return cursor.fetchall()


def _needs_attention(cursor):
    cursor.execute("""
        SELECT emp_id, pis_number, first_name, last_name, email,
               cadre_id, designation_id, internal_designation_id, group_id
        FROM employee
        WHERE deleted = FALSE
          AND (
              cadre_id IS NULL OR
              designation_id IS NULL OR
              internal_designation_id IS NULL OR
              group_id IS NULL OR
              email IS NULL OR email = ''
          )
        LIMIT 25
    """)
    rows = cursor.fetchall()

    results = []
    for row in rows:
        missing = []
        if not row["cadre_id"]:
            missing.append("cadre")
        if not row["designation_id"]:
            missing.append("designation")
        if not row["internal_designation_id"]:
            missing.append("internal designation")
        if not row["group_id"]:
            missing.append("group")
        if not row["email"]:
            missing.append("email")

        results.append({
            "emp_id": row["emp_id"],
            "pis_number": row["pis_number"],
            "name": f"{row['first_name'] or ''} {row['last_name'] or ''}".strip(),
            "missing": missing,
        })

    return results


@dashboard_bp.route("/dashboard")
@any_user_required
def get_dashboard():
    claims = get_jwt()
    role = claims.get("role")

    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        counts = _counts(cursor)

        if role == "admin":
            payload = {
                "role": role,
                "counts": counts,
                "status_breakdown": _status_breakdown(cursor),
                "employees_by_cadre": _employees_by_cadre(cursor),
                "employees_by_group": _employees_by_group(cursor),
                "needs_attention": _needs_attention(cursor),
            }
        else:
            profile = None
            if role == "employee":
                emp_id = claims.get("id")
                cursor.execute("""
                    SELECT
                        employee.emp_id, employee.pis_number, employee.first_name,
                        employee.middle_name, employee.last_name, employee.email,
                        employee.status,
                        cadre.full_name AS cadre_name,
                        designation.full_name AS designation_name,
                        internal_designation.full_name AS internal_designation_name,
                        employee_group.full_name AS group_name
                    FROM employee
                    LEFT JOIN cadre ON employee.cadre_id = cadre.cadre_id
                    LEFT JOIN designation ON employee.designation_id = designation.designation_id
                    LEFT JOIN internal_designation
                        ON employee.internal_designation_id = internal_designation.internal_designation_id
                    LEFT JOIN employee_group ON employee.group_id = employee_group.group_id
                    WHERE employee.emp_id = %s AND employee.deleted = FALSE
                """, (emp_id,))
                profile = cursor.fetchone()

            payload = {
                "role": role,
                "counts": counts,
                "profile": profile,
            }

        cursor.close()
        return jsonify(payload)
    finally:
        conn.close()