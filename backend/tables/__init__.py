from auth.authentication import customer_waiters
from menu.connection import get_db_connection


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


def get_waiter_by_table_number(table_number: int) -> int | None:
    """Returns the waiter id for the given table number"""

    print("Reached get_waiter_by_table_number:", customer_waiters)
    for waiter_id in dict.keys(customer_waiters):
        print("Waiter id:", waiter_id)
        print("Tables:", customer_waiters[waiter_id])
        if table_number in customer_waiters[waiter_id]:
            return waiter_id

    return None


def get_customer_table(customer_id: int) -> int | None:
    """Returns the table number the customer has been assigned to, if any"""
    pass
