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
                admin.id,
                admin.name,
                admin.g_id,
                admin.username,
                admin.user_type,
                admin.`timestamp`,
                employee_group.full_name AS group_name
            FROM admin
            LEFT JOIN employee_group
                ON admin.g_id = employee_group.group_id
            WHERE admin.deleted = FALSE
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
                name,
                g_id,
                username,
                password,
                user_type
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            data["name"],
            data.get("g_id"),
            data["username"],
            generate_password_hash(data["password"]),
            data["user_type"]
        ))
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
            WHERE id=%s
        """, (id,))
        cursor.close()
        return jsonify({
            "message": "Admin Deleted"
        })
    finally:
        conn.close()