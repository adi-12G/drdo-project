from flask_jwt_extended import get_jwt
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt
from werkzeug.security import generate_password_hash
from db import get_connection
from decorators import admin_required, any_user_required

employee_bp = Blueprint("employees", __name__)


def _sync_admin_row(cursor, emp_id, user_type, username, password_hash, group_id):
    """Keep the admin table in sync with an employee's user_type.

    - If user_type is "admin": create an admin row for them if one doesn't
      already exist (reusing their employee username/password), or update
      the existing one's username/password/group if it does.
    - If user_type is anything else: soft-delete their admin row, if any,
      so they lose admin login access.
    """
    cursor.execute(
        "SELECT id FROM admin WHERE emp_id=%s AND deleted=FALSE",
        (emp_id,),
    )
    existing = cursor.fetchone()

    if user_type == "admin":
        if existing:
            cursor.execute("""
                UPDATE admin
                SET username=%s, password=%s, g_id=%s
                WHERE id=%s
            """, (username, password_hash, group_id, existing[0]))
        else:
            cursor.execute("""
                INSERT INTO admin(emp_id, g_id, username, password, user_type, name)
                VALUES(%s,%s,%s,%s,%s,%s)
            """, (emp_id, group_id, username, password_hash, "admin", username))
    else:
        if existing:
            cursor.execute(
                "UPDATE admin SET deleted=TRUE WHERE id=%s",
                (existing[0],),
            )


@employee_bp.route("/employees")
@any_user_required
def get_employees():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
SELECT
    e.*,
    a.id AS adgh_id
FROM employee e
LEFT JOIN adgh a
    ON e.emp_id = a.emp_id
WHERE e.deleted = FALSE
""")
        rows = cursor.fetchall()
        cursor.close()
        return jsonify(rows)
    finally:
        conn.close()


@employee_bp.route("/employees", methods=["POST"])
@admin_required
def create_employee():
    data = request.json

    if not data.get("username"):
        return jsonify({"error": "Username is required"}), 400
    if not data.get("password"):
        return jsonify({"error": "Password is required"}), 400

    conn = get_connection()
    try:
        cursor = conn.cursor()

        password_hash = generate_password_hash(data["password"])

        cursor.execute("""
            INSERT INTO employee(
                pis_number, first_name, middle_name, last_name,
                gender, dob, mobile, tele_no, email,
                cadre_id, designation_id, internal_designation_id, group_id,
                user_type, username, password, is_gazetted,
                status, deleted
            )
            VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            data.get("pis_number"),
            data.get("first_name"),
            data.get("middle_name"),
            data.get("last_name"),
            data.get("gender"),
            data.get("dob"),
            data.get("mobile"),
            data.get("tele_no"),
            data.get("email"),
            data.get("cadre_id"),
            data.get("designation_id"),
            data.get("internal_designation_id"),
            data.get("group_id"),
            data.get("user_type"),
            data.get("username"),
            password_hash,
            1 if data.get("is_gazetted") else 0,
            1,      # status: active by default
            0,      # deleted: not deleted
        ))

        emp_id = cursor.lastrowid

        _sync_admin_row(
            cursor,
            emp_id=emp_id,
            user_type=data.get("user_type"),
            username=data.get("username"),
            password_hash=password_hash,
            group_id=data.get("group_id"),
        )

        conn.commit()
        cursor.close()
        return jsonify({"message": "Employee Created", "emp_id": emp_id})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@employee_bp.route("/employees/<int:id>", methods=["PUT"])
@admin_required
def update_employee(id):
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)

        # Look up the current row first, since we need the existing
        # password if the admin didn't type a new one.
        cursor.execute("SELECT * FROM employee WHERE emp_id=%s", (id,))
        current = cursor.fetchone()
        if not current:
            return jsonify({"error": "Employee not found"}), 404

        if data.get("password"):
            password_hash = generate_password_hash(data["password"])
        else:
            password_hash = current["password"]

        username = data.get("username") or current["username"]

        cursor.execute("""
            UPDATE employee
            SET
                first_name=%s,
                middle_name=%s,
                last_name=%s,
                gender=%s,
                dob=%s,
                mobile=%s,
                tele_no=%s,
                email=%s,
                cadre_id=%s,
                designation_id=%s,
                internal_designation_id=%s,
                group_id=%s,
                user_type=%s,
                username=%s,
                password=%s,
                is_gazetted=%s
            WHERE emp_id=%s
        """, (
            data.get("first_name"),
            data.get("middle_name"),
            data.get("last_name"),
            data.get("gender"),
            data.get("dob"),
            data.get("mobile"),
            data.get("tele_no"),
            data.get("email"),
            data.get("cadre_id"),
            data.get("designation_id"),
            data.get("internal_designation_id"),
            data.get("group_id"),
            data.get("user_type"),
            username,
            password_hash,
            1 if data.get("is_gazetted") else 0,
            id,
        ))

        _sync_admin_row(
            cursor,
            emp_id=id,
            user_type=data.get("user_type"),
            username=username,
            password_hash=password_hash,
            group_id=data.get("group_id"),
        )

        conn.commit()
        cursor.close()
        return jsonify({"message": "Employee Updated"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()


@employee_bp.route("/employees/<int:id>", methods=["DELETE"])
@admin_required
def delete_employee(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE employee SET deleted=TRUE WHERE emp_id=%s",
            (id,),
        )

        # Also remove their admin access, if they had any.
        cursor.execute(
            "UPDATE admin SET deleted=TRUE WHERE emp_id=%s",
            (id,),
        )

        conn.commit()
        cursor.close()
        return jsonify({"message": "Employee Deleted"})
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
@employee_bp.route("/employees/me", methods=["GET"])
@any_user_required
def get_my_profile():
    claims = get_jwt()

    if claims.get("role") != "employee":
        return jsonify({"error": "Forbidden"}), 403

    emp_id = claims.get("id")

    conn = get_connection()

    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                e.emp_id,
                e.pis_number,
                e.first_name,
                e.middle_name,
                e.last_name,
                e.gender,
                e.dob,
                e.mobile,
                e.tele_no,
                e.email,
                e.status,
                e.is_gazetted,

                c.full_name AS cadre_name,
                d.full_name AS designation_name,
                g.full_name AS group_name

            FROM employee e

            LEFT JOIN cadre c
                ON e.cadre_id = c.cadre_id

            LEFT JOIN designation d
                ON e.designation_id = d.designation_id

            LEFT JOIN employee_group g
                ON e.group_id = g.group_id

            WHERE e.emp_id = %s
              AND e.deleted = FALSE
        """, (emp_id,))

        employee = cursor.fetchone()

        if not employee:
            return jsonify({"error": "Employee not found"}), 404

        return jsonify(employee)

    finally:
        conn.close()