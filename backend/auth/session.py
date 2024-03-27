"""
Auxiliary methods to determine user information based on sessions.
"""
import jwt

from flask import request
from resources import config
from tables import get_customer_table_number, get_waiter_tables, get_waiter_by_table_number

def get_decoded_session_from_cookie() -> dict | None:
    """
    Gets the encoded jwt token from cookies and decode it.

    Returns:
        dict: Decoded JWT Session token.
    """
    encoded_session_token = request.cookies.get('session')
    if not encoded_session_token:
        return None

    return jwt.decode(encoded_session_token, config.JWT_SECRET, algorithms='HS256')

class NoSessionError(Exception):
    """
    Raised when a valid session cookie is required but not found.

    Param:
        message (str): The message to be passed into the exception.
    """

class UnauthorisedAccessError(Exception):
    """
    Raised when a user's permissions are not sufficient to perform a given function.

    Param:
        message (str): The message to be passed into the exception.
    """

class AuthSession:
    """
    A class for interacting with an open auth session.
    """

    def __init__(self):
        """
        Constructor method.
        """
        self._cookie = get_decoded_session_from_cookie()
        if self._cookie is None:
            raise NoSessionError('No session cookie found')

    def get_cookie(self) -> dict:
        """
        Gets the decoded cookie from the browser.

        Returns:
            dict: The decoded cookie.
        """
        return self._cookie

    def get_session_type(self) -> str:
        """
        Gets session type i.e. staff or customer.
        
        Returns:
            str: The session type.
        """
        return self.get_cookie()['session_type']

    def is_staff_session(self) -> bool:
        """
        Confirms the session type is staff.
        
        Returns:
            bool: True if session type is staff, false otherwise.
        """
        return self.get_session_type() == 'staff'

    def is_customer_session(self) -> bool:
        """
        Confirms if the session type is customer.
        
        Returns:
            bool: True if sesion type is customer, false otherwise.
        """
        return self.get_session_type() == 'customer'

    def get_user(self) -> dict:
        """
        Gets all user info.
        
        Returns:
            dict: A dictionary containing all user info.
        """
        return self.get_cookie()['user']

    def get_user_id(self) -> int:
        """
        Gets the user's id.
        
        Returns:
            int: The user's id.
        """
        return self.get_user()['id']

    def get_first_name(self) -> str:
        """
        Gets the user's first name.
        
        Returns:
            str: The first name.
        """
        return self.get_user()['first_name']

    def get_last_name(self) -> str:
        """
        Gets the user's last name.
        
        Returns:
            str: The user's last name.
        """
        return self.get_user()['last_name']

    def get_email(self) -> str:
        """
        Gets the user's email address
        
        Returns:
            str: The user's email address.
        """
        return self.get_user()['email']

    def get_role(self) -> str | None:
        """
        Gets the user's role (or None if user is customer).
        
        Returns:
            str or none: The user's role (or None if user is customer).
        """
        return self.get_user().get('role', None)

    def get_is_admin(self) -> bool | None:
        """
        Determines whether the user is admin.

        Returns:
            bool or none: True if user is admin (or False), or None if user is customer.
        """
        return self.get_user().get('is_admin', None)

    def get_table_number(self) -> int | list[int] | None:
        """
        Gets customer table number sat at if customer or
        the waiter's list of tables tending to if waiter.
        
        Returns:
            int or list of int or none: The table number for the customer, or list of customers for waiter, or None.
        """
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
        """
        Asserts that user is staff.
        """
        if not self.is_staff_session():
            raise UnauthorisedAccessError(f"Access denied: only accessible by staff members. You are: {self.get_session_type()}")

    def assert_role(self, role: str) -> None:
        """
        Asserts that user is staff, and has the specified role.
        """
        self.assert_staff()

        if role != self.get_role():
            raise UnauthorisedAccessError(f"Access denied: only accessible by {role} role. You are {self.get_role()}")

    def assert_admin(self) -> None:
        """
        Asserts that user is staff, and an admin.
        """
        self.assert_staff()

        if not self.get_is_admin():
            raise UnauthorisedAccessError(f"Access denied: only accessible by admin users.")

    def assert_customer(self) -> None:
        """
        Assert that user is a customer.
        """
        if not self.is_customer_session():
            raise UnauthorisedAccessError(f"Access denied: only accessible by customers")

    def get_waiter_id(self) -> int | None:
        """
        Gets the wait.

        Retruns:
            int: The waiter id.
        """
        self.assert_customer()
        table_number = self.get_table_number()

        return get_waiter_by_table_number(table_number)

    def json(self) -> dict:
        """
        Gets the session data.

        Returns:
            dict: The session data.
        """
        cookie = self.get_cookie()

        # Customer
        if self.is_customer_session():
            cookie['table_number'] = self.get_table_number()
            cookie['waiter_id'] = self.get_waiter_id()

        # Waiter
        if self.get_role() == "Waiter":
            cookie['table_numbers'] = self.get_table_number()

        return cookie

def get_session() -> AuthSession | None:
    """
    Gets the AuthSession.

    Returns:
        authsession or none: AuthSession if logged in, otherwise None.

    Raises:
        NoSessionError: If a session could not be found.
    """
    try:
        return AuthSession()

    except NoSessionError as e:
        print(e)
        return None
