# ============================================
# Roadmap Routes  (/api/roadmaps/...)
# ============================================
# Manages career roadmaps — step-by-step learning paths
# for different career tracks.
#
# Endpoints:
#   GET  /api/roadmaps/              — Get all available roadmaps
#   GET  /api/roadmaps/<career>      — Get a specific roadmap
#   GET  /api/roadmaps/progress      — Get user's roadmap progress
#   POST /api/roadmaps/progress      — Update step completion
# ============================================

from flask import Blueprint, request, jsonify
from db import get_db
from utils.helpers import token_required

roadmap_bp = Blueprint("roadmaps", __name__)

# ─────────────────────────────────────────────
# Roadmap data (in production, store in MongoDB)
# Each roadmap has stages from beginner → career-ready.
# ─────────────────────────────────────────────
ROADMAPS = {
    "Frontend Developer": {
        "description": "Master modern web development from scratch to production.",
        "totalSteps": 6,
        "stages": [
            {"id": 1, "title": "HTML & Web Fundamentals", "level": "Beginner",
             "skills": ["HTML5", "Forms", "Accessibility", "SEO"]},
            {"id": 2, "title": "CSS & Responsive Design", "level": "Beginner",
             "skills": ["Flexbox", "Grid", "Media Queries", "Animations"]},
            {"id": 3, "title": "JavaScript Mastery", "level": "Intermediate",
             "skills": ["ES6+", "DOM", "Async/Await", "Fetch API"]},
            {"id": 4, "title": "React & State Management", "level": "Intermediate",
             "skills": ["JSX", "Hooks", "Router", "Redux"]},
            {"id": 5, "title": "Testing & Projects", "level": "Advanced",
             "skills": ["Jest", "RTL", "CI/CD", "Performance"]},
            {"id": 6, "title": "Portfolio & Internship Prep", "level": "Career",
             "skills": ["Portfolio", "GitHub", "Resume", "Interview"]},
        ]
    },
    "Backend Developer": {
        "description": "Build scalable server-side applications and APIs.",
        "totalSteps": 6,
        "stages": [
            {"id": 1, "title": "Programming Fundamentals", "level": "Beginner",
             "skills": ["Python/Node.js", "Data Structures", "Algorithms"]},
            {"id": 2, "title": "Databases & SQL", "level": "Beginner",
             "skills": ["SQL", "PostgreSQL", "MongoDB", "Data Modeling"]},
            {"id": 3, "title": "REST APIs", "level": "Intermediate",
             "skills": ["Express/Django", "Auth", "Middleware"]},
            {"id": 4, "title": "Docker & Deployment", "level": "Intermediate",
             "skills": ["Docker", "CI/CD", "Cloud Basics"]},
            {"id": 5, "title": "System Design", "level": "Advanced",
             "skills": ["Microservices", "Caching", "Message Queues"]},
            {"id": 6, "title": "Interview Prep", "level": "Career",
             "skills": ["DSA", "System Design Interview"]},
        ]
    },
    "Data Analyst": {
        "description": "Transform raw data into actionable insights.",
        "totalSteps": 5,
        "stages": [
            {"id": 1, "title": "Excel & Statistics", "level": "Beginner",
             "skills": ["Excel", "Statistics", "Probability"]},
            {"id": 2, "title": "SQL for Analysis", "level": "Beginner",
             "skills": ["SQL", "Joins", "Window Functions"]},
            {"id": 3, "title": "Python (Pandas)", "level": "Intermediate",
             "skills": ["Pandas", "NumPy", "EDA"]},
            {"id": 4, "title": "Data Visualization", "level": "Intermediate",
             "skills": ["Tableau", "Power BI", "Storytelling"]},
            {"id": 5, "title": "Portfolio & Job Prep", "level": "Career",
             "skills": ["Case Studies", "Portfolio", "Interview"]},
        ]
    },
    "AI Engineer": {
        "description": "Build intelligent systems with machine learning.",
        "totalSteps": 6,
        "stages": [
            {"id": 1, "title": "Python & Math", "level": "Beginner",
             "skills": ["Python", "Linear Algebra", "Calculus", "Stats"]},
            {"id": 2, "title": "Machine Learning", "level": "Intermediate",
             "skills": ["Scikit-learn", "Supervised", "Unsupervised"]},
            {"id": 3, "title": "Deep Learning", "level": "Intermediate",
             "skills": ["PyTorch", "CNNs", "RNNs"]},
            {"id": 4, "title": "NLP & Computer Vision", "level": "Advanced",
             "skills": ["Transformers", "BERT", "Object Detection"]},
            {"id": 5, "title": "MLOps", "level": "Advanced",
             "skills": ["MLflow", "Docker", "SageMaker"]},
            {"id": 6, "title": "Research & Career", "level": "Career",
             "skills": ["Kaggle", "Paper Reading", "Portfolio"]},
        ]
    },
}


# ─── GET ALL ROADMAPS ───
@roadmap_bp.route("/", methods=["GET"])
def get_all_roadmaps():
    """
    Returns a summary of all available career roadmaps.
    """
    summaries = []
    for career, data in ROADMAPS.items():
        summaries.append({
            "career": career,
            "description": data["description"],
            "totalSteps": data["totalSteps"],
        })

    return jsonify({"roadmaps": summaries}), 200


# ─── GET SPECIFIC ROADMAP ───
@roadmap_bp.route("/<career>", methods=["GET"])
def get_roadmap(career):
    """
    Returns the full roadmap for a given career track.
    Example: GET /api/roadmaps/Frontend Developer
    """
    # URL-decode spaces (e.g., "Frontend%20Developer" → "Frontend Developer")
    from urllib.parse import unquote
    career = unquote(career)

    if career not in ROADMAPS:
        return jsonify({
            "error": f"Roadmap not found. Available: {list(ROADMAPS.keys())}"
        }), 404

    return jsonify({
        "career": career,
        "roadmap": ROADMAPS[career],
    }), 200


# ─── GET USER PROGRESS ───
@roadmap_bp.route("/progress", methods=["GET"])
@token_required
def get_progress(current_user_id):
    """
    Returns the user's completion progress for each roadmap.
    Stored in a 'roadmap_progress' collection.
    """
    db = get_db()

    progress = db.roadmap_progress.find_one({"userId": current_user_id})

    if not progress:
        return jsonify({"progress": {}}), 200

    progress["_id"] = str(progress["_id"])
    return jsonify({"progress": progress}), 200


# ─── UPDATE STEP COMPLETION ───
@roadmap_bp.route("/progress", methods=["POST"])
@token_required
def update_progress(current_user_id):
    """
    Mark a roadmap step as completed.
    Expects JSON:
    {
        "career": "Frontend Developer",
        "stepId": 3,
        "completed": true
    }
    """
    db = get_db()
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    career = data.get("career")
    step_id = data.get("stepId")
    completed = data.get("completed", True)

    if not career or step_id is None:
        return jsonify({"error": "'career' and 'stepId' are required"}), 400

    # Use dot notation to update a specific step within the progress doc
    # Example: completedSteps.Frontend Developer = [1, 2, 3]
    field = f"completedSteps.{career}"

    if completed:
        # Add step_id to the completed list (avoid duplicates with $addToSet)
        db.roadmap_progress.update_one(
            {"userId": current_user_id},
            {"$addToSet": {field: step_id}},
            upsert=True,
        )
    else:
        # Remove step_id from the completed list
        db.roadmap_progress.update_one(
            {"userId": current_user_id},
            {"$pull": {field: step_id}},
        )

    return jsonify({"message": f"Step {step_id} updated for {career}"}), 200
