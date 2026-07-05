from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from db import get_connection
from decorators import admin_required, any_user_required

adgh_bp = Blueprint("adgh", __name__)


@adgh_bp.route("/adgh")
@any_user_required
def get_adgh():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
    SELECT
    a.id,
        a.display_name,
        a.emp_id,
        a.group_id,
        a.username,
        e.first_name,
        e.last_name,
        g.full_name AS group_name
    FROM adgh a
    LEFT JOIN employee e
        ON a.emp_id = e.emp_id
    LEFT JOIN employee_group g
        ON a.group_id = g.group_id
    WHERE a.deleted = FALSE
""")
        rows = cursor.fetchall()
        cursor.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500
    finally:
        conn.close()
@adgh_bp.route("/adgh/<int:id>", methods=["DELETE"])
@admin_required
def delete_adgh(id):
    conn = get_connection()

    try:
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE adgh
            SET deleted = TRUE
            WHERE id = %s
        """, (id,))

        conn.commit()
        cursor.close()

        return jsonify({
            "message": "ADGH Deleted"
        })

    finally:
        conn.close()

@adgh_bp.route("/adgh", methods=["POST"])
@admin_required
def create_adgh():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO adgh(
                display_name,
                emp_id,
                group_id,
                username,
                password
            )
            VALUES(%s,%s,%s,%s,%s)
        """, (
            data["display_name"],
            data["emp_id"],
            data["group_id"],
            data["username"],
            generate_password_hash(data["password"])
        ))
        conn.commit()
        cursor.close()
        return jsonify({
            "message": "ADGH Created"
        })
    finally:
        conn.close()

        
