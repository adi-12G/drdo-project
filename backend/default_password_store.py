import json
from pathlib import Path


DEFAULT_PASSWORD_FILE = Path(__file__).with_name(".employee_default_password.json")
DEFAULT_FALLBACK_PASSWORD = "password123"


def get_default_password():
    if DEFAULT_PASSWORD_FILE.exists():
        try:
            payload = json.loads(DEFAULT_PASSWORD_FILE.read_text(encoding="utf-8"))
            password = (payload.get("password") or "").strip()
            if password:
                return password
        except (OSError, ValueError, json.JSONDecodeError):
            pass

    return DEFAULT_FALLBACK_PASSWORD


def set_default_password(password):
    password = (password or "").strip()
    if not password:
        raise ValueError("Default password is required")

    DEFAULT_PASSWORD_FILE.write_text(
        json.dumps({"password": password}, indent=2),
        encoding="utf-8",
    )

    return password