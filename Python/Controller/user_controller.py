from flask import Blueprint, request, jsonify, redirect, session, url_for

from DTO.user_login_dto import UserLoginDTO
from DTO.user_signup_dto import UserSignupDTO
from services.user_service import UserService
from utils.validators import is_valid_gmail, validate_password

user_bp = Blueprint("user", __name__)
user_service = UserService()


# ---------------- HEALTH CHECK ----------------
@user_bp.get("/hc")
def hc():
    return "done"


# ---------------- CURRENT USER ----------------
@user_bp.route("/me", methods=["GET"])
def get_me():
    if "user" not in session:
        return jsonify({"authenticated": False}), 401

    return jsonify({
        "authenticated": True,
        "user": session["user"]
    })


# ---------------- SIGNUP ----------------
@user_bp.post("/signup")
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm = request.form.get("confirm_password")

    # ---------- Basic field check ----------
    if not all([name, email, password, confirm]):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    # ---------- Email validation ----------
    if not is_valid_gmail(email):
        return jsonify({
            "success": False,
            "message": "Email must be a valid @gmail.com address"
        }), 400

    # ---------- Password match ----------
    if password != confirm:
        return jsonify({
            "success": False,
            "message": "Passwords do not match"
        }), 400

    # ---------- Password rules ----------
    valid, message = validate_password(password)
    if not valid:
        return jsonify({
            "success": False,
            "message": message
        }), 400

    # ---------- DTO validation ----------
    dto = UserSignupDTO(name, email, password)
    if not dto.is_valid():
        return jsonify({
            "success": False,
            "message": "Invalid signup data"
        }), 400

    # ---------- Service call ----------
    result = user_service.create_user(dto)
    return jsonify(result), 201 if result.get("success") else 400

# ---------------- LOGIN (EMAIL / PASSWORD) ----------------
@user_bp.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")

    # ---------- Field check ----------
    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    # ---------- Email validation ----------
    if not is_valid_gmail(email):
        return jsonify({
            "success": False,
            "message": "Only @gmail.com emails are allowed"
        }), 400

    # # ---------- Password format validation ----------
    # valid, _ = validate_password(password)
    # if not valid:
    #     return jsonify({
    #         "success": False,
    #         "message": "Invalid password format"
    #     }), 400

    # ---------- DTO ----------
    dto = UserLoginDTO(email=email, password=password)
    if not dto.is_valid():
        return jsonify({
            "success": False,
            "message": "Invalid login data"
        }), 400

    result = user_service.login_user(dto)

    # ❌ LOGIN FAILED
    if not result.get("success"):
        return jsonify(result), 401

    user = result["user"]

    # 🚫 GOOGLE USERS CANNOT LOGIN VIA PASSWORD
    if user.get("provider") == "google":
        return jsonify({
            "success": False,
            "message": "Please login using Google"
        }), 403

    # ✅ SESSION
    session["user"] = {
        "name": user["name"],
        "email": user["email"],
        "provider": "local"
    }

    return jsonify({
        "success": True,
        "message": "Login successful"
    }), 200

