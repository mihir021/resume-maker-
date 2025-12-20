class UserSignupDTO:
    def __init__(self, name, email, password):
        self.name = name.strip()
        self.email = email.strip().lower()
        self.password = password

    def is_valid(self):
        return all([self.name, self.email, self.password])

    # caz mongo db does not store whole object's
    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "password": self.password
        }
