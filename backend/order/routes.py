"""
A Flask blueprint defining the API routes for interacting with the orders.

The blueprint defines the following endpoints:
- /api/addorder (POST): Adds an order to the database.
- /api/deleteorder (POST): Deletes an order from the database.
- /api/modifyorder (POST): Modifies an existing order.
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
                    INSERT INTO Order (customer_id, time_ordered) VALUES 
                    ('{newOrder['customer_id']}', '{newOrder['time_ordered']}');
                    ''')
    for key, value in newOrder.items():
        if (key == "customer_id" or key == "time_ordered"):
            continue
        for x in range(int(value)):
            cursor.execute(f'''
                            INSERT INTO OrderMenu (customer_id, menuitem_id) VALUES
                            ('{newOrder['customer_id']}', '{key}');
                            ''')
    message = {
        "message" : "Order successfully added."
    }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(message)

@order_bp.route('/api/deleteorder', methods=['POST'])
def delete_order():
    """
    An API endpoint to delete orders from the database.
    """
    order_to_delete = request.json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM Order WHERE order_id = '{order_to_delete['order_id']}';
                   ''')
    existing_order = cursor.fetchall()

    if(len(existing_order) > 0):
        cursor.execute(f'''
                       DELETE FROM Order WHERE order_id = '{order_to_delete['order_id']}';
                       ''')
        message = {
            "message" : "Order has been successfully deleted."
        }
    else:
        message = {
            "message" : "Deleting order unsuccessful, order does not exist."
        }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(message)

@order_bp.route('/api/modifyorder', methods=['POST'])
def modify_order():
    """
    An API endpoint to modify existing orders in the database.
    """
    order_to_modify = request.json(force = True)
    orderid = order_to_modify['order_id']

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM Order WHERE order_id = '{orderid}';
                   ''')
    existing_order = cursor.fetchall()
    if (len(existing_order == 0)):
        message = {
            "message" : "Order does not exist."
        }
    else:
