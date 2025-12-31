from flask import Blueprint, request, render_template, current_app, jsonify
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from config.db import get_users_collection
import base64
from werkzeug.security import generate_password_hash

reset_password_bp = Blueprint("reset_password_bp", __name__)

@reset_password_bp.route("/api/reset-password/<token>", methods=["GET", "POST"])
def reset_password(token):

    serializer = URLSafeTimedSerializer(current_app.secret_key)

    try:
        email = serializer.loads(
            token,
            salt="password-reset",
            max_age=3600
        )
    except (SignatureExpired, BadSignature):
        return jsonify({"success": False, "message": "Invalid or expired link"}), 400

    if request.method == "POST":
        new_password = request.form.get("password")

        if not new_password:
            return jsonify({"success": False, "message": "Password required"}), 400

        users = get_users_collection()
        hashed_password = generate_password_hash(new_password)

        # # 🔐 PASSWORD → EXACT SAME FORMAT AS LOGIN
        # PREFIX = "ABC_abc"
        # SUFFIX = "ABC_abc"
        #
        # wrapped_password = f"{PREFIX}{new_password}{SUFFIX}"
        # encoded_password = base64.b64encode(
        #     wrapped_password.encode()
        # ).decode()

        # # 🔑 EMAIL → EXACT SAME FORMAT AS DB
        # wrapped_email = f"{PREFIX}{email}{SUFFIX}"
        # encoded_email = base64.b64encode(
        #     wrapped_email.encode()
        # ).decode()

        from utils.crypto_utils import CryptoUtils
        encoded_email = CryptoUtils.encode(email)

        users.update_one(
            {"email": encoded_email},
            {"$set": {"password": hashed_password}}
        )

        return jsonify({
            "success": True,
            "message": "Password reset successful"
        })

    return redirect(url_for("pages.reset_password_page", token=token))

