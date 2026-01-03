from flask import Blueprint, request, jsonify, session
from services.resume_service import ResumeService

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

@resume_bp.get("/")
def get_resumes():
    if "user" not in session:
        return jsonify([]), 401

    resumes = resume_service.get_user_resumes(
        session["user"]["email"]
    )
    return jsonify(resumes)

@resume_bp.get("/<resume_id>")
def get_single_resume(resume_id):
    if "user" not in session:
        return jsonify({"success": False}), 401

    resume = resume_service.get_resume_by_id(
        session["user"]["email"],
        resume_id
    )

    return jsonify(resume)


