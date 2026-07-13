from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from db import get_connection

auth_bp = Blueprint("auth", __name__)

def _find_user(cursor, username):
    cursor.execute("""
        SELECT *
        FROM admin
        WHERE username=%s AND deleted=FALSE
    """, (username,))
    rows = cursor.fetchall()
    if rows:
        return rows[0], "admin"

    cursor.execute("""
        SELECT *
        FROM employee
        WHERE username=%s
        AND deleted=FALSE
        AND status=TRUE
    """, (username,))
    rows = cursor.fetchall()
    if rows:
        return rows[0], "employee"

    cursor.execute("""
        SELECT *
        FROM adgh
        WHERE username=%s
        AND deleted=FALSE
    """, (username,))
    rows = cursor.fetchall()
    if rows:
        return rows[0], "adgh"

    return None, None

def _verify_password(stored_password, password):
    stored_password = stored_password or ""
    if check_password_hash(stored_password, password):
        return True
    # Temporary compatibility path for legacy plain-text seeded passwords.
    if stored_password == password:
        return True
    return False

def _user_id(user, role):
    if role == "employee":
        return user["emp_id"]
    elif role == "admin":
        return user["admin_id"]
    elif role == "adgh":
        return user["id"]   

def _display_name(user, role):
    if role == "employee":
        parts = [
            user.get("first_name"),
            user.get("middle_name"),
            user.get("last_name"),
        ]
        return " ".join(p for p in parts if p)

    if role == "adgh":
        return user.get("display_name")

    return user.get("username")


@auth_bp.route("/login", methods=["POST"])
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    conn = get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        user, role = _find_user(cursor, username)
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        if not _verify_password(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        token = create_access_token(
            identity=f"{role}:{_user_id(user, role)}",
            additional_claims={
                "id": _user_id(user, role),
                "username": user["username"],
                "role": role,
            },
        )

        return jsonify(
            {
                "token": token,
                "user": {
                    "name": _display_name(user, role),
                    "username": user["username"],
                    "role": role,
                },
            }
        )
    finally:
        conn.close()
