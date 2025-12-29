from datetime import datetime
from bson import ObjectId
from Python.config.db import db

class UserRepo:
    def __init__(self):
        self.collection = db["users"]

    def find_user_by_email(self, encoded_email):
        return self.collection.find_one({"email": encoded_email})

    def create_user(self, data):
        return self.collection.insert_one(data)

    def create_google_user(self, user_data):
        user_data["created_at"] = datetime.utcnow()
        return db.users.insert_one(user_data)