"""
A Flask blueprint defining API routes for authentication.

The app defines the following endpoints:
    /api/auth/invite (POST): Sends a staff sign-up invititation to an email address.
    /api/auth/signup (POST): Creates either a customer account, or staff account if a token is given.
    /api/auth/login (POST): Confirms whether email/password are authentic and sets cookies.
    /api/auth/logout (POST): Logs a user out by deleting their cookies.
"""
import random
from datetime import datetime

import jwt

from flask import Blueprint, request, jsonify, abort, make_response
import psycopg2
from werkzeug.security import check_password_hash, generate_password_hash

from auth.authentication import (
    generate_signup_token, validate_signup_token, generate_customer_token,
    generate_staff_token, generate_admin_token, send_invite, fetch_user_info,
    customer_waiters, occupied_tables, secret_key
)
from menu.connection import get_db_connection
from backend.resources import config
from backend.auth.session import get_session
from backend.auth.session import logout as session_logout

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/invite', methods=['POST'])
def invite():
    """
    Sends a staff sign-up invitation to the specified email address.

    The email is a link to the sign-up page containing a token embedding which authorises the user to sign-up as staff.
    The route expects a JSON payload containing the email address of the user.

    Returns:
        A JSON response and a HTTP code.
    """
    # Fetch and set info to go into the SendGrid request
    data = request.get_json(force=True)
    email = data['email']
    token = generate_signup_token(email, secret_key)
    base_url = 'http://127.0.0.1:3000/auth/signup'
    
    # Send a SendGrid request
    send_invite(email, token, base_url)
    print(f'SUCCESS: SIGN-UP INVITE SENT TO {email}')

    return jsonify({'message': f'Invitation email sent to {email}'}), 200

@auth_bp.route('/api/auth/signup', methods=['POST'])
def signup():
    """
    Registers a user account, which can be either a customer or a staff user.

    This route expects a JSON payload containing the email, password, first_name, last_name, and optionally the token of the user to add.
    A customer is registered if a token is not provided i.e. customers don't require sign-up authentication.

    Returns:
        A JSON response and a HTTP code.

    Raises:
        KeyError: If the token is not provided.
    """
    try:
        # Fetch data from the request payload
        data = request.get_json(force=True)
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        token = data.get('token', None)

        hashed_password = generate_password_hash(password) # Encrypt password

        # Insert staff user if token exists, otherwise insert customer user, in Postgres
        conn = get_db_connection()
        cursor = conn.cursor()
        if not token:
            cursor.execute("""
                           INSERT INTO Customer(email, password, first_name, last_name, table_number)
                           VALUES(%s, %s, %s, %s, '-1')
                           """, (email, hashed_password, first_name, last_name))
            print(f'SUCCESS: CUSTOMER ACCOUNT FOR {first_name} CREATED')
        else:
            if not validate_signup_token(token, secret_key):
                abort(403, 'ERROR: TOKEN IS INVALID/EXPIRED')
            cursor.execute("""
                           INSERT INTO Staff(email, password, admin, first_name, last_name)
                           VALUES(%s, %s, %s, %s, %s)
                           """, (email, hashed_password, 'False', first_name, last_name))
            print(f'SUCCESS: STAFF ACCOUNT FOR {first_name} CREATED')
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': f'An account for {email} has been created'}), 201
    
    # Handle case where user already exists
    except Exception as e:
        print('ERROR: ACCOUNT COULD NOT BE CREATED')
        message: str = e.args[0]
        if message.find("already exists") != -1:
            return jsonify({'message': "A customer with this email address already exists"}), 409
        else:
            return jsonify("An error occurred"), 500


