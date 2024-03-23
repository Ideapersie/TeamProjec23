"""
A Flask blueprint defining API routes for authentication.

The app defines the following endpoints:
    /api/auth/invite (POST): Sends a staff sign-up invititation to an email address.
    /api/auth/signup (POST): Creates either a customer account, or staff account if a token is given.
    /api/auth/login (POST): Confirms whether email/password are authentic and sets cookies.
    /api/auth/logout (POST): Logs a user out by deleting their cookies.
"""
import random
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

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """
    Confirms whether email/password are authentic.

    If email/password are authentic, cookies are set includng a type token, user information, and user id.
    This type token cookie can be used to deny a user access to some routes.

    Returns:
        A JSON response and a HTTP code.
    """
    # Fetch email and password from the request payload
    data = request.get_json(force=True)
    email = data['email']
    password = data['password']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Generate type tokens for admin and staff users
    try:
        cursor.execute("""
                       SELECT *
                       FROM Staff
                       WHERE email = %s
                       """, (email,))
        data = cursor.fetchall()
        staff_id = data[0][0]
        password_hash = data[0][2]
        admin = data[0][3]
        if admin:
            type = 'admin'
            token = generate_admin_token(email, secret_key)
        else:
            type = 'staff'
            token = generate_staff_token(email, secret_key)

    # Generate type tokens for customers
    except:
        cursor.execute("""
                       SELECT *
                       FROM Customer
                       WHERE email = %s
                       """, (email,))
        data = cursor.fetchall()
        if data:
            customer_id = data[0][0]
            password_hash = data[0][2]
            type = 'customer'
            token = generate_customer_token(email, secret_key)
        else:
            return jsonify({'message': 'Something went wrong'}), 401

    cursor.close()
    conn.close()

    # Confirm the password given by the user matches their decrypted password, and set cookies
    if data:
        if check_password_hash(password_hash, password):
            response = make_response(jsonify({'message': f'Logged into {email} successfully.', 'type': type}), 200)
            response.set_cookie('token', token, httponly=False, secure=True)

            user_info = None

            # Map customers to waiters on login
            # Set appropriate cookies for staff and customer users
            if type == 'staff':
                customer_waiters.update({f'{staff_id}': []})
                print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}') # Debug
                response.set_cookie('staff_id', f'{staff_id}', httponly=False, secure=True)
                user_info = fetch_user_info('Waiter', staff_id)

            # Add customer to a table on login
            elif type == 'customer':
                try:
                    least_occupied_waiter = min(customer_waiters, key=lambda k: len(customer_waiters[k]))
                    customer_waiters[least_occupied_waiter].append(customer_id)
                    print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}') # Debug
                    conn = get_db_connection()
                    cursor = conn.cursor()
                    if len(occupied_tables) >= 25:
                        print('ERROR: NO FREE TABLES')
                        return jsonify({'message': 'There are currently no free tables'}), 409
                    unoccupied_table = random.randint(1, 25)
                    while unoccupied_table in occupied_tables:
                        unoccupied_table = random.randint(1, 25)
                    occupied_tables.add(unoccupied_table)
                    print(f'OCCUPIED TABLES: {occupied_tables}') # Debug
                    cursor.execute("""
                                   UPDATE Customer
                                   SET table_number = %s
                                   WHERE customer_id = %s
                                   """, (unoccupied_table, customer_id))
                    conn.commit()
                    cursor.close()
                    conn.close()

                # Handle case if no waiters are logged in (can't assign customer to waiter)
                except Exception:
                    print(f'ERROR: NO WAITERS ARE LOGGED IN, ' +
                           'LOG INTO A WAITER ACCOUNT FIRST')
                    return jsonify({'message': 'There are currently no waiters that are logged in'}), 400
                
                response.set_cookie('customer_id', f'{customer_id}', httponly=False, secure=True)
                user_info = fetch_user_info('Customer', customer_id)

            if user_info:
                encoded_user_info = jwt.encode(user_info, config.JWT_SECRET, algorithm='HS256')
                response.set_cookie('user_info', encoded_user_info, httponly=False, secure=True)

            return response
        
        else:
            print('ERROR: INVALID EMAIL/PASSWORD')
            return jsonify({'message': 'Email or password is invalid.'}), 401
    else:
        print('ERROR: INVALID EMAIL/PASSWORD')
        return jsonify({'message': 'Email or password is invalid.'}), 401
    
@auth_bp.route('/api/auth/logout', methods=['POST'])
def logout():
    """
    Logs the user out by deleting any cookies associated to the user.

    These cookies are deleted by setting the expiration time to 0.
    On logout, information is also removed from the customer_waiters and occupied_tables data structures.
    Returns:
        A JSON response and a HTTP code.
    """
    # Fetch id cookies associated to user
    customer_id = request.cookies.get('customer_id', 'None')
    staff_id = request.cookies.get('staff_id', 'None')

    # Remove any user presence in the customer_waiters and occupied_tables data structures
    if customer_id != 'None':
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
        print(f'OCCUPIED TABLES: {occupied_tables}') # Debug
        for key in customer_waiters:
            if int(customer_id) in customer_waiters[key]:
                customer_waiters[key].remove(int(customer_id))
        print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}') # Debug
        cursor.execute("""
                       UPDATE Customer
                       SET table_number = '-1'
                       WHERE customer_id = %s
                       """, (customer_id,))
        conn.commit()
        cursor.close()
        conn.close()
    elif staff_id != 'None':
        del customer_waiters[f'{staff_id}']
        print(f'WAITERS MAPPED TO CUSTOMERS: {customer_waiters}') # Debug

    # Delete cookies by forcefully expiring them
    print('SUCCESS: USER LOGGED OUT')
    response = make_response(jsonify({'message': 'Logged out successfully'}), 200)
    response.set_cookie('customer_id', '', expires=0, httponly=False, secure=True)
    response.set_cookie('staff_id', '', expires=0, httponly=False, secure=True)
    response.set_cookie('token', '', expires=0, httponly=False, secure=True)

    return response