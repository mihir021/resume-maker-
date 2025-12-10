from Python.config.db import db

class UserRepo:

    def create_user(self, user_data):
        return db["users"].insert_one(user_data)

    def find_user_by_email(self, email):
        return db["users"].find_one({"email": email})
