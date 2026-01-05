from werkzeug.security import check_password_hash
from repo.user_repo import UserRepo
from utils.crypto_utils import CryptoUtils


class AdminService:
    def __init__(self):
        self.repo = UserRepo()

    def login_admin(self, email, password):
        # Admin emails are stored encoded (local users)
        encoded_email = CryptoUtils.encode(email)

        user = self.repo.find_user_by_email(encoded_email)
        if not user:
            return {"success": False, "message": "Admin not found"}

        # Role check
        if user.get("role") != "admin":
            return {"success": False, "message": "Access denied"}

        # Provider check
        if user.get("provider") == "google":
            return {"success": False, "message": "Google admins not allowed"}

        # Password check (hashed)
        if not check_password_hash(user.get("password", ""), password):
            return {"success": False, "message": "Invalid credentials"}

        return {
            "success": True,
            "admin": {
                "name": CryptoUtils.decode(user.get("name", "")),
                "email": CryptoUtils.decode(user.get("email", "")),
                "role": "admin"
            }
        }
