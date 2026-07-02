from flask import Blueprint, request, jsonify
from db import get_connection
from decorators import admin_required, any_user_required

group_bp = Blueprint("groups", __name__)


@group_bp.route("/groups")
@any_user_required
def get_groups():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT *
            FROM employee_group
            WHERE deleted = FALSE
        """)
        groups = cursor.fetchall()
        cursor.close()
        return jsonify(groups)
    finally:
        conn.close()


@group_bp.route("/groups", methods=["POST"])
@admin_required
def create_group():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
        cursor.close()
        return jsonify({
            "message": "Group Created"
        })
    finally:
        conn.close()


@group_bp.route("/groups/<int:id>", methods=["DELETE"])
@admin_required
def delete_group(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE employee_group
            SET deleted = TRUE
            WHERE group_id=%s
        """, (id,))
        cursor.close()
        return jsonify({
            "message": "Group Deleted"
        })
    finally:
        conn.close()