from flask import Blueprint, request, jsonify, redirect, session, url_for

from DTO.user_login_dto import UserLoginDTO
from DTO.user_signup_dto import UserSignupDTO
from services.user_service import UserService

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
@user_bp.route("/signup", methods=["POST"])
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


# ---------------- LOGIN (EMAIL / PASSWORD) ----------------
@user_bp.route("/login", methods=["POST"])
def login():
    dto = UserLoginDTO(
        email=request.form.get("email"),
        password=request.form.get("password")
    )

    if not dto.is_valid():
        return redirect(url_for("pages.login_page"))

    result = user_service.login_user(dto)

    # ❌ LOGIN FAILED
    if not result["success"]:
        # OPTIONAL: flash message later
        return redirect(url_for("pages.login_page"))

    user = result["user"]

    # 🚫 GOOGLE USERS CANNOT LOGIN VIA PASSWORD
    if user.get("provider") == "google":
        return redirect(url_for("pages.login_page"))

    # ✅ SESSION (MATCHES GOOGLE STRUCTURE)
    session["user"] = {
        "name": user["name"],
        "email": user["email"],
        "provider": "local"
    }

    return redirect("/dashboard")
