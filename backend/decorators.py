from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

# Maps each login role to its permission level.
# "admin" -> can create/update/delete
# "view"  -> read-only
ROLE_PERMISSIONS = {
    "admin": "admin",
    "employee": "view",
    "adgh": "view",
}


def permissions_required(*allowed_permissions):
    """Restrict a route to roles whose permission level is in allowed_permissions.

    Handles JWT verification itself, so there's no need to also stack
    @jwt_required() on top of it.
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity() or {}
            role = identity.get("role")
            permission = ROLE_PERMISSIONS.get(role)
            if permission not in allowed_permissions:
                return jsonify({"error": "Forbidden"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator


def admin_required(fn):
    """Only admin-permission users can pass. Use on create/update/delete routes."""
    return permissions_required("admin")(fn)


def any_user_required(fn):
    """Any logged-in user (admin, employee, or adgh) can pass. Use on view-only routes."""
    return permissions_required("admin", "view")(fn)