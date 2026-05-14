# ============================================
# CareerPath AI - Backend Server (Flask + MongoDB)
# ============================================
# This is the main entry point for the backend.
# It creates the Flask app, connects to MongoDB,
# and registers all API route blueprints.
# ============================================

from flask import Flask
from flask_cors import CORS
from config import Config
from db import init_db

# Import route blueprints
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.skill_routes import skill_bp
from routes.job_routes import job_bp
from routes.roadmap_routes import roadmap_bp


def create_app():
    """
    Factory function that creates and configures the Flask application.
    Using a factory pattern makes testing and scaling easier.
    """

    # 1. Create the Flask app instance
    app = Flask(__name__)

    # 2. Load configuration (MongoDB URI, secret key, etc.)
    app.config.from_object(Config)

    # 3. Enable CORS so the React frontend can call this API
    #    (Cross-Origin Resource Sharing)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # 4. Initialize the MongoDB connection
    init_db(app)

    # 5. Register route blueprints (each file handles a group of endpoints)
    app.register_blueprint(auth_bp,    url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(skill_bp,   url_prefix="/api/skills")
    app.register_blueprint(job_bp,     url_prefix="/api/jobs")
    app.register_blueprint(roadmap_bp, url_prefix="/api/roadmaps")

    # 6. A simple health-check route to verify the server is running
    @app.route("/")
    def index():
        return {"message": "CareerPath AI API is running!", "status": "ok"}

    return app


# ─── Run the server ───
if __name__ == "__main__":
    app = create_app()
    # debug=True auto-reloads the server when you save a file
    app.run(debug=True, port=5000)
