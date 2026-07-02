from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from db import cursor, db
from decorators import admin_required, any_user_required

admin_bp = Blueprint("admins", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@admin_bp.route("/admins")
@any_user_required
def get_admins():

    ensure_connection()

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

    return jsonify(cursor.fetchall())


@admin_bp.route("/admins", methods=["POST"])
@admin_required
def create_admin():

    ensure_connection()

    data = request.json

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

    db.commit()

    return jsonify({
        "message": "Admin Created"
    })


@admin_bp.route("/admins/<int:id>", methods=["DELETE"])
@admin_required
def delete_admin(id):

    ensure_connection()

    cursor.execute("""
        UPDATE admin
        SET deleted = TRUE
        WHERE id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Admin Deleted"
    })