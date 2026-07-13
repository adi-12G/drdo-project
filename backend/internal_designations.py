from flask import Blueprint, request, jsonify
from db import get_connection
from decorators import admin_required, any_user_required

internal_designation_bp = Blueprint("internal_designations", __name__)


@internal_designation_bp.route("/internal-designations")
@any_user_required
def get_internal_designations():
    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT *
            FROM internal_designation
            WHERE deleted = FALSE
        """)
        rows = cursor.fetchall()
        cursor.close()
        return jsonify(rows)
    finally:
        conn.close()


@internal_designation_bp.route("/internal-designations", methods=["POST"])
@admin_required
def create_internal_designation():
    data = request.json
    conn = get_connection()
    try:
        cursor = conn.cursor()
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
        cursor.close()
        return jsonify({
            "message": "Internal Designation Created"
        })
    finally:
        conn.close()
@internal_designation_bp.route("/internal-designations/<int:id>", methods=["PUT"])
@admin_required
def update_internal_designation(id):
    data = request.json

    conn = get_connection()
    try:
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE internal_designation
            SET
                sname=%s,
                full_name=%s
            WHERE internal_designation_id=%s
            """,
            (
                data["sname"],
                data["full_name"],
                id
            )
        )

        cursor.close()

        return jsonify({
            "message": "Internal Designation Updated"
        })

    finally:
        conn.close()

@internal_designation_bp.route("/internal-designations/<int:id>", methods=["DELETE"])
@admin_required
def delete_internal_designation(id):
    conn = get_connection()
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE internal_designation
            SET deleted = TRUE
            WHERE internal_designation_id=%s
        """, (id,))
        cursor.close()
        return jsonify({
            "message": "Internal Designation Deleted"
        })
    finally:
        conn.close()
