from flask import Blueprint, redirect, url_for, session
from authlib.integrations.flask_client import OAuth

google_bp = Blueprint("google_auth", __name__, url_prefix="/api/auth")
oauth = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    oauth.register(
        name="google",
        client_id=app.config["GOOGLE_CLIENT_ID"],
        client_secret=app.config["GOOGLE_CLIENT_SECRET"],
        access_token_url="https://oauth2.googleapis.com/token",
        authorize_url="https://accounts.google.com/o/oauth2/auth",
        api_base_url="https://www.googleapis.com/oauth2/v2/",
        client_kwargs={"scope": "openid email profile"},
    )


# ================= GOOGLE LOGIN =================
@google_bp.route("/google/login")
def google_login():
    redirect_uri = url_for(
        "google_auth.google_callback",
        _external=True
    )
    return oauth.google.authorize_redirect(redirect_uri)


# ================= GOOGLE CALLBACK =================
@google_bp.route("/google/callback")
def google_callback():
    token = oauth.google.authorize_access_token()

    user_info = oauth.google.get("userinfo").json()

    session["user"] = {
        "email": user_info["email"],
        "name": user_info["name"],
        "picture": user_info.get("picture")
    }

    return redirect("/dashboard")
