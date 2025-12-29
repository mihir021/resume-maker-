class ChatRequestDTO:
    def __init__(self, message: str):
        self.message = message


class ChatResponseDTO:
    def __init__(self, reply: str, intent: str):
        self.reply = reply
        self.intent = intent

    def to_dict(self):
        return {
            "reply": self.reply,
            "intent": self.intent
        }
