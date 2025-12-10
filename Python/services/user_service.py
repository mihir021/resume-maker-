from Python.repo.user_repo import UserRepo

class UserService:
    def __init__(self):
        self.repo = UserRepo()

    def create_user(self, dto):
        data = dto.to_dict()

        # Check if user already exists
        if self.repo.find_user_by_email(data["email"]):
            return {"success": False, "message": "Email already registered"}

        self.repo.create_user(data)
        return {"success": True, "message": "User registered successfully"}
