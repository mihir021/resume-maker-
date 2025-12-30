from flask import Blueprint, request, jsonify
from services.chat_service import process_chat
from DTO.chat_dto import ChatResponseDTO
from utils.rate_limiter import is_rate_limited

chat_api = Blueprint("chat_api", __name__)


def get_client_id(req):
    forwarded = req.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0]

    ip = req.remote_addr
    if ip in ("127.0.0.1", "::1", None):
        return "local"

    return ip

@chat_api.route("/", methods=["POST"])
def chat():
    client_id = get_client_id(request)

    if is_rate_limited(client_id):
        return jsonify({
            "reply": "Too many requests. Please wait a moment.",
            "intent": "RATE_LIMIT"
        }), 429

    data = request.get_json()
    message = data.get("message", "")

    reply, intent = process_chat(message)
    return jsonify(ChatResponseDTO(reply, intent).to_dict())
