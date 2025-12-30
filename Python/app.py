from flask import Flask
from flask_cors import CORS

from config.app_config import Config, FSD_DIR
from Controller.user_controller import user_bp
from Controller.chat_controller import chat_api
from Controller.Google import google_bp, init_oauth
from Controller.page_controller import page_bp
from config.redis_config import redis_client


def create_app():
    app = Flask(
        __name__,
        static_folder=FSD_DIR,
        static_url_path=""
    )

    # 🔐 Core config
    app.config.from_object(Config)

    # ✅ REQUIRED for sessions + OAuth
    app.secret_key = app.config.get("SECRET_KEY", "dev-secret-key")

    # 🌐 CORS (safe for credentials)
    CORS(
        app,
        supports_credentials=True,
        origins=[
            "http://127.0.0.1:5000",
            "http://localhost:5000"
        ]
    )

    # 🔐 Google OAuth init
    init_oauth(app)

    # 🔴 Redis check (safe)
    try:
        redis_client.ping()
        print("✅ Redis connected")
    except Exception as e:
        print("⚠ Redis unavailable:", e)

    # ✅ Blueprints (REGISTER ONCE)
    app.register_blueprint(page_bp)
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(chat_api, url_prefix="/api/chat")
    app.register_blueprint(google_bp)  # url_prefix defined inside blueprint

    # 🧪 Optional debug
    print("✅ Flask app initialized successfully")

    return app
