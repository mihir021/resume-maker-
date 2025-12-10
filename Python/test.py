from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Read MongoDB URI from environment variable
MONGO_URI = os.getenv("MONGO_URI")

print("Loaded URI:", MONGO_URI)  # Debugging (optional)

try:
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)

    # Choose database
    db = client["resume_app"]

    print("\nConnected to MongoDB Successfully!")
    print("Collections inside resume_app:", db.list_collection_names())

except Exception as e:
    print("\nConnection Failed!")
    print("Error:", e)
