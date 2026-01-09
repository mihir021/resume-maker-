from flask import Blueprint, request, jsonify
from services.skill_suggestion_service import suggest_skills

skill_bp = Blueprint("skills", __name__)

@skill_bp.get("/suggest")
def skill_suggest():
    q = request.args.get("q", "")
    return jsonify(suggest_skills(q))
