from flask import Blueprint, request, jsonify
from db import cursor, db
from decorators import admin_required, any_user_required

internal_designation_bp = Blueprint("internal_designations", __name__)


def ensure_connection():
    global db, cursor
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@internal_designation_bp.route("/internal-designations")
@any_user_required
def get_internal_designations():
    ensure_connection()
    cursor.execute("""
        SELECT *
        FROM internal_designation
        WHERE deleted = FALSE
    """)

    return jsonify(cursor.fetchall())


@internal_designation_bp.route("/internal-designations", methods=["POST"])
@admin_required
def create_internal_designation():
    ensure_connection()

    data = request.json

    cursor.execute("""
        INSERT INTO internal_designation(
            sname,
            full_name
        )
        VALUES(%s,%s)
    """, (
        data["sname"],
        data["full_name"]
    ))

    db.commit()

    return jsonify({
        "message": "Internal Designation Created"
    })


@internal_designation_bp.route("/internal-designations/<int:id>", methods=["DELETE"])
@admin_required
def delete_internal_designation(id):
    ensure_connection()

    cursor.execute("""
        UPDATE internal_designation
        SET deleted = TRUE
        WHERE internal_designation_id=%s
    """, (id,))

    db.commit()

    return jsonify({
        "message": "Internal Designation Deleted"
    })