@auth_bp.route('/api/auth/<string:mode>/login', methods=['POST'])
def login(mode: str):
    """
    Confirms whether email/password are authentic.

    If email/password are authentic, cookies are set including a type token, user information, and user id.
    This type token cookie can be used to deny a user access to some routes.

    Returns:
        A JSON response and a HTTP code.
    """

    try:
        # Check valid login mode specified i.e. customer or staff
        if mode not in ['customer', 'staff']:
            return jsonify({
                'message': 'Invalid mode specified. Please use either /api/auth/customer/login or /api/auth/staff/login'
            }), 400

        # Fetch email and password from the request payload
        data = request.get_json(force=True)
        email = data['email']
        password = data['password']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Create session object
        session = {
            "last_login": datetime.now().timestamp(),
            "session_type": mode,
            "user": {}
        }

        # Staff login -----------------------------------------------------------------------------
        if mode == 'staff':
            # Get staff data from database
            cursor.execute("""
                SELECT staff_id, first_name, last_name, email, password, role, admin
                FROM Staff
                WHERE email = %s
            """, (email,))

            staff_data = cursor.fetchone()

            # If no matching email found in staff table...
            if staff_data is None:
                return jsonify("No staff exists with that email"), 401

            [staff_id, first_name, last_name, email, password_hash, role, admin] = staff_data

            # If invalid password given
            if not check_password_hash(password_hash, password):
                return jsonify("Invalid password provided"), 401

            # Add staff user data to session object
            session['user']["id"] = staff_id
            session['user']["role"] = role
            session['user']["is_admin"] = admin
            session['user']["first_name"] = first_name
            session['user']["last_name"] = last_name
            session['user']["email"] = email

            # Add staff user to customer_waiters map
            customer_waiters[staff_id] = []

        # Customer login --------------------------------------------------------------------------
        else:
            # Get customer data from database
            cursor.execute("""
                SELECT customer_id, first_name, last_name, email, password, table_number
                FROM customer
                WHERE email = %s
            """, (email,))

            customer_data = cursor.fetchone()

            # If no matching email found in customer table...
            if customer_data is None:
                return jsonify("No customer exists with this email"), 401

            [customer_id, first_name, last_name, email, password_hash, table_number] = customer_data

            if not check_password_hash(password_hash, password):
                return jsonify("Invalid password provided"), 401

            # Add customer user data to session object
            session['user']["id"] = customer_id
            session['user']["first_name"] = first_name
            session['user']["last_name"] = last_name
            session['user']["email"] = email

            # TODO: Look into this section
            try:
                least_occupied_waiter = min(customer_waiters, key=lambda k: len(customer_waiters[k]))
                customer_waiters[least_occupied_waiter].append(customer_id)

                print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}')  # Debug

                if len(occupied_tables) >= 25:
                    print('ERROR: NO FREE TABLES')
                    return jsonify({'message': 'There are currently no free tables'}), 409

                unoccupied_table = random.randint(1, 25)
                while unoccupied_table in occupied_tables:
                    unoccupied_table = random.randint(1, 25)

                occupied_tables.add(unoccupied_table)
                print(f'OCCUPIED TABLES: {occupied_tables}')  # Debug

                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                               UPDATE Customer
                               SET table_number = %s
                               WHERE customer_id = %s
                               """, (unoccupied_table, customer_id))

                conn.commit()
                cursor.close()
                conn.close()

            # Handle case if no waiters are logged in (can't assign customer to waiter)
            except Exception as e:
                print(e)
                print(f'ERROR: NO WAITERS ARE LOGGED IN, ' +
                      'LOG INTO A WAITER ACCOUNT FIRST')
                return jsonify({'message': 'There are currently no waiters that are logged in'}), 400

        # Encode session into JWT
        encoded_user_info = jwt.encode(session, config.JWT_SECRET, algorithm='HS256')

        # Preparing response
        response = make_response(
            jsonify({
                'message': f'Logged into {email} successfully.',
                'type': mode,
                'session': session
            }), 200
        )

        # Store JWT in browser as cookie
        response.set_cookie('session', encoded_user_info, httponly=False, secure=True)

        return response

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'An error occurred'
        }), 500


@auth_bp.route('/api/auth/logout')
def logout():
    """
    Logs the user out by deleting any cookies associated to the user. On logout, information is also removed from the
    customer_waiters and occupied_tables data structures.

    Returns:
        A JSON response and a HTTP code.
    """
    return session_logout()


@auth_bp.route('/api/auth/session')
def current_session():
    """Returns the current session"""
    try:
        session = get_session()  # Returns AuthSession (or None if user not logged in)

        # If user not logged in...
        if session is None:
            return jsonify({
                'message': 'No session found'
            }), 401

        # Otherwise return their decoded session
        return jsonify({
            'message': 'Fetched user session',
            'session': session.get_cookie()
        }), 200

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
