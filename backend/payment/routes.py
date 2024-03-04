"""
A Flask blueprint defining API routes for the payment system.

This blueprint defines the following routes:
    /api/validate (POST): Checks whether card details are correct.
"""
from flask import Blueprint, request, jsonify
from payment.payment import luhn_check

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/api/validate', methods=['POST'])
def validate():
    """
    Validates the details of a payment card.

    Validation is done through the Luhn algorithm.
    The Luhn algorithm checks if the card number is possibly valid.

    Returns:
        A JSON response and a HTTP code.
    """
    data = request.get_json()
    card_number = data['card_number']

    if luhn_check(f'{card_number}'):
        return jsonify({'message': 'Card validated.'}), 200
    else:
        return jsonify({'message': 'Incorrect information provided.'}), 400