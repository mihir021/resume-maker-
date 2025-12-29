import os
import redis
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL")
parsed = urlparse(REDIS_URL)

redis_client = redis.Redis(
    host=parsed.hostname,
    port=parsed.port,
    username=parsed.username,
    password=parsed.password,
    decode_responses=True
    # ❌ NO ssl=True
)
