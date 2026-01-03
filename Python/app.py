from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

from config.app_config import Config, FSD_DIR
from Controller.user_controller import user_bp
from Controller.chat_controller import chat_api
from Controller.Google import google_bp, init_oauth
from Controller.page_controller import page_bp
from config.redis_config import redis_client
from Controller.contact_email_controller import contact_api
from Controller.forgot_password_controller import forgot_password_bp
from Controller.reset_password_controller import reset_password_bp
from Controller.resume_controller import resume_bp


def create_app():
    load_dotenv()

    app = Flask(
        __name__,
        static_folder=FSD_DIR,
        static_url_path=""
    )

    # ================= CORE CONFIG =================
    app.config.from_object(Config)

    # 🔐 REQUIRED for sessions + OAuth
    app.secret_key = app.config.get("SECRET_KEY", "dev-secret-key")

    # 🔥 CRITICAL: Session cookie config (OAuth safe)
    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",   # REQUIRED for Google OAuth
        SESSION_COOKIE_SECURE=False      # True only in production (HTTPS)
    )

    # ================= CORS (API ONLY) =================
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://127.0.0.1:5000",
                    "http://localhost:5000"
                ]
            }
        },
        supports_credentials=True
    )

    # ================= MAIL CONFIG =================
    app.config.update(
        MAIL_SERVER="smtp.gmail.com",
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USERNAME=os.getenv("EMAIL_USER"),
        MAIL_PASSWORD=os.getenv("EMAIL_PASS")
    )

    # ================= MAIL INIT =================
    import utils.mail_utils as mail_utils
    mail_utils.init_mail(app)

    # ================= GOOGLE OAUTH INIT =================
    init_oauth(app)

    # ================= REDIS CHECK =================
    try:
        redis_client.ping()
        print("✅ Redis connected")
    except Exception as e:
        print("⚠ Redis unavailable:", e)

    # ================= BLUEPRINTS =================
    app.register_blueprint(page_bp)
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(chat_api, url_prefix="/api/chat")
    app.register_blueprint(google_bp)          # /api/auth/*
    app.register_blueprint(contact_api)
    app.register_blueprint(forgot_password_bp)
    app.register_blueprint(reset_password_bp)
    app.register_blueprint(resume_bp, url_prefix="/api/resumes")

    print("✅ Flask app initialized successfully")

    return app
