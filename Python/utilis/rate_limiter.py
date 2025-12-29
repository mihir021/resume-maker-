from Python.config.redis_config import redis_client

RATE_LIMIT = 20    # 🔧 testing value (change back to 20 later)
WINDOW = 60        # seconds


def is_rate_limited(client_id: str) -> bool:
    key = f"rate:{client_id}"

    try:
        current = redis_client.incr(key)

        if current == 1:
            redis_client.expire(key, WINDOW)

        return current > RATE_LIMIT

    except Exception:
        # Redis down → allow request
        return False
