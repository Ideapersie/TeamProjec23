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

    customer_id = newOrder['customer_id']
    time_ordered = newOrder['time_ordered']
    table_number = newOrder['table_number']

    cursor.execute(f'''
                    INSERT INTO Order (customer_id, time_ordered, table_number) VALUES 
                    ('{customer_id}', '{time_ordered}', '{table_number}');
                    ''') #insert order into Order table to create the unique order_id 
    cursor.execute(f'''
                    SELECT order_id FROM Order WHERE customer_id = '{customer_id}'
                    AND time_ordered = '{time_ordered}'
                    AND table_number = '{table_number}';
                    ''')
    find_orderid = cursor.fetchone()
    order_id = find_orderid[0] #fetch order_id that has just been created

    for item in newOrder['items']: #iterate through the list of dicts of items in items
                for x in range(int(item['quantity'])): #adds the menuitems to the database depending on quantity
                    cursor.execute(f'''
                                    INSERT INTO OrderMenu (order_id, menuitem_id) VALUES
                                    ('{order_id}', '{item['menuitem_id']}');
                                    ''') #inserts orders into OrderMenu
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

    if(existing_order != None):
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
                   ''')#NEEDS CHANGING FOR CUSTOMERID
    existing_order = cursor.fetchall()
    
    if (existing_order != None):
        cursor.execute(f'''
                       DELETE FROM OrderMenu WHERE order_id = '{order_to_modify['order_id']}';
                       ''')#NEEDS CHANGING FOR CUSTOMERID
        for element in order_to_modify:
            if 'item_id' in element:
                for x in range (int(order_to_modify[element]['quantity'])):
                    cursor.execute(f'''
                                    INSERT INTO OrderMenu (customer_id, menuitem_id) VALUES
                                    ('{order_to_modify['customer_id']}', '{order_to_modify[element]['item_id']}');
                                    ''')#NEEDS CHANGING FOR CUSTOMERID
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