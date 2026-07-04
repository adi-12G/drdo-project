from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from db import get_connection
from decorators import admin_required, any_user_required

admin_bp = Blueprint("admins", __name__)

@admin_bp.route("/admins")
@any_user_required
def get_admins():
    conn = get_connection()

    try:
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                a.admin_id,
                a.emp_id,
                a.group_id,
                a.username,
                a.user_type,
                a.created_at,
                CONCAT(
                    e.first_name,
                    ' ',
                    e.last_name
                ) AS employee_name,
                g.full_name AS group_name
            FROM admin a
            LEFT JOIN employee e
                ON a.emp_id = e.emp_id
            LEFT JOIN employee_group g
                ON a.group_id = g.group_id
            WHERE a.deleted = FALSE
        """)

        rows = cursor.fetchall()
        cursor.close()

        return jsonify(rows)

    finally:
        conn.close()


@admin_bp.route("/admins", methods=["POST"])
@admin_required
def create_admin():
    data = request.json

    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO admin(
                emp_id,
                group_id,
                username,
                password,
                user_type
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            data["emp_id"],
            data["group_id"],
            data["username"],
            generate_password_hash(data["password"]),
            data["user_type"]
        ))

        conn.commit()
        cursor.close()

        return jsonify({
            "message": "Admin Created"
        })

    finally:
        conn.close()


@admin_bp.route("/admins/<int:id>", methods=["DELETE"])
@admin_required
def delete_admin(id):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE admin
            SET deleted = TRUE
            WHERE admin_id=%s
        """, (id,))

        conn.commit()
        cursor.close()

        return jsonify({
            "message": "Admin Deleted"
        })

    finally:
        conn.close()
