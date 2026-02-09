from datetime import datetime
from repo.resume_repo import ResumeRepo
from utils.crypto_utils import CryptoUtils
from bson import ObjectId
from utils.logger import setup_logger

service_logger = setup_logger(
    name="RESUME_SERVICE",
    log_file="service.log"
)

class ResumeService:
    def __init__(self):
        self.repo = ResumeRepo()

    # ✅ ADMIN: GET ALL RESUMES (FOR LIST + CSV)
    def get_all_resumes_for_admin(self):
        resumes = self.repo.find_all_resumes()
        result = []

        for r in resumes:
            result.append({
                "email": CryptoUtils.decode(r.get("user_email", "")),
                "title": r.get("title", ""),
                "created_at": r.get("created_at")
            })

        return result

    # ---------------- USER ACTIONS ----------------
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

        for r in resumes:
            r["_id"] = str(r["_id"])

        return resumes

    def get_resume_by_id(self, resume_id):
        resume = self.repo.find_by_id(ObjectId(resume_id))
        if not resume:
            return None

        resume["_id"] = str(resume["_id"])
        return resume

    def delete_resume(self, email, resume_id):
        encoded_email = CryptoUtils.encode(email)
        return self.repo.delete_by_id(encoded_email, resume_id)
