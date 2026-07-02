from flask import Blueprint, request, jsonify
from db import cursor, db
from decorators import admin_required, any_user_required

designation_bp = Blueprint("designations", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@designation_bp.route("/designations")
@any_user_required
def get_designations():
    ensure_connection()

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

    return jsonify(cursor.fetchall())


@designation_bp.route("/designations", methods=["POST"])
@admin_required
def create_designation():
    ensure_connection()

    data = request.json

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

    db.commit()

    return jsonify({
        "message": "Designation Created"
    })


@designation_bp.route("/designations/<int:id>", methods=["DELETE"])
@admin_required
def delete_designation(id):
    ensure_connection()

    cursor.execute("""
        UPDATE designation
        SET deleted = TRUE
        WHERE designation_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Designation Deleted"
    })