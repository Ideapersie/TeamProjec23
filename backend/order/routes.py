"""
A Flask blueprint defining the API routes for interacting with the orders.

The blueprint defines the following endpoints:
- /api/addorder (POST): Adds an order to the database.
- /api/deleteorder (POST): Deletes an order from the database.
- /api/modifyorder (POST): Modifies an existing order.
- /api/getTableOrders (GET): Returns each order_id and its table number.
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
        cursor.execute(f'''
                       DELETE FROM OrderMenu WHERE order_id = '{order_to_delete['order_id']}';
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
    
    if (len(existing_order > 0)):
        cursor.execute(f'''
                       DELETE FROM OrderMenu WHERE order_id = '{order_to_modify['order_id']}';
                       ''')
        for key, value in order_to_modify.items():
            if (key == "customer_id" or key == "time_ordered"):
                continue
            for x in range(int(value)):
                cursor.execute(f'''
                                INSERT INTO OrderMenu (customer_id, menuitem_id) VALUES
                                ('{order_to_modify['customer_id']}', '{key}');
                                ''')
        message = {
            "message" : "Order successfully updated."
        }
    else:
        message = {
            "message" : "Order could not be updated, does not exist."
        }
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify(message)

@order_bp.route('/api/getTableOrders', methods=['Get'])
def get_order_by_table():
    """
    An api endpoint to get each order_id and its corrosponding table number
        
    Returns:
        A repsponse containing data in the format {table_number, order_id}
    """
    try:
        #connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        #execute sql query
        cursor.execute('''SELECT table_number, order_id FROM 'Order' 
                        GROUP BY table_number, order_id 
                        ORDER BY table_number ASC;''')
        orders = cursor.fetchall()
        
        #close connection
        cursor.close()
        conn.close()
        
        #return data
        return jsonify(orders)
        
    except Exception as e:  #database couldn't be reached
        return jsonify("Something went wrong."), 500

