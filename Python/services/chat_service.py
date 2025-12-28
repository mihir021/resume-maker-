
import requests
from Python.config.openai_config import OPENAI_HEADERS, OPENAI_URL

from Python.utilis.intent_mapper import detect_intent, is_website_question

MODEL = "gpt-4o-mini"

SYSTEM_PROMPT = """
You are a website assistant for the ResumeNow resume builder website.

RULES (STRICT):
- Answer ONLY questions related to this website.
- Allowed topics:
  • Resume creation
  • Resume download
  • Account issues
  • Pricing & subscription
  • Login & signup
  • Contact & support
  • FAQ-related help

- If a question is NOT related to this website:
  Respond exactly with:
  "I can help only with questions about this website."

- Do NOT answer:
  • General knowledge
  • Coding questions
  • Math
  • Personal advice
  • Career advice unrelated to the site
  • Anything outside the website

- Keep answers short and clear.
- Never mention AI, ChatGPT, OpenAI, or models.
"""


def process_chat(message: str):

    # 🔒 Website-only filter
    if not is_website_question(message):
        return (
            "I can help only with ResumeNow features like resumes, downloads, pricing, and support.",
            "NONE"
        )

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": message}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(
            OPENAI_URL,
            headers=OPENAI_HEADERS,
            json=payload,
            timeout=20
        )

        data = response.json()

        if "error" in data:
            print("OpenAI error:", data["error"])
            return "Service temporarily unavailable.", "NONE"

        reply = data["choices"][0]["message"]["content"]
        intent = detect_intent(message)

        return reply, intent

    except Exception as e:
        print("Chat exception:", e)
        return "Chat service unavailable.", "NONE"
