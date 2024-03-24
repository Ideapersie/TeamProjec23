import jwt

from flask import request
from resources import config
from tables import get_customer_table_number, get_waiter_tables


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


class UnauthorisedAccessError(Exception):
    """Raised when a user's permissions are not sufficient to perform a given function"""


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

    def is_staff_session(self) -> bool:
        """Returns true if session type is staff"""
        return self.get_session_type() == 'staff'

    def is_customer_session(self) -> bool:
        """Returns true if session type is customer"""
        return self.get_session_type() == 'customer'

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

    def get_table_number(self) -> int | list[int] | None:
        """If customer return table number sat at, if waiter return list of tables tending to, else return None."""

        # Customer
        if self.is_customer_session():
            return get_customer_table_number(self.get_user_id())

        # Waiter
        elif self.get_role() == "Waiter":
            return get_waiter_tables(self.get_user_id())

        # Kitchen (or other)
        else:
            return None

    def assert_staff(self) -> None:
        """Asserts that user is staff."""

        if not self.is_staff_session():
            raise UnauthorisedAccessError(f"Access denied: only accessible by staff members. You are: {self.get_session_type()}")

    def assert_role(self, role: str) -> None:
        """Asserts that user is staff, and has the specified role."""

        self.assert_staff()

        if role != self.get_role():
            raise UnauthorisedAccessError(f"Access denied: only accessible by {role} role. You are {self.get_role()}")

    def assert_admin(self) -> None:
        """Asserts that user is staff, and an admin."""

        self.assert_staff()

        if not self.get_is_admin():
            raise UnauthorisedAccessError(f"Access denied: only accessible by admin users.")

    def json(self) -> dict:
        """Returns session data."""

        cookie = self.get_cookie()

        # Customer
        if self.is_customer_session():
            cookie['table_number'] = self.get_table_number()

        # Waiter
        if self.get_role() == "Waiter":
            cookie['table_numbers'] = self.get_table_number()

        return cookie


def get_session() -> AuthSession | None:
    """Returns an AuthSession (or None, if not logged in)"""
    try:
        return AuthSession()

    except NoSessionError as e:
        print(e)
        return None
