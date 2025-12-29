from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Read MongoDB URI from environment variable
<<<<<<< HEAD
MONGO_URI = os.getenv("MONGO_URI")
=======
MONGO_URI = os.getenv("MONGODB_URI")
>>>>>>> 6fce5a90ff73366c50feb6b100f5561e0dc434f6

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
