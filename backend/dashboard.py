from flask import Blueprint, jsonify
from db import get_connection
from decorators import any_user_required

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard")
@any_user_required
def dashboard():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) AS count FROM employee")
        employees = cursor.fetchone()["count"]

        cursor.execute("""
            SELECT COUNT(*) AS count
            FROM cadre
            WHERE deleted = FALSE
        """)
        cadres = cursor.fetchone()["count"]

        cursor.execute("""
            SELECT COUNT(*) AS count
            FROM designation
            WHERE deleted = FALSE
        """)
        designations = cursor.fetchone()["count"]

        cursor.execute("""
            SELECT COUNT(*) AS count
            FROM employee_group
            WHERE deleted = FALSE
        """)
        groups = cursor.fetchone()["count"]

        cursor.close()
        return jsonify({
            "employees": employees,
            "cadres": cadres,
            "designations": designations,
            "groups": groups,
        })
    finally:
        conn.close()