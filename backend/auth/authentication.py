"""
Auxiliary methods used in authentication routes.

The module is concerned with token generation for sign-up and log-in.
It also provides a method for sending sign-up invites to staff members using SendGrid.
"""
import json
from secrets import token_hex

from flask import request
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from menu.connection import get_db_connection

customer_waiters = {} # Dictionary to track which waiters can be assigned to customers
occupied_tables = set() # Set to track all occupied tables

secret_key = token_hex(24) # Secret key used for signing tokens

def generate_signup_token(email, secret_key, salt='signup-salt'):
    """
    Generates a sign-up token for the given email address using the provided secret key.

    Args:
        email (str): The email address for which the sign-up token is generated for.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): A value used to add additional security to the token, defaults to 'signup-salt'.

    Returns:
        str: The generated sign-up token.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(email, salt=salt)

def validate_signup_token(token, secret_key, salt='signup-salt'):
    """
    Validates a sign-up token by checking if it has been tampered with or expired.

    Args:
        token (str): The sign-up token to validate.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): The salt used in the token signing process, defaults to 'signup-salt'.

    Returns:
        bool: True if the token is valid, false otherwise.

    Raises:
        BadSignature: If the token has been tampered with.
        SignatureExpired: If the token has expired.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        serializer.loads(token, salt=salt, max_age=1800)
        return True
    except (BadSignature, SignatureExpired):
        print('Token is invalid/expired.')
        return False

def send_invite(email, token, base_url='http://127.0.0.1:3000/auth/signup'):
    """
    Sends an sign-up invite through email to the specified email address.

    On clicking the link in the email, the user will be redirected to the sign-up page.
    If a customer was to access this page, they would fail to register an account as they
    do not hold the token.
    
    Args:
        email (str): The recipient's email address.
        token (str): The token used for authentication.
        base_url (str, optional): Where the user is redirected to after clicking the email link.

    Raises:
        Exception: If there is an error sending the email.
    """
    # Define information to send in the message
    signup_link = f'{base_url}?token={token}'
    message = Mail(
        from_email='farrows-strewn-04@icloud.com',
        to_emails=email,
        subject='Start your career with us!',
        html_content=f'Please click on the link to complete your sign-up: <a href="{signup_link}">Sign Up</a>'
    )

    # Send the message via SendGrid
    try:
        sg = SendGridAPIClient('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') # SendGrid API key
        sg.send(message)
    except Exception as e:
        print(f'ERROR: COULD NOT SEND VIA SENDGRID: {e.message}')

def generate_customer_token(email, secret_key, salt='customer-salt'):
    """
    Generates a session token for a customer user with a dedicated salt.

    The salt will be used in authenticating whether the session token decrypts to a customer.

    Args:
        email (str): The email address for which the session token is generated for.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): Ensures that an token generated with a specific salt can only be decrypted using that same salt, defaults to 'customer-salt'.

    Returns:
        str: The generated session token.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(email, salt=salt)

def validate_customer_token(token, secret_key, salt='customer-salt'):
    """
    Validates a session token by checking if it was generated for a customer.

    Args:
        token (str): The session token to validate.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): The salt used in the token signing process, defaults to 'customer-salt'.

    Returns:
        bool: True if the token is valid, false otherwise.

    Raises:
        BadSignature: If the token has been tampered with.
        SignatureExpired: If the token has expired.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        serializer.loads(token, salt=salt, max_age=3600)
        return True
    except (BadSignature, SignatureExpired):
        return False
    
