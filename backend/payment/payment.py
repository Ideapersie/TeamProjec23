"""
Auxiliary methods used in the payment routes.
"""
import psycopg2
from resources import config

def get_db_connection():
    """
    Establishes a connection to the Postgres database.
    
    Returns:
        A psycopg2 connection object.
    """
    conn = psycopg2.connect(dbname = config.DATABASE_NAME,
                            user = config.DATABASE_USER,
                            password = config.DATABASE_PASSWORD,
                            host = config.DATABASE_HOST)
    return conn

def luhn_check(card_number):
    """
    Validates a card number.

    Validation is done through a Luhn check.
    If a card number passes the Luhn check it's typically not a guarantee on validity, but for the sake of simplicity this method assumes it is.

    Args:
        card_number: The card number to validate.

    Returns:
        A boolean indicating whether the card number is valid.
    """
    card_number_list = []

    for i in range(len(card_number)):
        card_number_list.append(int(card_number[i]))

    for i in range(len(card_number_list) - 1, -1, -1):
        if (len(card_number_list) - i) % 2 != 0:
            continue
        doubled = card_number_list[i] * 2
        if (doubled > 9):
            card_number_list[i] = int(str(doubled)[0]) + int(str(doubled)[1])
        else:
            card_number_list[i] = doubled

    sum = 0
    for i in range(len(card_number_list)):
        sum += card_number_list[i]

    if sum % 10 == 0:
        return True
    else:
        return False
    
def fetch_payment_info(customer_id):
    """
    Fetches the payment information associated with a user.

    Args:
        customer_id: The customer which the data is fetched for.

    Returns:
        A JSON payload containing the payment information if it exists, None otherwise.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f'SELECT * FROM PaymentInfo WHERE customer_id = {customer_id}')
    data = cursor.fetchone()

    cursor.close()
    conn.close()

    if data:
        payment_info = [{'paymentinfo_id': data[0],
                         'customer_id': data[1],
                         'card_number': data[2],
                         'holder_name': data[3],
                         'expiration_date': data[4]}]
        return payment_info
    else:
        return None
    
def store_payment_info(customer_id, card_number, holder_name, expiration_date):
    """
    Stores the payment information associated to a customer in the database.

    Args:
        customer_id: The customer which the data is being stored for.
        card_number: The card number to store.
        holder_name: The full name of the card holder.
        expiration_date: The expiry date of the card.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
                   DELETE FROM PaymentInfo
                   WHERE customer_id = %s
                   """, (customer_id))
    cursor.execute("""
                   INSERT INTO PaymentInfo (customer_id, card_number, holder_name, expiration_date)
                   VALUES (%s, %s, %s, %s)
                   """, (customer_id, card_number, holder_name, expiration_date))
    conn.commit()

    cursor.close()
    conn.close()

def update_is_paid(order_id):
    """
    Updates the 'is_paid' attribute to 'True' for an order.

    Args:
        order_id: The order to update.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
                   UPDATE "Order"
                   SET is_paid = True
                   WHERE order_id = %s
                   """, (order_id))
    conn.commit()

    cursor.close()
    conn.close()

def fetch_unpaid_delivered():
    """
    Fetches all orders which have attributes 'status' as 'Delivered' and 'is_paid' as 'False'.

    Returns:
        A tuple containing all orders which adhere to the description, None otherwise.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
                   SELECT * FROM "Order"
                   WHERE status = 'Delivered' AND is_paid = False
                   """)
    data = cursor.fetchall()
    
    cursor.close()
    conn.close()

    if data:
        orders = [{'order_id': order[0],
                   'customer_id': order[1],
                   'status': order[2],
                   'time_ordered': order[3],
                   'table_number': order[4],
                   'is_paid': order[5]} for order in data]
        return orders
    else:
        return None