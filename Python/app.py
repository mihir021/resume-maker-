from flask import (
    Flask,
    send_from_directory,
    session,
    jsonify,
    redirect,
    url_for
)
from flask_cors import CORS
import os

from Controller.user_controller import user_bp
from Controller.chat_controller import chat_api
from Controller.Google import google_bp, init_oauth
from Python.config.redis_config import redis_client

# ================= PATHS =================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
FSD_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "FSD"))

# ================= APP =================
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "dev-secret")

# ================= OAUTH =================
init_oauth(app)

# ================= CORS =================
CORS(app, supports_credentials=True)

# ================= REDIS =================
try:
    redis_client.ping()
    print("✅ Redis Cloud connected")
except Exception as e:
    print("⚠ Redis Cloud unavailable:", e)

# ================= BLUEPRINTS =================
app.register_blueprint(google_bp)
app.register_blueprint(user_bp)
app.register_blueprint(chat_api)

# ================= STATIC FILES =================
@app.route("/CSS/<path:filename>")
def css_files(filename):
    return send_from_directory(os.path.join(FSD_DIR, "CSS"), filename)

@app.route("/JS/<path:filename>")
def js_files(filename):
    return send_from_directory(os.path.join(FSD_DIR, "JS"), filename)

@app.route("/IMG/<path:filename>")
def img_files(filename):
    return send_from_directory(os.path.join(FSD_DIR, "IMG"), filename)

# ================= PAGES =================
@app.route("/")
@app.route("/login")
def login_page():
    return send_from_directory(
        os.path.join(FSD_DIR, "HTML"),
        "loginPage.html"
    )

@app.route("/dashboard")
def dashboard():
    if "user" not in session:
        return redirect(url_for("login_page"))
    return send_from_directory(
        os.path.join(FSD_DIR, "HTML"),
        "dashboard.html"
    )

@app.route("/login-success")
def login_success():
    return send_from_directory(
        os.path.join(FSD_DIR, "HTML"),
        "login-success.html"
    )

# ================= LOGOUT =================
@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login_page"))

# ================= AUTH API =================
@app.route("/api/me")
def api_me():
    user = session.get("user")
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(user)

# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
