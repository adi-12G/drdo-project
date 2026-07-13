# Requirements

This file is the canonical reference for the project dependencies that are actually used by the codebase.

## Frontend Runtime Dependencies

- `react`
- `react-dom`
- `react-router-dom`

## Frontend Build and Development Dependencies

- `vite`
- `@vitejs/plugin-react`
- `eslint`
- `@eslint/js`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `tailwindcss`
- `@tailwindcss/postcss`

## Backend Runtime Dependencies

- `flask`
- `flask-cors`
- `flask-jwt-extended`
- `mysql-connector-python`
- `python-dotenv`

## Backend Transitive Runtime Dependency

- `Werkzeug` is required at runtime because the backend imports `werkzeug.security` in the auth and employee flows. It is installed transitively through `flask`.

## Deployment Only

- `gunicorn` is used for serving the backend in production deployments.

## Not Currently Used Directly

- `bcrypt` appears in the old requirements files, but the current backend code uses `werkzeug.security` for password hashing instead.

## Notes

- The repo currently contains `requirements.txt` files in the root and in `backend/` for pip compatibility.
- This document is the source of truth for what the application actually depends on.