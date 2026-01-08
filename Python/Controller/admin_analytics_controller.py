from flask import Blueprint, jsonify
from services.admin_analytics_service import AdminAnalyticsService

admin_analytics_bp = Blueprint("admin_analytics", __name__)
service = AdminAnalyticsService()

@admin_analytics_bp.get("/analytics")
def analytics():
    return jsonify(service.analytics())
