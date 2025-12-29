from werkzeug.security import check_password_hash

from Python.repo.user_repo import UserRepo
from Python.utilis.crypto_utils import CryptoUtils


class UserService:
    def __init__(self):
        self.repo = UserRepo()

    def create_user(self, dto):
        data = dto.to_dict()

        # Encode sensitive fields
        data["name"] = CryptoUtils.encode(data["name"])
        data["email"] = CryptoUtils.encode(data["email"])
        data["password"] = CryptoUtils.encode(data["password"])

        if self.repo.find_user_by_email(data["email"]):
            return {"success": False, "message": "Email already registered"}

        self.repo.create_user(data)
        return {"success": True, "message": "User registered successfully"}

    def login_user(self, dto):
        encoded_email = CryptoUtils.encode(dto.email)
        encoded_password = CryptoUtils.encode(dto.password)

        user = self.repo.find_user_by_email(encoded_email)
        if not user:
            return {"success": False, "message": "User not found"}

        if user["password"] != encoded_password:
            return {"success": False, "message": "Invalid password"}

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "name": CryptoUtils.decode(user["name"]),
                "email": CryptoUtils.decode(user["email"])
            }
        }

    def login_with_google(self, profile):
        email = profile["email"]
        name = profile.get("name", "")

        # ✅ FIXED METHOD NAME
        user = self.repo.find_user_by_email(email)

        if not user:
            user = {
                "email": email,
                "name": name,
                "provider": "google"
            }
            self.repo.create_user(user)

        return user