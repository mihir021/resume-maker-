from config.db import db
from utils.crypto_utils import CryptoUtils

class AdminUserActionService:

    def block_user(self, email):
        encoded = CryptoUtils.encode(email)
        res = db["users"].update_one(
            {"email": encoded},
            {"$set": {"status": "blocked"}}
        )
        return {"success": res.modified_count == 1}

    def unblock_user(self, email):
        encoded = CryptoUtils.encode(email)
        res = db["users"].update_one(
            {"email": encoded},
            {"$set": {"status": "active"}}
        )
        return {"success": res.modified_count == 1}

    def delete_user(self, email):
        encoded = CryptoUtils.encode(email)

        user = db["users"].find_one({"email": encoded})
        if user and user.get("role") == "admin":
            return {"success": False, "message": "Cannot delete admin"}

        db["users"].delete_one({"email": encoded})
        db["resumes"].delete_many({"user_email": encoded})

        return {"success": True}

