from flask import Blueprint, request, jsonify
from db import cursor, db
from decorators import admin_required, any_user_required

cadre_bp = Blueprint("cadres", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@cadre_bp.route("/cadres")
@any_user_required
def get_cadres():

    ensure_connection()
    cursor.execute("""
        SELECT *
        FROM cadre
        WHERE deleted = FALSE
    """)

    cadres = cursor.fetchall()

    return jsonify(cadres)


@cadre_bp.route("/cadres", methods=["POST"])
@admin_required
def create_cadre():
    ensure_connection()
    data = request.json

    cursor.execute(
        """
        INSERT INTO cadre(
            sname,
            full_name
        )
        VALUES(%s,%s)
        """,
        (
            data["sname"],
            data["full_name"]
        )
    )

    db.commit()

    return jsonify({
        "message": "Cadre Created"
    })


@cadre_bp.route("/cadres/<int:id>", methods=["DELETE"])
@admin_required
def delete_cadre(id):
    ensure_connection()

    cursor.execute(
        """
        UPDATE cadre
        SET deleted = TRUE
        WHERE cadre_id=%s
        """,
        (id,)
    )

    db.commit()

    return jsonify({
        "message": "Cadre Deleted"
    })