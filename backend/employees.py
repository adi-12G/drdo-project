from flask import Blueprint, request, jsonify
from db import get_connection
from decorators import admin_required, any_user_required

employee_bp = Blueprint("employees", __name__)


@employee_bp.route("/employees")
@any_user_required
def get_employees():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employee")
        rows = cursor.fetchall()
        cursor.close()
        return jsonify(rows)
    finally:
        conn.close()


@employee_bp.route("/employees", methods=["POST"])
@admin_required
def create_employee():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
        cursor.close()
        return jsonify({"message": "Employee Created"})
    finally:
        conn.close()


@employee_bp.route("/employees/<int:id>", methods=["PUT"])
@admin_required
def update_employee(id):
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
        cursor.close()
        return jsonify({"message": "Employee Updated"})
    finally:
        conn.close()


@employee_bp.route("/employees/<int:id>", methods=["DELETE"])
@admin_required
def delete_employee(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM employee WHERE emp_id=%s",
            (id,)
        )
        cursor.close()
        return jsonify({"message": "Employee Deleted"})
    finally:
        conn.close()