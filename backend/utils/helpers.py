# ============================================
# Utility / Helper Functions
# ============================================
# Shared logic used across multiple route files:
#   - JWT token creation & verification
#   - The @token_required decorator
# ============================================

import jwt
import datetime
from functools import wraps
from flask import request, jsonify, current_app


def create_token(user_id):
    """
    Generate a JWT (JSON Web Token) for a given user ID.

    The token contains:
      - sub: the user's MongoDB ObjectId (as a string)
      - iat: the time the token was created
      - exp: the time the token expires

    Returns: a JWT string
    """
    payload = {
        "sub": user_id,
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24),
    }

    token = jwt.encode(
        payload,
        current_app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return token


def decode_token(token):
    """
    Decode and verify a JWT token.
    Returns the user_id if valid, or None if expired/invalid.
    """
    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"]
        )
        return payload["sub"]  # This is the user_id
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is malformed


def token_required(f):
    """
    A decorator that protects routes.
    Usage:
        @app.route("/protected")
        @token_required
        def my_route(current_user_id):
            # current_user_id is automatically passed in
            ...

    The client must send the token in the Authorization header:
        Authorization: Bearer <token>
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # 1. Look for the token in the Authorization header
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"error": "Authentication required. Please log in."}), 401

        # 2. Decode the token to get the user ID
        user_id = decode_token(token)
        if not user_id:
            return jsonify({"error": "Invalid or expired token. Please log in again."}), 401

        # 3. Pass the user_id to the route function
        return f(user_id, *args, **kwargs)

    return decorated
