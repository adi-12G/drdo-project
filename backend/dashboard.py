from flask import Blueprint, jsonify
from db import cursor, db
from decorators import any_user_required

dashboard_bp = Blueprint("dashboard", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@dashboard_bp.route("/dashboard")
@any_user_required
def dashboard():

    ensure_connection()

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

    return jsonify({
        "employees": employees,
        "cadres": cadres,
        "designations": designations,
        "groups": groups,
    })