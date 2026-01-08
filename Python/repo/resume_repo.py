from config.db import db

class ResumeRepo:
    def __init__(self):
        self.collection = db["resumes"]

    def create(self, resume):
        return self.collection.insert_one(resume)

    def find_by_user(self, encoded_email):
        return list(
            self.collection.find(
                {"user_email": encoded_email},
                {"data": 0}  # exclude heavy data for list view
            )
        )

    def find_one(self, encoded_email, resume_id):
        return self.collection.find_one({
            "_id": resume_id,
            "user_email": encoded_email
        })

    def find_all_resumes(self):
        return list(
            self.collection.find(
                {},
                {
                    "data": 0  # exclude heavy resume data
                }
            )
        )

