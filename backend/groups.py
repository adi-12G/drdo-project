from flask import Blueprint, request, jsonify
from db import cursor, db
from decorators import admin_required, any_user_required

group_bp = Blueprint("groups", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@group_bp.route("/groups")
@any_user_required
def get_groups():
    ensure_connection()

    cursor.execute("""
        SELECT *
        FROM employee_group
        WHERE deleted = FALSE
    """)

    groups = cursor.fetchall()

    return jsonify(groups)


@group_bp.route("/groups", methods=["POST"])
@admin_required
def create_group():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO employee_group(
            short_name,
            full_name
        )
        VALUES(%s,%s)
    """, (
        data["short_name"],
        data["full_name"]
    ))

    db.commit()

    return jsonify({
        "message": "Group Created"
    })


@group_bp.route("/groups/<int:id>", methods=["DELETE"])
@admin_required
def delete_group(id):
    ensure_connection()

    cursor.execute("""
        UPDATE employee_group
        SET deleted = TRUE
        WHERE group_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Group Deleted"
    })