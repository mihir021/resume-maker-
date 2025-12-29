import requests

from Python.config.openai_config import OPENAI_HEADERS, OPENAI_URL
from Python.config.redis_config import redis_client
from Python.utilis.intent_mapper import detect_intent, is_website_question
from Python.utilis.semantic_cache import semantic_key

MODEL = "gpt-4o-mini"
CACHE_TTL = 3600  # 1 hour

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

- Keep answers short and clear.
"""


def incr_metric(name: str):
    try:
        redis_client.incr(f"metrics:{name}")
    except Exception:
        pass


def process_chat(message: str):
    if not message or not message.strip():
        return "Message cannot be empty.", "NONE"

    if not is_website_question(message):
        return (
            "I can help only with ResumeNow features like resumes, downloads, pricing, and support.",
            "NONE"
        )

    cache_key = f"chat:{semantic_key(message)}"

    try:
        cached = redis_client.get(cache_key)
        if cached:
            incr_metric("cache_hit")
            print("⚡ Redis HIT")
            reply, intent = cached.split("||")
            return reply, intent
    except Exception:
        print("⚠ Redis unavailable, bypassing cache")

    # 👇 ADD THIS LINE (THIS IS WHAT YOU ASKED FOR)
    print("❌ Redis MISS → OpenAI")
    incr_metric("cache_miss")

    # 🔹 OpenAI fallback
    try:
        response = requests.post(
            OPENAI_URL,
            headers=OPENAI_HEADERS,
            json={
                "model": MODEL,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": message}
                ],
                "temperature": 0.2
            },
            timeout=20
        )

        data = response.json()
        reply = data["choices"][0]["message"]["content"]
        intent = detect_intent(message)

        # 🔹 Redis write (safe)
        try:
            redis_client.setex(
                cache_key,
                CACHE_TTL,
                f"{reply}||{intent}"
            )
        except Exception:
            pass

        return reply, intent

    except Exception:
        return "Chat service temporarily unavailable.", "NONE"


