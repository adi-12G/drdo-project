from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from db import cursor, db
from decorators import admin_required, any_user_required

adgh_bp = Blueprint("adgh", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@adgh_bp.route("/adgh")
@any_user_required
def get_adgh():

    try:
        ensure_connection()

        cursor.execute("""
            SELECT *
            FROM adgh
            WHERE deleted = FALSE
        """)

        return jsonify(cursor.fetchall())

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@adgh_bp.route("/adgh", methods=["POST"])
@admin_required
def create_adgh():

    ensure_connection()

    data = request.json

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

    db.commit()

    return jsonify({
        "message": "ADGH Created"
    })