# ============================================
# Authentication Routes  (/api/auth/...)
# ============================================
# Handles user signup, login, and token verification.
#
# Endpoints:
#   POST /api/auth/signup   — Register a new user
#   POST /api/auth/login    — Log in and get a JWT token
#   GET  /api/auth/me       — Get current user from token
# ============================================

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from db import get_db
from utils.helpers import create_token, token_required
import datetime

# Create a blueprint — a mini-app that groups related routes
auth_bp = Blueprint("auth", __name__)


# ─── SIGNUP ───
@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user.
    Expects JSON: { "fullName": "...", "email": "...", "password": "..." }
    """
    db = get_db()
    data = request.get_json()

    # --- Validation ---
    if not data:
        return jsonify({"error": "Request body is required"}), 400

    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not full_name or not email or not password:
        return jsonify({"error": "fullName, email, and password are required"}), 400

    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    # --- Check if email already exists ---
    existing_user = db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "An account with this email already exists"}), 409

    # --- Create the user document ---
    new_user = {
        "fullName": full_name,
        "email": email,
        # Hash the password so it's never stored in plain text
        "passwordHash": generate_password_hash(password),
        "profileCompleted": False,
        "createdAt": datetime.datetime.utcnow(),
    }

    result = db.users.insert_one(new_user)

    # --- Generate a JWT token for immediate login ---
    token = create_token(str(result.inserted_id))

    return jsonify({
        "message": "Account created successfully!",
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "fullName": full_name,
            "email": email,
        }
    }), 201


# ─── LOGIN ───
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Log in an existing user.
    Expects JSON: { "email": "...", "password": "..." }
    Returns a JWT token on success.
    """
    db = get_db()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # --- Find user by email ---
    user = db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # --- Verify password ---
    if not check_password_hash(user["passwordHash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # --- Generate JWT token ---
    token = create_token(str(user["_id"]))

    return jsonify({
        "message": "Login successful!",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "fullName": user["fullName"],
            "email": user["email"],
            "profileCompleted": user.get("profileCompleted", False),
        }
    }), 200


# ─── GET CURRENT USER ───
@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user_id):
    """
    Returns the currently logged-in user's info.
    Requires a valid JWT token in the Authorization header.
    """
    db = get_db()
    user = db.users.find_one({"_id": ObjectId(current_user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": str(user["_id"]),
        "fullName": user["fullName"],
        "email": user["email"],
        "profileCompleted": user.get("profileCompleted", False),
    }), 200
