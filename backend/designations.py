from flask import Blueprint, request, jsonify
from db import get_connection
from decorators import admin_required, any_user_required

designation_bp = Blueprint("designations", __name__)


@designation_bp.route("/designations")
@any_user_required
def get_designations():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT
                designation.designation_id,
                designation.sname,
                designation.full_name,
                cadre.full_name AS cadre_name
            FROM designation
            JOIN cadre
            ON designation.cadre_id = cadre.cadre_id
            WHERE designation.deleted = FALSE
        """)
        rows = cursor.fetchall()
        cursor.close()
        return jsonify(rows)
    finally:
        conn.close()


@designation_bp.route("/designations", methods=["POST"])
@admin_required
def create_designation():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO designation(
                cadre_id,
                sname,
                full_name
            )
            VALUES(%s,%s,%s)
        """, (
            data["cadre_id"],
            data["sname"],
            data["full_name"]
        ))
        cursor.close()
        return jsonify({
            "message": "Designation Created"
        })
    finally:
        conn.close()


@designation_bp.route("/designations/<int:id>", methods=["DELETE"])
@admin_required
def delete_designation(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE designation
            SET deleted = TRUE
            WHERE designation_id=%s
        """, (id,))
        cursor.close()
        return jsonify({
            "message": "Designation Deleted"
        })
    finally:
        conn.close()