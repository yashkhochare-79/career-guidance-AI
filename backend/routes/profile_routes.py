# ============================================
# Profile Routes  (/api/profile/...)
# ============================================
# Handles student profile CRUD operations.
# The profile stores academic info, skills, interests,
# and career goals entered during the profile setup flow.
#
# Endpoints:
#   GET    /api/profile/          — Get current user's profile
#   POST   /api/profile/          — Create or update profile
#   DELETE /api/profile/          — Delete profile data
# ============================================

from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from db import get_db
from utils.helpers import token_required
import datetime

profile_bp = Blueprint("profile", __name__)


# ─── GET PROFILE ───
@profile_bp.route("/", methods=["GET"])
@token_required
def get_profile(current_user_id):
    """
    Fetch the profile for the currently logged-in user.
    Returns 404 if the profile hasn't been created yet.
    """
    db = get_db()

    # Look up the profile by user ID
    profile = db.profiles.find_one({"userId": current_user_id})

    if not profile:
        return jsonify({"error": "Profile not found. Please complete your profile setup."}), 404

    # Convert ObjectId to string for JSON serialization
    profile["_id"] = str(profile["_id"])

    return jsonify({"profile": profile}), 200


# ─── CREATE / UPDATE PROFILE ───
@profile_bp.route("/", methods=["POST"])
@token_required
def save_profile(current_user_id):
    """
    Create or update the student profile.
    Expects JSON with fields like:
    {
        "fullName": "John Doe",
        "collegeName": "State University",
        "degree": "B.Tech",
        "branch": "Computer Science",
        "currentYear": "3",
        "skills": ["Python", "React", "SQL"],
        "interests": ["Machine Learning", "Web Dev"],
        "certifications": "AWS Cloud Practitioner",
        "experienceLevel": "Intermediate",
        "preferredDomain": "Software Development"
    }
    """
    db = get_db()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # --- Build the profile document ---
    profile_data = {
        "userId": current_user_id,
        "fullName": data.get("fullName", ""),
        "collegeName": data.get("collegeName", ""),
        "degree": data.get("degree", ""),
        "branch": data.get("branch", ""),
        "currentYear": data.get("currentYear", ""),
        "skills": data.get("skills", []),
        "interests": data.get("interests", []),
        "certifications": data.get("certifications", ""),
        "experienceLevel": data.get("experienceLevel", ""),
        "preferredDomain": data.get("preferredDomain", ""),
        "updatedAt": datetime.datetime.utcnow(),
    }

    # --- Upsert: update if exists, insert if not ---
    # upsert=True means "create it if it doesn't exist"
    result = db.profiles.update_one(
        {"userId": current_user_id},         # filter
        {"$set": profile_data},              # update
        upsert=True                          # create if missing
    )

    # Also mark the user's profile as completed
    db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"profileCompleted": True}}
    )

    return jsonify({"message": "Profile saved successfully!"}), 200


# ─── DELETE PROFILE ───
@profile_bp.route("/", methods=["DELETE"])
@token_required
def delete_profile(current_user_id):
    """
    Delete the current user's profile data.
    The user account itself is NOT deleted — only the profile.
    """
    db = get_db()

    result = db.profiles.delete_one({"userId": current_user_id})

    if result.deleted_count == 0:
        return jsonify({"error": "No profile found to delete"}), 404

    # Reset the profileCompleted flag
    db.users.update_one(
        {"_id": ObjectId(current_user_id)},
        {"$set": {"profileCompleted": False}}
    )

    return jsonify({"message": "Profile deleted successfully."}), 200
