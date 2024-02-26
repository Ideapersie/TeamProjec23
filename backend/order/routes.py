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
    newOrder = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM Order WHERE name = '{newOrder['order_id']}';
                    ''')
    existing_order = cursor.fetchall()

    if (len(existing_order) == 0):
        cursor.execute(f'''
                       INSERT INTO Order (order_id, customer_id, time_ordered) VALUES 
                       ('{newOrder['order_id']}', '{newOrder['customer_id']}', '{newOrder['time_ordered']}');
                       ''')
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

@order_bp.route('/api/deleteorder', methods=['POST'])
def delete_order():
    order_to_delete = request.json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM Order WHERE order_id = '{order_to_delete['order_id']}';
                   ''')
    existing_order = cursor.fetchall()

    if(len(existing_order) == 0):
        message = {
            "message" : "Order does not exist."
        }
    else:
        cursor.execute(f'''
                       DELETE FROM Order WHERE order_id = '{order_to_delete['order_id']}'
                       ''')
        message = {
            "message" : "Order has been successfully deleted."
        }
    cursor.close()
    conn.close()
    return jsonify(message)