from flask import Blueprint, request, jsonify
from db import cursor, db
from decorators import admin_required, any_user_required

employee_bp = Blueprint("employees", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@employee_bp.route("/employees")
@any_user_required
def get_employees():

    ensure_connection()

    cursor.execute(
        "SELECT * FROM employee"
    )

    return jsonify(cursor.fetchall())


@employee_bp.route("/employees", methods=["POST"])
@admin_required
def create_employee():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO employee(
            pis_number,
            first_name,
            last_name,
            email,
            cadre_id,
            designation_id,
            internal_designation_id,
            group_id
        )
        VALUES(%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data["pis_number"],
        data["first_name"],
        data["last_name"],
        data["email"],
        data["cadre_id"],
        data["designation_id"],
        data["internal_designation_id"],
        data["group_id"]
    ))

    db.commit()

    return jsonify({"message": "Employee Created"})


@employee_bp.route("/employees/<int:id>", methods=["PUT"])
@admin_required
def update_employee(id):
    ensure_connection()

    data = request.json

    cursor.execute("""
        UPDATE employee
        SET
            first_name=%s,
            last_name=%s,
            email=%s
        WHERE emp_id=%s
    """, (
        data["first_name"],
        data["last_name"],
        data["email"],
        id
    ))

    db.commit()

    return jsonify({"message": "Employee Updated"})


@employee_bp.route("/employees/<int:id>", methods=["DELETE"])
@admin_required
def delete_employee(id):
    ensure_connection()

    cursor.execute(
        "DELETE FROM employee WHERE emp_id=%s",
        (id,)
    )

    db.commit()

    return jsonify({"message": "Employee Deleted"})