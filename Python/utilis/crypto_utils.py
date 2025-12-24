import base64

SECRET_KEY = "ABC_abc"

class CryptoUtils:

    @staticmethod
    def encode(text: str) -> str:
        """
        Custom reversible encoder
        """
        combined = f"{SECRET_KEY}{text}{SECRET_KEY}"
        encoded_bytes = base64.b64encode(combined.encode("utf-8"))
        return encoded_bytes.decode("utf-8")

    @staticmethod
    def decode(encoded_text: str) -> str:
        """
        Custom reversible decoder
        """
        decoded_bytes = base64.b64decode(encoded_text.encode("utf-8"))
        decoded_str = decoded_bytes.decode("utf-8")

        # Remove secret key from both sides
        return decoded_str.replace(SECRET_KEY, "")
