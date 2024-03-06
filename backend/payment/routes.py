"""
A Flask blueprint defining API routes for the payment system.

This blueprint defines the following routes:
    /api/validate_store_card (POST): Checks whether card details are correct.
    /api/get_payment_info (GET): Fetches the payment information of a user.
"""
from flask import Blueprint, request, jsonify
from payment.payment import luhn_check, get_payment_info, store_payment_info, update_is_paid

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/api/payment/pay_bill/<order_id>', methods=['POST'])
def pay_bill(order_id):
    """
    Validates the details of a payment card and updates whether the order is paid for.

    Validation is done through the Luhn algorithm.
    Payment details can also be saved to the database for a user if specified.

    Returns:
        A JSON response and a HTTP code.
    """
    data = request.get_json()
    customer_id = data['customer_id']
    store_card = data['store_card']
    card_number = data['card_number']
    holder_name = data['holder_name']
    expiration_date = data['expiration_date']

    if luhn_check(f'{card_number}'):
        if store_card == 'True':
            store_payment_info(customer_id, card_number, holder_name, expiration_date)
            update_is_paid(order_id)
            return jsonify({'message': 'Card validated and stored.'}), 200
        update_is_paid(order_id)
        return jsonify({'message': 'Card validated.'}), 200
    else:
        return jsonify({'message': 'Incorrect information provided.'}), 400
    
@payment_bp.route('/api/get_payment_info', methods=['GET'])
def get_payment_info():
    """
    Fetches the payment information associated with a user.

    Returns:
        The payment information as a JSON payload if it exists, else an error message.
    """
    data = request.get_json()
    customer_id = data['customer_id']

    return get_payment_info(customer_id)