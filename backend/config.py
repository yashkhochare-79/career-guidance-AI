# ============================================
# Configuration File
# ============================================
# Stores all app settings in one place.
# In a real project, sensitive values (like MONGO_URI
# and SECRET_KEY) should come from environment variables.
# ============================================

import os


class Config:
    """Central configuration for the Flask app."""

    # Secret key used to sign session cookies and JWT tokens.
    # IMPORTANT: Change this to a long random string in production!
    SECRET_KEY = os.environ.get("SECRET_KEY", "careerpath-ai-secret-key-change-me")

    # MongoDB connection string.
    # Default points to a local MongoDB instance.
    # Format: mongodb://<user>:<password>@<host>:<port>/<dbname>
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/careerpath_ai")

    # Name of the database inside MongoDB
    DATABASE_NAME = "careerpath_ai"

    # JWT token expiry time in hours
    JWT_EXPIRY_HOURS = 24
