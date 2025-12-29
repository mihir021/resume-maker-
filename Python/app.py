from flask import Flask
<<<<<<< HEAD
from Controller.user_controller import user_bp

# make a flask object
app = Flask(__name__)
app.register_blueprint(user_bp)

=======
from flask_cors import CORS

from Controller.user_controller import user_bp
from Controller.chat_controller import chat_api

app = Flask(__name__)
CORS(app)

# Existing routes
app.register_blueprint(user_bp)

# Chatbot routes
app.register_blueprint(chat_api)

>>>>>>> 6fce5a90ff73366c50feb6b100f5561e0dc434f6
if __name__ == "__main__":
    app.run(debug=True)
