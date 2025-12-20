class UserLoginDTO:
    def __init__(self, email, password):
        self.email = email.strip().lower() if email else None
        self.password = password

    def is_valid(self):
        return bool(self.email and self.password)

    def to_dict(self):
        return {
            "email": self.email,
            "password": self.password
        }
