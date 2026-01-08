from flask import Blueprint, request, jsonify
from services.admin_user_action_service import AdminUserActionService

admin_user_action_bp = Blueprint("admin_user_action", __name__)
service = AdminUserActionService()

@admin_user_action_bp.route("/users/block", methods=["POST"])
def block_user():
    email = request.json.get("email")
    return jsonify(service.block_user(email))

@admin_user_action_bp.route("/users/unblock", methods=["POST"])
def unblock_user():
    email = request.json.get("email")
    return jsonify(service.unblock_user(email))

@admin_user_action_bp.route("/users/delete", methods=["POST"])
def delete_user():
    email = request.json.get("email")
    return jsonify(service.delete_user(email))
