from dotenv import load_dotenv
load_dotenv()  # 🔥 MUST be before Config import

from flask import Flask
from flask_cors import CORS
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
from Controller.feedback_controller import feedback_bp
from Controller.admin_controller import admin_bp
from Controller.admin_data_controller import admin_data_bp
from Controller.admin_analytics_controller import admin_analytics_bp
from Controller.admin_user_action_controller import admin_user_action_bp
from Controller.ai_resume_controller import ai_resume_bp
from Controller.skill_controller import skill_bp

def create_app():
    app = Flask(
        __name__,
        static_folder=FSD_DIR,
        static_url_path=""
    )

    # ================= CORE CONFIG =================
    app.config.from_object(Config)

    # 🔥 FAIL FAST (NO SILENT OAUTH BREAKS)
    if not app.config.get("SECRET_KEY"):
        raise RuntimeError("❌ SECRET_KEY missing in .env")

    if not app.config.get("GOOGLE_CLIENT_ID"):
        raise RuntimeError("❌ GOOGLE_CLIENT_ID missing in .env")

    if not app.config.get("GOOGLE_CLIENT_SECRET"):
        raise RuntimeError("❌ GOOGLE_CLIENT_SECRET missing in .env")

    # 🔐 REQUIRED for sessions + OAuth
    app.secret_key = app.config["SECRET_KEY"]

    # 🔥 Session cookie config (OAuth safe)
    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False  # True only in production (HTTPS)
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
    app.register_blueprint(feedback_bp)
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(admin_data_bp, url_prefix="/api/admin")
    app.register_blueprint(admin_analytics_bp, url_prefix="/api/admin")
    app.register_blueprint(admin_user_action_bp, url_prefix="/api/admin")
    app.register_blueprint(ai_resume_bp)
    app.register_blueprint(skill_bp, url_prefix="/api/skills")
    print("✅ Flask app initialized successfully")
    print("OPENAI_API_KEY =", os.getenv("OPENAI_API_KEY"))
    print(app.config["GOOGLE_CLIENT_ID"])  # debug – remove later

    return app
