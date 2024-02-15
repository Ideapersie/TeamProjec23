"""
Auxiliary methods used in authentication routes.
"""
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from secrets import token_hex
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

secret_key = token_hex(24) # Secret key used for signing tokens

def generate_signup_token(email, secret_key, salt='signup-salt', expiration=1800):
    """
    Generates a time-sensitive token for signup invitations.

    Args:
        email: The email address to which the invitation is being sent.
        secret_key: The secret key used to sign the token.
        salt: A unique salt value for the token, defaults to 'signup-salt'.
        expiration: The expiration time for the token in seconds.

    Returns:
        A signed, time-sensitive token.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    return serializer.dumps(email, salt=salt)

def validate_signup_token(token, secret_key, salt='signup-salt'):
    """
    Validates a signup token to ensure it is authentic and not expired.

    Args:
        token: The token to validate.
        secret_key: The secret key used to sign the token.
        salt: The salt value used when the token was generated.

    Returns:
        True if the token is valid and not expired, false otherwise.
    """
    serializer = URLSafeTimedSerializer(secret_key)
    try:
        email = serializer.loads(token, salt=salt, max_age=1800)
        return True
    except (BadSignature, SignatureExpired):
        return False

def send_invite(email, token, base_url='http://127.0.0.1:5000/api/menuitems'): # Adjust when frontend page is created
    """
    Sends an email invitation with a signup link containing a secure token.

    Args:
        email: The email address to send the invitation to.
        token: The time-sensitive token for signup.
        base_url: The base URL of the signup page.
    """
    signup_link = f"{base_url}?token={token}"
    message = Mail(
        from_email='farrows-strewn-04@icloud.com',
        to_emails=email,
        subject='Start your career with us!',
        html_content=f'Please click on the link to complete your sign-up: <a href="{signup_link}">Sign Up</a>'
    )
    try:
        sg = SendGridAPIClient('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')
        sg.send(message)
    except Exception as e:
        print(e.message)