from flask import Flask
from flask_cors import CORS

from Controller.user_controller import user_bp
from Controller.chat_controller import chat_api

app = Flask(__name__)
CORS(app)

# Existing routes
app.register_blueprint(user_bp)

# Chatbot routes
app.register_blueprint(chat_api)

if __name__ == "__main__":
    app.run(debug=True)