def generate_staff_token(email, secret_key, salt='staff-salt'):
    """
    Generates a session token for a staff user with a dedicated salt.

    The salt will be used in authenticating whether the session token decrypts to a staff.

    Args:
        email (str): The email address for which the session token is generated for.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): Ensures that an token generated with a specific salt can only be decrypted using that same salt, defaults to 'staff-salt'.

    Returns:
        str: The generated session token.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(email, salt=salt)

def validate_staff_token(token, secret_key, salt='staff-salt'):
    """
    Validates a session token by checking if it was generated for a staff.

    Args:
        token (str): The session token to validate.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): The salt used in the token signing process, defaults to 'staff-salt'.

    Returns:
        bool: True if the token is valid, false otherwise.

    Raises:
        BadSignature: If the token has been tampered with.
        SignatureExpired: If the token has expired.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        serializer.loads(token, salt=salt, max_age=3600)
        return True
    except (BadSignature, SignatureExpired):
        return False
    
def generate_admin_token(email, secret_key, salt='admin-salt'):
    """
    Generates a session token for an admin user with a dedicated salt.

    The salt will be used in authenticating whether the session token decrypts to an admin.

    Args:
        email (str): The email address for which the session token is generated for.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): Ensures that an token generated with a specific salt can only be decrypted using that same salt, defaults to 'admin-salt'.

    Returns:
        str: The generated session token.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(email, salt=salt)

def validate_admin_token(token, secret_key, salt='admin-salt'):
    """
    Validates a session token by checking if it was generated for an admin.

    Args:
        token (str): The session token to validate.
        secret_key (str): The secret key used to sign the token.
        salt (str, optional): The salt used in the token signing process, defaults to 'admin-salt'.

    Returns:
        bool: True if the token is valid, false otherwise.

    Raises:
        BadSignature: If the token has been tampered with.
        SignatureExpired: If the token has expired.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        serializer.loads(token, salt=salt, max_age=3600)
        return True
    except (BadSignature, SignatureExpired):
        return False
    
def protect_customer():
    """
    Integrated in routes to check whether the user has permission to access the route.

    The user is authorised if they are either an admin or a staff (determined by cookie).

    Returns:
        bool: True if user is authorised, False otherwise.
    """
    if not request.cookies.get('token'):
        return False
    elif not validate_admin_token(request.cookies.get('token'), secret_key) and not validate_staff_token(request.cookies.get('token'), secret_key):
        return False
    else:
        return True
    
def protect_customer_staff():
    """
    Integrated in routes to check whether the user has permission to access the route.

    The user is authorised if they are an admin (determined by cookie).

    Returns:
        bool: True if user is authorised, False otherwise.
    """
    if not request.cookies.get('token'):
        return False
    elif not validate_admin_token(request.cookies.get('token'), secret_key):
        return False
    else:
        return True
    
def fetch_user_info(type, id):
    """
    Fetches user information and encodes as a JSON object.

    This can be decoded in frontend to preserve the original format the JSON was encoded with.

    Args:
        type (str): The type of user e.g. waiter, kitchen, or customer.
        id (int): the id of the user in their respective database table.

    Returns:
        str: A JSON encoded object representing the user information.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    # Fetch waiter or kitchen information and encode as JSON if user is a waiter or kitchen staff
    if type == 'Waiter' or type == 'Kitchen':
        cursor.execute("""
                    SELECT email, admin, first_name, last_name
                    FROM Staff
                    WHERE staff_id = %s
                    """, (id,))
        data = cursor.fetchone()
        user_data = {
            'role': type,
            'is_admin': data[1],
            'profile': {
                'id': id,
                'first_name': data[2],
                'last_name': data[3],
                'email': data[0]
            }
        }
        user_data_str = json.dumps(user_data)

    # Else fetch customer information and encode as JSON
    else:
        cursor.execute("""
                    SELECT email, first_name, last_name
                    FROM Customer
                    WHERE customer_id = %s
                    """, (id,))
        data = cursor.fetchone()
        user_data = {
            'role': type,
            'is_admin': False,
            'profile': {
                'id': id,
                'first_name': data[1],
                'last_name': data[2],
                'email': data[0]
            }
        }
        user_data_str = json.dumps(user_data)
    cursor.close()
    conn.close()

    return user_data_str