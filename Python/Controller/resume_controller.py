from flask import Blueprint, request, jsonify, session
from services.resume_service import ResumeService
from services.resume_score_service import calculate_resume_score

resume_bp = Blueprint("resume", __name__)
resume_service = ResumeService()

@resume_bp.post("/")
def create_resume():
    if "user" not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    data = request.get_json()
    result = resume_service.create_resume(
        session["user"]["email"],
        data
    )
    return jsonify(result)

from services.resume_ranking_service import rank_resumes

@resume_bp.get("/")
def get_resumes():
    if "user" not in session:
        return jsonify([]), 401

    resumes = resume_service.get_user_resumes(
        session["user"]["email"]
    )

    # 🔥 APPLY DS-BASED RANKING
    ranked_resumes = rank_resumes(
        resumes,
        session["user"]["email"]
    )

    return jsonify(ranked_resumes)


@resume_bp.get("/<resume_id>")
def get_single_resume(resume_id):
    if "user" not in session:
        return jsonify({"success": False}), 401

    resume = resume_service.get_resume_by_id(
        session["user"]["email"],
        resume_id
    )

    return jsonify(resume)


@resume_bp.get("/score/<resume_id>")
def get_resume_score(resume_id):
    if "user" not in session:
        return jsonify({"success": False}), 401

    resume = resume_service.get_resume_by_id(
        session["user"]["email"],
        resume_id
    )

    if not resume:
        return jsonify({"error": "Resume not found"}), 404

    score, breakdown = calculate_resume_score(resume)

    return jsonify({
        "score": score,
        "breakdown": breakdown
    })
