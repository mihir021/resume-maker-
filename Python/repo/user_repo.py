from Python.config.db import db

class UserRepo:
    def __init__(self):
        self.collection = db["users"]

    def find_user_by_email(self, encoded_email):
        return self.collection.find_one({"email": encoded_email})

    def create_user(self, data):
        return self.collection.insert_one(data)