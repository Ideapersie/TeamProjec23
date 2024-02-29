"""
A Flask blueprint defining the API routes for interacting with the orders.

The blueprint defines the following endpoints:
- /api/addorder (POST): Adds an order to the database.
- /api/deleteorder (POST): Deletes an order from the database.
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection

order_bp = Blueprint('order', __name__)

@order_bp.route('/api/addorder', methods=['POST'])
def add_order():
    """
    An API endpoint to add orders to the database.
    """
    newOrder = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM Order WHERE name = '{newOrder['order_id']}';
                    ''')
    existing_order = cursor.fetchall()

    if (len(existing_order) == 0):
        cursor.execute(f'''
                       INSERT INTO Order (customer_id, time_ordered) VALUES 
                       ('{newOrder['customer_id']}', '{newOrder['time_ordered']}');
                       ''')
        #Need to add extra query to iterate through menu items and add to the Order Menu table.

        message = {
            "message" : "Order successfully added."
        }
    else:
        message = {
            "message" : "Adding order unsuccessful, order already exists."
        }
    conn.commit()
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
                       DELETE FROM Order WHERE order_id = '{order_to_delete['order_id']}';
                       ''')
        message = {
            "message" : "Order has been successfully deleted."
        }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(message)