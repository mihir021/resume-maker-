<<<<<<< HEAD
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)

=======
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGODB_URI")  # ✅ FIXED NAME

if not MONGO_URI:
    raise RuntimeError("MONGODB_URI is not set")

client = MongoClient(MONGO_URI)
>>>>>>> 6fce5a90ff73366c50feb6b100f5561e0dc434f6
db = client["resume_app"]
