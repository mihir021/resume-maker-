from datetime import datetime
from repo.resume_repo import ResumeRepo
from utils.crypto_utils import CryptoUtils
from bson import ObjectId


class ResumeService:
    def __init__(self):
        self.repo = ResumeRepo()

    def create_resume(self, email, payload):
        if not payload or "data" not in payload:
            return {"success": False, "message": "Invalid resume data"}

        resume = {
            "user_email": CryptoUtils.encode(email),
            "title": payload.get("title", "Untitled Resume"),
            "template": payload.get("template"),
            "data": payload["data"],
            "created_at": datetime.utcnow()
        }

        self.repo.create(resume)
        return {"success": True, "message": "Resume saved"}

    def get_user_resumes(self, email):
        encoded_email = CryptoUtils.encode(email)
        resumes = self.repo.find_by_user(encoded_email)

        # Convert ObjectId → string for frontend
        for r in resumes:
            r["_id"] = str(r["_id"])

        return resumes


    def get_resume_by_id(self, email, resume_id):
        encoded = CryptoUtils.encode(email)
        resume = self.repo.find_one(encoded, ObjectId(resume_id))
        resume["_id"] = str(resume["_id"])
        return resume
