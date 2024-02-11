"""
A Flask blueprint defining API routes for authentication.

The app defines the following endpoints:
- /api/login (POST): Confirms whether email/password are authentic.
"""
from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
import psycopg2
from resources import config

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/login", methods=["POST"])
def login():
    """
    API endpoints to confirm whether email/password are authentic.
    
    Returns:
        A HTTP response status code as well as a JSON response.
    """
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    conn = psycopg2.connect(dbname = config.DATABASE_NAME,
                            user = config.DATABASE_USER,
                            password = config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
    cursor = conn.cursor()

    cursor.execute("SELECT password FROM Staff WHERE email = %s", (email,))
    record = cursor.fetchone()

    cursor.close()
    conn.close()

    if record:
        password_hash = record[0]
        if check_password_hash(password_hash, password):
            return jsonify({"message": "Login successful"}), 200
        else:
            return jsonify({"message": "Invalid email or password"}), 401
    else:
        return jsonify({"message": "Invalid email or password"}), 401