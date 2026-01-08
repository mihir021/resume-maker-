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

        # 🔍 FIRST: check if user exists
        existing_user = self.repo.find_user_by_email(encoded_email)

        if existing_user:
            # 🚫 Blocked users cannot re-register
            if existing_user.get("status") == "blocked":
                return {
                    "success": False,
                    "message": "Account is blocked"
                }

            return {
                "success": False,
                "message": "Email already registered"
            }

        # 🔐 Hash password (CORRECT – do not Crypto encode)
        hashed_password = generate_password_hash(data["password"])

        # ✅ Create new user
        user = {
            "name": CryptoUtils.encode(data["name"]),
            "email": encoded_email,
            "password": hashed_password,
            "provider": "local",
            "status": "active"  # 🔥 important
        }

        self.repo.create_user(user)

        return {
            "success": True,
            "message": "User registered successfully"
        }

    # ---------------- LOGIN (EMAIL / PASSWORD) ----------------
    def login_user(self, dto):
        encoded_email = CryptoUtils.encode(dto.email)

        user = self.repo.find_user_by_email(encoded_email)
        if not user:
            return {"success": False, "message": "User not found"}

        # 🚫 BLOCK CHECK
        if user.get("status") == "blocked":
            return {
                "success": False,
                "message": "Your account has been blocked by admin"
            }

        # 🔐 Password verification
        if not check_password_hash(user["password"], dto.password):
            return {"success": False, "message": "Invalid password"}

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "name": CryptoUtils.decode(user["name"]),
                "email": CryptoUtils.decode(user["email"]),
                "role": user.get("role", "user"),
                "provider": user.get("provider", "local")
            }
        }

    # ---------------- GOOGLE LOGIN ----------------
    def login_with_google(self, profile):
        email = profile["email"]
        name = profile.get("name", "")

        # ❌ DO NOT ENCODE GOOGLE EMAILS
        user = self.repo.find_user_by_email(email)

        if user:
            # 🚫 Block check
            if user.get("status") == "blocked":
                return {"success": False, "message": "Account is blocked"}

            return {
                "success": True,
                "user": {
                    "email": user["email"],
                    "name": user.get("name", ""),
                    "provider": "google",
                    "role": user.get("role", "user")
                }
            }

        # ✅ CREATE GOOGLE USER (PLAIN EMAIL)
        user = {
            "email": email,
            "name": name,
            "provider": "google",
            "status": "active",
            "role": "user"
        }

        self.repo.create_user(user)

        return {
            "success": True,
            "user": user
        }




