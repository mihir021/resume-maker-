import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FSD_DIR = os.path.join(BASE_DIR, "FSD")

HTML_DIR = os.path.join(FSD_DIR, "HTML")
CSS_DIR = os.path.join(FSD_DIR, "CSS")
JS_DIR = os.path.join(FSD_DIR, "JS")
IMG_DIR = os.path.join(FSD_DIR, "IMG")

class Config:
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY", "dev-secret")

    # Google OAuth
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")

    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
