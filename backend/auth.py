from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import check_password_hash
from db import cursor, db


auth_bp = Blueprint("auth", __name__)


def ensure_connection():
    global db, cursor

    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
        cursor = db.cursor(dictionary=True)


@auth_bp.route("/login", methods=["POST"])
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    ensure_connection()

    cursor.execute(
        """
        SELECT *
        FROM admin
        WHERE username = %s AND deleted = FALSE
        """,
        (username,),
    )

    admin = cursor.fetchone()

    if not admin:
        return jsonify({"error": "Invalid credentials"}), 401

    stored_password = admin["password"] or ""
    password_ok = check_password_hash(stored_password, password)

    # Temporary compatibility path for legacy plain-text seeded passwords.
    if not password_ok and stored_password == password:
        password_ok = True

    if not password_ok:
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity={
            "id": admin["id"],
            "username": admin["username"],
            "user_type": admin["user_type"],
        }
    )

    return jsonify(
        {
            "token": token,
            "user": {
                "name": admin["name"],
                "username": admin["username"],
                "user_type": admin["user_type"],
            },
        }
    )
