from werkzeug.security import generate_password_hash, check_password_hash

from repo.user_repo import UserRepo
from utils.crypto_utils import CryptoUtils


class UserService:
    def __init__(self):
        self.repo = UserRepo()

    # ---------------- SIGNUP ----------------
    def create_user(self, dto):
        data = dto.to_dict()

        encoded_email = CryptoUtils.encode(data["email"])

        # ❌ Do NOT encode password with CryptoUtils
        hashed_password = generate_password_hash(data["password"])

        if self.repo.find_user_by_email(encoded_email):
            return {"success": False, "message": "Email already registered"}

        user = {
            "name": CryptoUtils.encode(data["name"]),
            "email": encoded_email,
            "password": hashed_password,
            "provider": "local"
        }

        self.repo.create_user(user)
        return {"success": True, "message": "User registered successfully"}

    # ---------------- LOGIN (EMAIL / PASSWORD) ----------------
    def login_user(self, dto):
        encoded_email = CryptoUtils.encode(dto.email)

        user = self.repo.find_user_by_email(encoded_email)
        if not user:
            return {"success": False, "message": "User not found"}

        # ✅ Correct password check
        if not check_password_hash(user["password"], dto.password):
            return {"success": False, "message": "Invalid password"}

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "name": CryptoUtils.decode(user["name"]),
                "email": CryptoUtils.decode(user["email"])
            }
        }

    # ---------------- GOOGLE LOGIN ----------------
    def login_with_google(self, profile):
        email = profile["email"]
        name = profile.get("name", "")

        # 🔑 Google users are NOT encoded
        user = self.repo.find_user_by_email(email)

        if not user:
            user = {
                "email": email,
                "name": name,
                "provider": "google"
            }
            self.repo.create_user(user)

        return user
