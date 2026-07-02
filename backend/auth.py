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


def _find_user(username):
    """Look up a user by username across admin, employee, and adgh.

    Checks admin, then employee (must also have status = TRUE), then adgh.
    Returns (user_row, role) or (None, None) if no match is found.
    """
    cursor.execute(
        """
        SELECT *
        FROM admin
        WHERE username = %s AND deleted = FALSE
        """,
        (username,),
    )
    user = cursor.fetchone()
    if user:
        return user, "admin"

    cursor.execute(
        """
        SELECT *
        FROM employee
        WHERE username = %s AND deleted = FALSE AND status = TRUE
        """,
        (username,),
    )
    user = cursor.fetchone()
    if user:
        return user, "employee"

    cursor.execute(
        """
        SELECT *
        FROM adgh
        WHERE username = %s AND deleted = FALSE
        """,
        (username,),
    )
    user = cursor.fetchone()
    if user:
        return user, "adgh"

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
    # employee's primary key column is named emp_id, not id
    return user["emp_id"] if role == "employee" else user["id"]


def _display_name(user, role):
    if role == "employee":
        parts = [user.get("first_name"), user.get("middle_name"), user.get("last_name")]
        return " ".join(p for p in parts if p)
    if role == "adgh":
        return user.get("display_name")
    return user.get("name")  # admin


@auth_bp.route("/login", methods=["POST"])
@auth_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json or {}
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    ensure_connection()

    user, role = _find_user(username)
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