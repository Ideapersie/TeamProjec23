"""
A Flask blueprint defining API routes for authentication.

The app defines the following endpoints:
- /api/invite (POST): Sends an sign-up invite to an email address.
- /api/signup (POST): Creates an account if the given token is valid.
- /api/login (POST): Confirms whether email/password are authentic.
"""
from flask import Blueprint, request, jsonify, abort
from werkzeug.security import check_password_hash, generate_password_hash
import psycopg2
from resources import config
from auth.authentication import generate_signup_token, validate_signup_token, send_invite, secret_key

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/invite', methods=['POST'])
def invite():
    """
    Sends a sign-up invitation email to the specified email address.

    Returns:
        JSON response and a HTTP code.
    """
    data = request.get_json()
    email = data['email']
    token = generate_signup_token(email, secret_key)
    base_url = 'http://127.0.0.1:5000/api/menuitems' # Adjust when the frontend page is created

    send_invite(email, token, base_url)
    return jsonify({'message': 'Invite sent successfully.'}), 200

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """
    Registers a new user account if the token given is valid.

    Returns:
        JSON response and a HTTP code.
    """
    data = request.get_json()
    email = data['email']
    password = data['password']
    admin = data['admin']
    first_name = data['first_name']
    last_name = data['last_name']
    token = data['token']

    if not token or not validate_signup_token(token, secret_key):
        abort(403, 'Invalid or expired token.')

    conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                            user=config.DATABASE_USER,
                            password=config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
    cursor = conn.cursor()
    
    hashed_password = generate_password_hash(password)
    cursor.execute('INSERT INTO Staff(email, password, admin, first_name, last_name) VALUES(%s, %s, %s, %s, %s)',
                   (email, hashed_password, admin, first_name, last_name))
    
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({'message': 'Account created successfully.'}), 201

@auth_bp.route('/api/login', methods=['POST'])
def login():
    """
    API endpoint to confirm whether email/password are authentic.
    
    Returns:
        A HTTP response status code as well as a JSON response.
    """
    data = request.get_json()
    email = data['email']
    password = data['password']

    conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                            user=config.DATABASE_USER,
                            password=config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
    cursor = conn.cursor()

    cursor.execute('SELECT password FROM Staff WHERE email = %s', (email,))
    record = cursor.fetchone()

    cursor.close()
    conn.close()

    if record:
        password_hash = record[0]
        if check_password_hash(password_hash, password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'message': 'Invalid email or password'}), 401
    else:
        return jsonify({'message': 'Invalid email or password'}), 401