# Controller/Google.py
from flask import Blueprint, redirect, url_for, session
from authlib.integrations.flask_client import OAuth
import os
import secrets

from Python.services.user_service import UserService

google_bp = Blueprint("google", __name__)
oauth = OAuth()
user_service = UserService()


def init_oauth(app):
    oauth.init_app(app)

    oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={
            "scope": "openid email profile"
        }
    )


@google_bp.route("/auth/google")
def google_login():
    # 🔐 CSRF protection (nonce)
    nonce = secrets.token_urlsafe(16)
    session["google_nonce"] = nonce

    redirect_uri = url_for("google.google_callback", _external=True)
    return oauth.google.authorize_redirect(
        redirect_uri=redirect_uri,
        nonce=nonce
    )


@google_bp.route("/auth/google/callback")
def google_callback():
    nonce = session.pop("google_nonce", None)

    # ✅ Exchange code → token
    token = oauth.google.authorize_access_token()

    # ✅ Validate ID token using nonce
    profile = oauth.google.parse_id_token(token, nonce=nonce)

    # ✅ Save / fetch user from DB
    user = user_service.login_with_google(profile)

    # ✅ Session (used across app)
    session["user"] = {
        "email": user["email"],
        "name": user.get("name"),
        "avatar": user.get("avatar"),
        "provider": "google"
    }

    # ✅ Redirect with success
    return redirect("/login-success")
