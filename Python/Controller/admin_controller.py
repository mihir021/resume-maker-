from flask import Blueprint, request, jsonify, Response
from services.admin_service import AdminService
from services.resume_service import ResumeService
from services.admin_analytics_service import AdminAnalyticsService
from utils.validators import is_valid_gmail
from utils.logger import setup_logger
from utils.crypto_utils import CryptoUtils
import csv
import io
import os

# ================= LOGGER =================
admin_logger = setup_logger(
    name="ADMIN",
    log_file="admin.log"
)

# ================= BLUEPRINT =================
admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# ================= SERVICES =================
admin_service = AdminService()
resume_service = ResumeService()
analytics_service = AdminAnalyticsService()

# ================= RESUMES =================

@admin_bp.route("/resumes", methods=["GET"])
def get_all_resumes_admin():
    resumes = resume_service.get_all_resumes_for_admin()
    return jsonify({
        "success": True,
        "data": resumes
    }), 200


# ================= ANALYTICS =================
@admin_bp.route("/analytics", methods=["GET"])
def get_analytics():
    data = analytics_service.get_analytics()

    decoded_top_users = []

    for u in data.get("top_users", []):
        encoded_email = u.get("_id")

        try:
            email = CryptoUtils.decode(encoded_email)
        except Exception:
            email = encoded_email  # fallback, NEVER hide data

        decoded_top_users.append({
            "user_email": email,
            "count": u.get("count", 0)
        })

    data["top_users"] = decoded_top_users
    return jsonify(data), 200



# ================= USERS =================

@admin_bp.route("/users", methods=["GET"])
def get_users():
    admin_logger.info("GET /api/admin/users called")
    users = admin_service.get_all_users()
    admin_logger.info(f"Fetched {len(users)} users")
    return jsonify(users), 200


@admin_bp.route("/users/block", methods=["POST"])
def block_user():
    email = request.json.get("email")
    admin_service.block_user(email)
    return jsonify({"success": True}), 200


@admin_bp.route("/users/unblock", methods=["POST"])
def unblock_user():
    email = request.json.get("email")
    admin_service.unblock_user(email)
    return jsonify({"success": True}), 200


@admin_bp.route("/users/delete", methods=["POST"])
def delete_user():
    email = request.json.get("email")
    admin_service.delete_user(email)
    return jsonify({"success": True}), 200


# ================= ADMIN LOGIN =================

@admin_bp.route("/login", methods=["POST"])
def admin_login():
    email = request.json.get("email")
    password = request.json.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    if not is_valid_gmail(email):
        return jsonify({
            "success": False,
            "message": "Invalid email format"
        }), 400

    result = admin_service.login_admin(email, password)

    if not result.get("success"):
        return jsonify(result), 401

    return jsonify(result), 200


# ================= USERS CSV EXPORT =================

@admin_bp.route("/users/export", methods=["GET"])
def export_users_csv():
    users = admin_service.get_all_users()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Name", "Provider", "Status", "Role"])

    for u in users:
        writer.writerow([
            u.get("email"),
            u.get("name"),
            u.get("provider"),
            u.get("status"),
            u.get("role")
        ])

    output.seek(0)

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"}
    )


# ================= RESUMES CSV EXPORT =================

@admin_bp.route("/resumes/export", methods=["GET"])
def export_resumes_csv():
    data = resume_service.get_all_resumes_for_admin()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Email", "Title", "Created At"])

    for r in data:
        writer.writerow([
            r.get("email", ""),
            r.get("title", ""),
            r.get("created_at", "")
        ])

    output.seek(0)

    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment; filename=resumes.csv"}
    )


# ================= LOGS =================

@admin_bp.route("/logs", methods=["GET"])
def get_logs():
    log_type = request.args.get("type", "admin")
    log_file = f"logs/{log_type}.log"

    if not os.path.exists(log_file):
        return jsonify({
            "success": False,
            "message": "Log file not found"
        }), 404

    with open(log_file, "r", encoding="utf-8") as f:
        lines = f.readlines()[-200:]

    return jsonify({
        "success": True,
        "logs": lines
    }), 200
