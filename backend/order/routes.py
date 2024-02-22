"""
A Flask blueprint defining the API routes for interacting with the orders.

The blueprint defines the following endpoints:
- /api/addorder (POST): Adds an order to the database.
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection

order_bp = Blueprint('order', __name__)

@order_bp.route('/api/addorder', methods=['POST'])
def add_order():

    newOrder = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT order_id FROM Order WHERE name = %s;' % (newOrder["order_id"]))
    existing_order = cursor.fetchall()

    if (existing_order == None):
        cursor.execute('INSERT INTO Order (order_id, customer_id, time_ordered) VALUES (%s, %s, %s)'
                       % (newOrder['order_id'], newOrder['customer_id'], newOrder['time_ordered']))
        message = {
            "message" : "Order successfully added."
        }
    else:
        message = {
            "message" : "Adding order unsuccessful."
        }
    cursor.close()
    conn.close()
    return jsonify(message)