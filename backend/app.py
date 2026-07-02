from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from auth import auth_bp
from employees import employee_bp
from cadres import cadre_bp
from designations import designation_bp
from internal_designations import internal_designation_bp
from groups import group_bp
from admins import admin_bp
from adgh import adgh_bp
from dashboard import dashboard_bp

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

app.config["JWT_SECRET_KEY"] = "drdo-secret-key-change-in-production"

jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(employee_bp)
app.register_blueprint(cadre_bp)
app.register_blueprint(designation_bp)
app.register_blueprint(internal_designation_bp)
app.register_blueprint(group_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(adgh_bp)
app.register_blueprint(dashboard_bp)


@app.route("/")
def home():
    return jsonify({"message": "Employee Management API Running"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(debug=True)