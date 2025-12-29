import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")  # ✅ FIXED NAME

if not MONGO_URI:
    raise RuntimeError("MONGODB_URI is not set")

client = MongoClient(MONGO_URI)
db = client["resume_app"]
