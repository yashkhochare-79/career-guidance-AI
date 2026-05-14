# ============================================
# Database Connection Module
# ============================================
# Handles connecting to MongoDB using PyMongo.
# The `db` variable is shared across the entire app
# so any route file can import it and query the database.
# ============================================

from pymongo import MongoClient

# This variable will hold the database reference once initialized.
# Other files import this:  from db import db
db = None


def init_db(app):
    """
    Connects to MongoDB using the URI from app config.
    Called once when the app starts up (in app.py).
    """
    global db

    mongo_uri = app.config["MONGO_URI"]
    db_name = app.config["DATABASE_NAME"]

    # Create a MongoClient — this manages the connection pool
    client = MongoClient(mongo_uri)

    # Select the specific database
    db = client[db_name]

    # Verify the connection by pinging the server
    try:
        client.admin.command("ping")
        print(f"✅ Connected to MongoDB: {db_name}")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")


def get_db():
    """
    Helper to get the database reference.
    Usage:  from db import get_db
            db = get_db()
            db.users.find_one(...)
    """
    return db
