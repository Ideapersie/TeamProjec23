import jwt
from flask import request, make_response, jsonify, Response
from backend.resources import config


def get_decoded_session_from_cookie() -> dict | None:
    """
    Get encoded jwt token from cookies and decode it.

    Returns:
        - Decoded JWT Session token
    """

    encoded_session_token = request.cookies.get('session')
    if not encoded_session_token:
        return None

    return jwt.decode(encoded_session_token, config.JWT_SECRET, algorithms='HS256')


class NoSessionError(Exception):
    """Raised when a valid session cookie is required but not found"""


def logout() -> Response:
    """Logs the current user out by deleting session cookie"""
    res = make_response(jsonify({
        'message': 'User logged out'
    }))
    res.delete_cookie('session')
    return res


class AuthSession:
    """A class for interacting with an open auth session"""

    def __init__(self):
        """Constructor method"""
        self._cookie = get_decoded_session_from_cookie()
        if self._cookie is None:
            raise NoSessionError('No session cookie found')

    def get_cookie(self) -> dict:
        """Returns the decoded cookie from the browser"""
        return self._cookie

    def get_session_type(self) -> str:
        """Returns session type i.e. staff or customer"""
        return self.get_cookie()['session_type']

    def get_user(self) -> dict:
        """Returns dictionary contain all user info"""
        return self.get_cookie()['user']

    def get_user_id(self) -> int:
        """Returns user id"""
        return self.get_user()['id']

    def get_first_name(self) -> str:
        """Returns user first name"""
        return self.get_user()['first_name']

    def get_last_name(self) -> str:
        """Returns user last name"""
        return self.get_user()['last_name']

    def get_email(self) -> str:
        """Returns user email address"""
        return self.get_user()['email']

    def get_role(self) -> str | None:
        """Returns user role (or None if user is customer)"""
        return self.get_user().get('role', None)

    def get_is_admin(self) -> bool | None:
        """Returns user admin status (or None if user is customer)"""
        return self.get_user().get('is_admin', None)


def get_session() -> AuthSession | None:
    """Returns an AuthSession (or None, if not logged in)"""
    try:
        return AuthSession()

    except NoSessionError as e:
        print(e)
        return None
