"""
A Flask blueprint defining API routes for authentication.

Authentication includes sign-up for staff and customers, as well as session-based log-in.

The app defines the following endpoints:
    /api/invite (POST): Sends a staff sign-up invititation to an email address.
    /api/signup (POST): Creates either a customer or a staff account if the token is valid.
    /api/login (POST): Confirms whether email/password are authentic and returns a session token.
"""
from flask import Blueprint, request, jsonify, abort, make_response
import psycopg2
import random
from werkzeug.security import check_password_hash, generate_password_hash
from resources import config
from auth.authentication import (
    generate_signup_token, validate_signup_token, generate_customer_token,
    generate_staff_token, generate_admin_token, send_invite, secret_key,
    customer_waiters, occupied_tables
)

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/invite', methods=['POST'])
def invite():
    """
    Sends a sign-up invitation to the specified email address.

    The sign-up email is a link containing a token embedding which allows the user to sign-up as staff.
    The method expects a JSON payload containing the email address of the user.
    The email is sent via the SendGrid API method defined in authentication.py.

    Returns:
        JSON response and a HTTP code.
    """
    data = request.get_json()
    email = data['email']
    token = generate_signup_token(email, secret_key)
    base_url = 'http://127.0.0.1:5000/api/menuitems' # Adjust when the frontend page is created
    
    send_invite(email, token, base_url)
    return jsonify({'message': f'Invitation sent to {email} successfully.'}), 200

@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    """
    Registers a user account, which can be either a customer or a staff user.

    This route expects a JSON payload containing the details of the user to add.
    A customer is registered if the admin and token fields are not provided i.e. customers don't require sign-up authentication.
    A staff user is registered if the admin field is false but the token is valid.

    Returns:
        JSON response and a HTTP code.

    Raises:
        KeyError: If the token is not provided.
    """

    try:
        data = request.get_json(force=True)
        email = data['email']
        password = data['password']
        first_name = data['first_name']
        last_name = data['last_name']
        token = data.get('token', None)

        conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                                user=config.DATABASE_USER,
                                password=config.DATABASE_PASSWORD,
                                host=config.DATABASE_HOST)
        cursor = conn.cursor()

        hashed_password = generate_password_hash(password)

        if not token:
            cursor.execute("""
                           INSERT INTO Customer(email, password, first_name, last_name, table_number)
                           VALUES(%s, %s, %s, %s, '-1')
                           """, (email, hashed_password, first_name, last_name))
        else:
            if not validate_signup_token(token, secret_key):
                abort(403, 'Token is invalid/expired.')
            cursor.execute("""
                           INSERT INTO Staff(email, password, admin, first_name, last_name)
                           VALUES(%s, %s, %s, %s, %s)
                           """, (email, hashed_password, 'False', first_name, last_name))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({'message': f'An account for {email} has been created.'}), 201

    except Exception as e:
        message: str = e.args[0]
        if message.find("already exists") != -1:
            return jsonify({'message': "A customer with this email address already exists"}), 409
        else:
            return jsonify("An error occurred"), 500


@auth_bp.route('/api/login', methods=['POST'])
def login():
    """
    API endpoint to confirm whether email/password are authentic.

    If email/password are authentic, cookies are set, and a JSON response is returned.
    These cookies are used to authenticate future requests.
    The user type can be either customer, staff or admin.

    Returns:
        A JSON response and a HTTP code.
    """
    data = request.get_json(force=True)
    email = data['email']
    password = data['password']

    conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                            user=config.DATABASE_USER,
                            password=config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
    cursor = conn.cursor()
    
    try:
        cursor.execute('SELECT * FROM Staff WHERE email = %s', (email,))
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
    except:
        cursor.execute('SELECT * FROM Customer WHERE email = %s', (email,))
        data = cursor.fetchall()
        if data:
            customer_id = data[0][0]
            password_hash = data[0][2]
            type = 'customer'
            token = generate_customer_token(email, secret_key)
        else:
            return jsonify({'message': 'Email or password is invalid.'}), 401

    cursor.close()
    conn.close()

    if data:
        if check_password_hash(password_hash, password):
            response = make_response(jsonify({'message': f'Logged into {email} successfully.', 'type': type}), 200)
            response.set_cookie('token', token, httponly=True, secure=True)

            if type == 'staff':
                customer_waiters.update({f'{staff_id}': []})
                print(customer_waiters) # Debug
                response.set_cookie('staff_id', f'{staff_id}', httponly=True, secure=True)
            elif type == 'customer':
                try:
                    least_occupied_waiter = min(customer_waiters, key=lambda k: len(customer_waiters[k]))
                    customer_waiters[least_occupied_waiter].append(customer_id)
                    print(customer_waiters) # Debug

                    conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                            user=config.DATABASE_USER,
                            password=config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
                    cursor = conn.cursor()

                    if len(occupied_tables) >= 25:
                        return jsonify({'message': 'There are currently no free tables.'}), 409
                    
                    unoccupied_table = random.randint(1, 25)
                    while unoccupied_table in occupied_tables:
                        unoccupied_table = random.randint(1, 25)
                    occupied_tables.add(unoccupied_table)
                    print(occupied_tables) # Debug

                    cursor.execute("""
                                   UPDATE Customer
                                   SET table_number = %s
                                   WHERE customer_id = %s
                                   """, (unoccupied_table, customer_id))
                    conn.commit()

                    cursor.close()
                    conn.close()

                except Exception as e:
                    print(e)
                    return jsonify({'message': 'There are currently no waiters that are logged in.'}), 400
                response.set_cookie('customer_id', f'{customer_id}', httponly=True, secure=True)
            
            return response
        else:
            return jsonify({'message': 'Email or password is invalid.'}), 401
    else:
        return jsonify({'message': 'Email or password is invalid.'}), 401
    
@auth_bp.route('/api/logout', methods=['POST'])
def logout():
    """
    Logs the user out by deleting any cookies associated to the user.

    These cookies are deleted by setting the expiration time to 0.

    Returns:
        A JSON response and a HTTP code.
    """
    customer_id = request.cookies.get('customer_id', 'None')
    staff_id = request.cookies.get('staff_id', 'None')

    if customer_id != 'None':
        conn = psycopg2.connect(dbname=config.DATABASE_NAME,
                            user=config.DATABASE_USER,
                            password=config.DATABASE_PASSWORD,
                            host=config.DATABASE_HOST)
        cursor = conn.cursor()

        cursor.execute("""
                       SELECT table_number
                       FROM Customer
                       WHERE customer_id = %s
                       """, (customer_id))
        table_record = cursor.fetchone()
        table_to_free = int(table_record[0])
        occupied_tables.remove(table_to_free)
        print(occupied_tables) # Debug

        for key in customer_waiters:
            if int(customer_id) in customer_waiters[key]:
                customer_waiters[key].remove(int(customer_id))
        print(customer_waiters) # Debug

        cursor.execute("""
                       UPDATE Customer
                       SET table_number = '-1'
                       WHERE customer_id = %s
                       """, (customer_id))
        conn.commit()

        cursor.close()
        conn.close()
    elif staff_id != 'None':
        del customer_waiters[f'{staff_id}']
        print(customer_waiters) # Debug

    response = make_response(jsonify({'message': 'Logged out successfully.'}), 200)
    response.set_cookie('customer_id', '', expires=0, httponly=True, secure=True)
    response.set_cookie('staff_id', '', expires=0, httponly=True, secure=True)
    response.set_cookie('token', '', expires=0, httponly=True, secure=True)
    return response