from flask import Blueprint, jsonify
from services.admin_data_service import AdminDataService

admin_data_bp = Blueprint("admin_data", __name__)
service = AdminDataService()

@admin_data_bp.get("/dashboard")
def dashboard():
    return jsonify(service.dashboard())

@admin_data_bp.get("/users")
def users():
    return jsonify(service.users())

@admin_data_bp.get("/resumes")
def resumes():
    return jsonify(service.resumes())

@admin_data_bp.get("/health")
def health():
    return jsonify(service.health())
