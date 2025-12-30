from flask import Blueprint, send_from_directory, session, redirect, url_for
from config.app_config import HTML_DIR

page_bp = Blueprint("pages", __name__)

# ---------------- LOGIN ----------------
@page_bp.route("/")
@page_bp.route("/login")
@page_bp.route("/loginPage.html")
def login_page():
    return send_from_directory(HTML_DIR, "loginPage.html")


# ---------------- SIGNUP ----------------
@page_bp.route("/signUp.html")
def signup_page():
    return send_from_directory(HTML_DIR, "signUp.html")


# ---------------- LOGIN SUCCESS ----------------
@page_bp.route("/login-success")
@page_bp.route("/login-success.html")
def login_success_page():
    if "user" not in session:
        return redirect(url_for("pages.login_page"))
    return send_from_directory(HTML_DIR, "login-success.html")


# ---------------- DASHBOARD ----------------
@page_bp.route("/dashboard")
@page_bp.route("/dashboard.html")
def dashboard_page():
    if "user" not in session:
        return redirect(url_for("pages.login_page"))
    return send_from_directory(HTML_DIR, "dashboard.html")


# ---------------- CONTACT ----------------
@page_bp.route("/contact.html")
def contact_page():
    if "user" not in session:
        return redirect(url_for("pages.login_page"))
    return send_from_directory(HTML_DIR, "contact.html")


# ---------------- DOCUMENTS ----------------
@page_bp.route("/documents.html")
def documents_page():
    if "user" not in session:
        return redirect(url_for("pages.login_page"))
    return send_from_directory(HTML_DIR, "documents.html")


# ---------------- LOGOUT ----------------
@page_bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("pages.login_page"))
