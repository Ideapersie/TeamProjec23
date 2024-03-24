from backend.auth.authentication import customer_waiters
from backend.menu.connection import get_db_connection


def get_waiter_tables(staff_id) -> list[int]:
    """Returns a list of tables the given waiter is tending to."""
    return customer_waiters.get(staff_id, [])


def get_customer_table_number(customer_id: int) -> int | None:
    """Returns current table number (or None, if one has not been set)"""

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT table_number
        FROM Customer
        WHERE customer_id = %s
    """, (customer_id,))

    [table_number] = cursor.fetchone()

    if table_number == -1:
        return None
    else:
        return table_number
