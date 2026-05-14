# ============================================
# Job Recommendation Routes  (/api/jobs/...)
# ============================================
# Returns job listings and matches them against
# the user's skill profile.
#
# Endpoints:
#   GET  /api/jobs/              — Get all jobs (with optional filters)
#   GET  /api/jobs/<id>          — Get a single job by ID
#   POST /api/jobs/              — Create a new job listing (admin)
#   GET  /api/jobs/recommended   — Get personalized recommendations
# ============================================

from flask import Blueprint, request, jsonify
from bson.objectid import ObjectId
from db import get_db
from utils.helpers import token_required

job_bp = Blueprint("jobs", __name__)


# ─── GET ALL JOBS (with optional filters) ───
@job_bp.route("/", methods=["GET"])
def get_jobs():
    """
    Fetch all job listings. Supports optional query params:
      ?domain=Web Development
      ?type=Internship
      ?experience=Fresher
      ?search=react
    """
    db = get_db()

    # Build a MongoDB filter from query params
    query = {}

    domain = request.args.get("domain")
    if domain and domain != "All Domains":
        query["domain"] = domain

    job_type = request.args.get("type")
    if job_type and job_type != "All Types":
        query["type"] = job_type

    experience = request.args.get("experience")
    if experience and experience != "All Levels":
        query["experience"] = experience

    search = request.args.get("search", "").strip()
    if search:
        # Use a case-insensitive regex to search title, company, or skills
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"company": {"$regex": search, "$options": "i"}},
            {"requiredSkills": {"$regex": search, "$options": "i"}},
        ]

    # Execute the query
    jobs_cursor = db.jobs.find(query).sort("createdAt", -1)

    # Convert cursor to a list with string IDs
    jobs = []
    for job in jobs_cursor:
        job["_id"] = str(job["_id"])
        jobs.append(job)

    return jsonify({"jobs": jobs, "total": len(jobs)}), 200


# ─── GET SINGLE JOB ───
@job_bp.route("/<job_id>", methods=["GET"])
def get_job(job_id):
    """Fetch a single job listing by its MongoDB ObjectId."""
    db = get_db()

    try:
        job = db.jobs.find_one({"_id": ObjectId(job_id)})
    except Exception:
        return jsonify({"error": "Invalid job ID format"}), 400

    if not job:
        return jsonify({"error": "Job not found"}), 404

    job["_id"] = str(job["_id"])

    return jsonify({"job": job}), 200


# ─── CREATE A JOB LISTING ───
@job_bp.route("/", methods=["POST"])
def create_job():
    """
    Add a new job listing to the database.
    Expects JSON:
    {
        "title": "Frontend Developer",
        "company": "TechNova",
        "location": "Bangalore",
        "type": "Full-Time",
        "experience": "Entry Level",
        "salary": "₹6L – ₹10L",
        "domain": "Web Development",
        "description": "...",
        "requiredSkills": ["HTML", "CSS", "JavaScript", "React"],
        "bonusSkills": ["TypeScript", "Next.js"]
    }
    """
    db = get_db()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    # Validate required fields
    required_fields = ["title", "company", "requiredSkills"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400

    import datetime
    data["createdAt"] = datetime.datetime.utcnow()

    result = db.jobs.insert_one(data)

    return jsonify({
        "message": "Job created!",
        "jobId": str(result.inserted_id)
    }), 201


# ─── PERSONALIZED RECOMMENDATIONS ───
@job_bp.route("/recommended", methods=["GET"])
@token_required
def get_recommended_jobs(current_user_id):
    """
    Returns jobs ranked by how well they match the user's skills.
    Adds a 'matchPercentage' field to each job.
    """
    db = get_db()

    # 1. Get the user's skills from their profile
    profile = db.profiles.find_one({"userId": current_user_id})
    user_skills = []
    if profile:
        user_skills = [s.lower() for s in profile.get("skills", [])]

    # 2. Fetch all jobs
    all_jobs = list(db.jobs.find().sort("createdAt", -1))

    # 3. Calculate match percentage for each job
    recommendations = []
    for job in all_jobs:
        required = job.get("requiredSkills", [])
        if len(required) == 0:
            match_pct = 0
        else:
            matched = [s for s in required if s.lower() in user_skills]
            match_pct = round((len(matched) / len(required)) * 100)

        job["_id"] = str(job["_id"])
        job["matchPercentage"] = match_pct
        job["matchedSkills"] = [s for s in required if s.lower() in user_skills]
        job["missingSkills"] = [s for s in required if s.lower() not in user_skills]
        recommendations.append(job)

    # 4. Sort by match percentage (best first)
    recommendations.sort(key=lambda j: j["matchPercentage"], reverse=True)

    return jsonify({
        "jobs": recommendations,
        "total": len(recommendations),
    }), 200
