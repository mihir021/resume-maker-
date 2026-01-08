from config.db import db
from utils.crypto_utils import CryptoUtils

class AdminDataService:

    def dashboard(self):
        users = db["users"].count_documents({})
        resumes = db["resumes"].count_documents({})
        feedbacks = db["feedbacks"].count_documents({})

        providers = {"local": 0, "google": 0}
        for u in db["users"].find({}):
            providers[u.get("provider", "local")] += 1

        return {
            "total_users": users,
            "total_resumes": resumes,
            "total_feedbacks": feedbacks,
            "providers": providers
        }

    def users(self):
        rows = []
        for u in db["users"].find({}):
            rows.append({
                "name": CryptoUtils.decode(u["name"]) if u.get("provider") == "local" else u.get("name"),
                "email": CryptoUtils.decode(u["email"]) if u.get("provider") == "local" else u.get("email"),
                "provider": u.get("provider"),
                "role": u.get("role", "user"),
                "status": u.get("status", "active"),
                "created_at": u.get("created_at")
            })
        return rows

    def resumes(self):
        pipeline = [
            {"$group": {"_id": "$user_email", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        return {
            "total": db["resumes"].count_documents({}),
            "per_user": list(db["resumes"].aggregate(pipeline))
        }

    def health(self):
        return {
            "flask": "ok",
            "mongo": "connected",
            "redis": "connected"
        }
