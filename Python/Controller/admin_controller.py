from flask import Blueprint, request, jsonify
from services.admin_service import AdminService
from utils.validators import is_valid_gmail

admin_bp = Blueprint("admin", __name__)
admin_service = AdminService()


@admin_bp.post("/login")
def admin_login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    if not is_valid_gmail(email):
        return jsonify({
            "success": False,
            "message": "Invalid email format"
        }), 400

    result = admin_service.login_admin(email, password)

    if not result.get("success"):
        return jsonify(result), 401

    return jsonify(result), 200
