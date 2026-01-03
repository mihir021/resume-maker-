from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load .env from project root
load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")

if not MONGO_URI:
    raise RuntimeError("MONGODB_URI is not set")

client = MongoClient(MONGO_URI)
db = client["resume_app"]
def get_users_collection():
    return db["users"]

def get_feedback_collection():
    return db["feedbacks"]