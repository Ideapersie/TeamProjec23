"""
A Flask blueprint defining API routes for authentication.
"""
import random
import jwt

from datetime import datetime
from flask import Blueprint, request, jsonify, abort, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from auth.authentication import generate_signup_token, validate_signup_token, send_invite, customer_waiters, occupied_tables, secret_key
from menu.connection import get_db_connection
from resources import config
from auth.session import get_session, AuthSession

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/auth/invite', methods=['POST'])
def invite():
    """
    Sends a staff sign-up invitation to the specified email address.

    The email is a link to the sign-up page containing a token embedding which authorises the user to sign-up as staff.
    The route expects a JSON payload containing the email address of the user.

    Returns:
        response: A JSON response and a HTTP code.
    """
    # Fetch and set info to go into the SendGrid request
    data = request.get_json(force=True)
    email = data['email']
    token = generate_signup_token(email, secret_key)
    base_url = 'http://127.0.0.1:3000/auth/staff/signup'
    
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
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If account could not be created.
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
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If user could not login due to unexpected behaviours.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

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

        # Create session object
        session = {
            "last_login": datetime.now().timestamp(),
            "session_type": mode,
            "user": {}
        }

        if mode == 'staff':  # Staff login --------------------------------------------------------

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

        else:  # Customer login -------------------------------------------------------------------

            # Prevent customer login, if no waiter currently signed in
            if len(dict.keys(customer_waiters)) < 1:
                print('LOG INTO A WAITER ACCOUNT FIRST')
                return jsonify({"message": "No waiters currently logged in!"}), 409

            # Prevent customer login, if no free tables
            if len(occupied_tables) >= 9:
                print('ERROR: NO FREE TABLES')
                return jsonify({'message': 'There are currently no free tables'}), 409

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

            # Authenticate with password
            if not check_password_hash(password_hash, password):
                return jsonify("Invalid password provided"), 401

            # Add customer user data to session object
            session['user']["id"] = customer_id
            session['user']["first_name"] = first_name
            session['user']["last_name"] = last_name
            session['user']["email"] = email

            # Assign customer/user to the least occupied waiter
            least_occupied_waiter = min(customer_waiters, key=lambda k: len(customer_waiters[k]))
            customer_waiters[least_occupied_waiter].append(customer_id)
            print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}')  # Debug

            # Assigned customer/user to an unoccupied table
            unoccupied_table = -1
            for i in range(1, 9):
                print(i)
                if i not in occupied_tables:
                    occupied_tables.add(i)
                    unoccupied_table = i
                    break

            print(f'OCCUPIED TABLES: {occupied_tables}')  # Debug

            # TODO: Do we need to store table number in customer table
            cursor.execute("""
                UPDATE Customer
                SET table_number = %s
                WHERE customer_id = %s
            """, (unoccupied_table, customer_id))
            conn.commit()

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
        response.set_cookie('type', mode, httponly=False, secure=True)

        return response

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'An error occurred'
        }), 500

    finally:
        cursor.close()
        conn.close()


@auth_bp.route('/api/auth/logout')
def logout():
    """
    Logs the user out by deleting any cookies associated to the user. On logout, information is also removed from the
    customer_waiters and occupied_tables data structures.

    Returns:
        response: A JSON response and a HTTP code.

    Raises:
        Exception: In case of failure to vacate table, or unexpected behaviour.
    """

    try:
        session = AuthSession()

        try:
            # Customer
            if session.is_customer_session():

                customer_id = session.get_user_id()

                conn = get_db_connection()
                cursor = conn.cursor()

                cursor.execute("""
                    SELECT table_number
                    FROM Customer
                    WHERE customer_id = %s
                """, (customer_id,))

                table_record = cursor.fetchone()
                table_to_free = int(table_record[0])
                occupied_tables.remove(table_to_free)

                for key in customer_waiters:
                    if int(customer_id) in customer_waiters[key]:
                        customer_waiters[key].remove(int(customer_id))

                cursor.execute("""
                    UPDATE Customer
                    SET table_number = '-1'
                    WHERE customer_id = %s
                """, (customer_id,))

                conn.commit()
                cursor.close()
                conn.close()

            # Staff logout
            elif session.is_staff_session():
                staff_id = session.get_user_id()
                customer_waiters.pop(staff_id, None)

        except Exception as e:
            print(e)
            print("Failed to clear from table system")

        print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}')  # Debug
        print(f'OCCUPIED TABLES: {occupied_tables}')  # Debug

        res = make_response(jsonify({
            'message': 'User logged out',
            'type': session.get_session_type()
        }))

        # Delete JWT session token cookie
        res.delete_cookie('session')

        return res

    # Any unhandled exceptions
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500


@auth_bp.route('/api/auth/session')
def current_session():
    """
    Fetches the current session the current session.

    Returns:
        response: The current session.

    Raises:
        Exception: If session could not be obtained.
    """
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
            'session': session.json()
        }), 200

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
