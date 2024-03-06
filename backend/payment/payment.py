"""
Auxiliary methods used in the payment routes.

This modules defines credit card authentication methods as well as fetch/insert methods for the database.
"""
import psycopg2
from flask import jsonify
from resources import config

def get_db_connection():
    """
    Establishes a connection to Postgres.
    
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
    Validates whether a card number has the possibility of being correct.

    This method uses the Luhn algorithm to check validity.
    In real life, if a card number passes the Luhn check, it's not a guarantee on validity.
    Since we're not concerned with real accounts, we can assume a Luhn check is a guarentee on validity.

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
    
def get_payment_info(customer_id):
    """
    Returns the payment information associated with a user.

    This method either returns the payment information on success, or an error message if such information does not exist.

    Args:
        customer_id: The id of the customer to which the data is fetched for.

    Returns:
        A JSON payload on success or a JSON error message.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f'SELECT * FROM PaymentInfo WHERE customer_id = {customer_id}')
    data = cursor.fetchone()

    cursor.close()
    conn.close()

    if data:
        payment_info = [{'card_number': data['card_number'],
                        'holder_name': data['holder_name'],
                        'expiration_date': data['expiration_date']}]
        return payment_info
    else:
        return jsonify({'message': 'Payment information not found.'}), 400
    
def store_payment_info(customer_id, card_number, holder_name, expiration_date):
    """
    Stores payment data associated to a customer in the database.

    Args:
        customer_id: The ID of the customer which the data is being stored for.
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
    Updates the 'is_paid' attribute for an order once payment is received.

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