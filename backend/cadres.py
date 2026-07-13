from flask import Blueprint, request, jsonify
from db import get_connection
from decorators import admin_required, any_user_required

cadre_bp = Blueprint("cadres", __name__)


@cadre_bp.route("/cadres")
@any_user_required
def get_cadres():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT *
            FROM cadre
            WHERE deleted = FALSE
        """)
        cadres = cursor.fetchall()
        cursor.close()
        return jsonify(cadres)
    finally:
        conn.close()


@cadre_bp.route("/cadres", methods=["POST"])
@admin_required
def create_cadre():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
        cursor.close()
        return jsonify({
            "message": "Cadre Created"
        })
    finally:
        conn.close()

        

@cadre_bp.route("/cadres/<int:id>", methods=["PUT"])
@admin_required
def update_cadre(id):
    data = request.json

    conn = get_connection()
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE cadre
            SET
                sname = %s,
                full_name = %s
            WHERE cadre_id = %s
            """,
            (
                data["sname"],
                data["full_name"],
                id
            )
        )

        cursor.close()

        return jsonify({
            "message": "Cadre Updated"
        })

    finally:
        conn.close()

@cadre_bp.route("/cadres/<int:id>", methods=["DELETE"])
@admin_required
def delete_cadre(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE cadre
            SET deleted = TRUE
            WHERE cadre_id=%s
            """,
            (id,)
        )
        cursor.close()
        return jsonify({
            "message": "Cadre Deleted"
        })
    finally:
        conn.close()
