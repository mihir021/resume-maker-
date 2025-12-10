from flask import Blueprint, request, jsonify

from Python.DTO.user_signup_dto import UserSignupDTO
from Python.services.user_service import UserService

user_bp = Blueprint("user", __name__)
user_service = UserService()

@user_bp.post("/signup")
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm = request.form.get("confirm_password")

    if password != confirm:
        return jsonify({"error": "Passwords do not match"}), 400

    dto = UserSignupDTO(name, email, password)

    if not dto.is_valid():
        return jsonify({"error": "Missing required fields"}), 400

    result = user_service.create_user(dto)
    return jsonify(result)
