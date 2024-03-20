"""
A Flask blueprint defining API routes for the payment system.

This blueprint defines the following routes:
    /api/payment/pay_bill/<order_id> (POST)
    /api/payment/get_payment_info (GET)
    /api/payment/get_unpaid_delivered (GET)
"""
from flask import Blueprint, request, jsonify
from payment.payment import (
    luhn_check, fetch_payment_info, store_payment_info,
    update_is_paid,fetch_unpaid_delivered
)

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/api/payment/pay_bill/<order_id>', methods=['POST'])
def pay_bill(order_id):
    """
    Sets order as paid if the payment card is valid.

    The payment card is valid if it passes a Luhn check.
    Payment details can be stored in the database if specified by 'store_card'.

    Args:
        order_id: The order the bill is being paid for.

    Returns:
        HTTP 200 if payment card is valid, HTTP 400 otherwise.
    """
    data = request.get_json(force=True)
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
    
@payment_bp.route('/api/payment/get_payment_info/<customer_id>', methods=['GET'])
def get_payment_info(customer_id):
    """
    Fetches the payment information associated with a customer.

    Returns:
        A JSON payload if payment information exists, HTTP 400 otherwise.
    """
    out = fetch_payment_info(customer_id)
    if out:
        return jsonify(out), 200
    else:
        return jsonify({'message': 'No payment information found for customer.'}), 400

@payment_bp.route('/api/payment/get_unpaid_delivered', methods=['GET'])
def get_unpaid_delivered():
    """
    Fetches all orders which have attributes 'status' as 'Delivered' and 'is_paid' as 'False'.

    Returns:
        A JSON payload if such orders exist, HTTP 400 otherwise.
    """
    out = fetch_unpaid_delivered()
    if out:
        return jsonify(out), 200
    else:
        return jsonify({'message': 'No such orders found.'}), 400