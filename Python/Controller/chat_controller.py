from flask import Blueprint, request, jsonify
from Python.services.chat_service import process_chat
from Python.DTO.chat_dto import ChatResponseDTO

chat_api = Blueprint("chat_api", __name__)

@chat_api.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "")

    reply, intent = process_chat(message)
    response = ChatResponseDTO(reply, intent)

    return jsonify(response.to_dict())
