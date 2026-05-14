# ============================================
# Skill Analysis Routes  (/api/skills/...)
# ============================================
# Compares user skills against target job requirements
# and returns a gap analysis with recommendations.
#
# Endpoints:
#   GET  /api/skills/analyze?role=Frontend Developer
#   GET  /api/skills/all            — List all available skills
#   POST /api/skills/update         — Update user's skill list
# ============================================

from flask import Blueprint, request, jsonify
from db import get_db
from utils.helpers import token_required

skill_bp = Blueprint("skills", __name__)

# ─────────────────────────────────────────────
# Skill requirements for each target role.
# In production, this would live in the database.
# ─────────────────────────────────────────────
ROLE_REQUIREMENTS = {
    "Frontend Developer": {
        "required": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git"],
        "bonus": ["Next.js", "Tailwind CSS", "Testing", "Redux"],
    },
    "Backend Developer": {
        "required": ["Python", "Node.js", "SQL", "REST APIs", "Docker", "Git"],
        "bonus": ["Redis", "Microservices", "AWS", "CI/CD"],
    },
    "Data Analyst": {
        "required": ["SQL", "Excel", "Python", "Pandas", "Tableau", "Statistics"],
        "bonus": ["Power BI", "NumPy", "Machine Learning"],
    },
    "AI Engineer": {
        "required": ["Python", "PyTorch", "Linear Algebra", "NLP", "Deep Learning", "Git"],
        "bonus": ["TensorFlow", "MLOps", "AWS SageMaker", "Docker"],
    },
}


# ─── ANALYZE SKILL GAP ───
@skill_bp.route("/analyze", methods=["GET"])
@token_required
def analyze_skills(current_user_id):
    """
    Compare the user's current skills with a target role's requirements.

    Query param:  ?role=Frontend Developer

    Returns:
    - matchPercentage: how closely the user's skills match
    - matchedSkills:   skills the user already has
    - missingSkills:   skills the user needs to learn
    - bonusSkills:     nice-to-have skills
    """
    db = get_db()

    # 1. Get the target role from the query string
    target_role = request.args.get("role", "").strip()
    if not target_role or target_role not in ROLE_REQUIREMENTS:
        available = list(ROLE_REQUIREMENTS.keys())
        return jsonify({
            "error": f"Invalid role. Choose from: {available}"
        }), 400

    # 2. Fetch the user's profile to get their skills
    profile = db.profiles.find_one({"userId": current_user_id})
    user_skills = []
    if profile:
        # Normalize to lowercase for case-insensitive comparison
        user_skills = [s.lower() for s in profile.get("skills", [])]

    # 3. Compare against role requirements
    role_req = ROLE_REQUIREMENTS[target_role]
    required_lower = [s.lower() for s in role_req["required"]]

    matched = [s for s in role_req["required"] if s.lower() in user_skills]
    missing = [s for s in role_req["required"] if s.lower() not in user_skills]

    # 4. Calculate match percentage
    if len(required_lower) > 0:
        match_pct = round((len(matched) / len(required_lower)) * 100)
    else:
        match_pct = 0

    return jsonify({
        "targetRole": target_role,
        "matchPercentage": match_pct,
        "matchedSkills": matched,
        "missingSkills": missing,
        "bonusSkills": role_req["bonus"],
        "totalRequired": len(role_req["required"]),
    }), 200


# ─── LIST ALL AVAILABLE SKILLS ───
@skill_bp.route("/all", methods=["GET"])
def get_all_skills():
    """
    Returns a flat list of all unique skills across all roles.
    Useful for populating autocomplete or dropdown menus.
    """
    all_skills = set()
    for role_data in ROLE_REQUIREMENTS.values():
        all_skills.update(role_data["required"])
        all_skills.update(role_data["bonus"])

    return jsonify({
        "skills": sorted(list(all_skills)),
        "roles": list(ROLE_REQUIREMENTS.keys()),
    }), 200


# ─── UPDATE USER SKILLS ───
@skill_bp.route("/update", methods=["POST"])
@token_required
def update_skills(current_user_id):
    """
    Update the user's skill list in their profile.
    Expects JSON: { "skills": ["Python", "React", "SQL"] }
    """
    db = get_db()
    data = request.get_json()

    if not data or "skills" not in data:
        return jsonify({"error": "A 'skills' array is required"}), 400

    skills = data["skills"]
    if not isinstance(skills, list):
        return jsonify({"error": "'skills' must be an array of strings"}), 400

    # Update the skills array in the user's profile
    result = db.profiles.update_one(
        {"userId": current_user_id},
        {"$set": {"skills": skills}},
    )

    if result.matched_count == 0:
        return jsonify({"error": "Profile not found. Create a profile first."}), 404

    return jsonify({"message": "Skills updated!", "skills": skills}), 200
