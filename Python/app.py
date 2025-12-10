from flask import Flask
from Controller.user_controller import user_bp

# make a flask object
app = Flask(__name__)
app.register_blueprint(user_bp)

if __name__ == "__main__":
    app.run(debug=True)
