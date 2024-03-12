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

    #insert order into Order table to create the unique order_id 
    cursor.execute(f'''INSERT INTO "Order" (customer_id, status, time_ordered, is_paid) 
                   VALUES ('{customer_id}', 'Unconfirmed', '{time_ordered}', 'false');''')
    
    cursor.execute(f'''SELECT order_id FROM "Order" WHERE customer_id = '{customer_id}' AND time_ordered = '{time_ordered}';''')
    find_orderid = cursor.fetchone()
    order_id = find_orderid[0] #fetch order_id that has just been created

    for item in newOrder['items']: #iterate through the list of dicts of items in items
            cursor.execute(f'''INSERT INTO OrderMenu (order_id, menuitem_id, quantity) 
                           VALUES ('{order_id}', '{item['menuitem_id']}', '{item['quantity']}');''') #inserts orders into OrderMenu
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
                   SELECT order_id FROM "Order" WHERE order_id = '{order_to_delete['order_id']}';
                   ''')
    existing_order = cursor.fetchall()

    if(existing_order != None):
        cursor.execute(f'''
                       DELETE FROM "Order" WHERE order_id = '{order_to_delete['order_id']}';
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
    order_id = order_to_modify['order_id'] 

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f'''
                   SELECT order_id FROM "Order" WHERE order_id = '{order_id}';
                   ''')
    existing_order = cursor.fetchall()
    
    if (existing_order != None):
        cursor.execute(f'''
                       DELETE FROM OrderMenu WHERE order_id = '{order_id}';
                       ''')
        for item in order_to_modify['items']:
            for x in range (int(item['quantity'])):
                 cursor.execute(f'''
                                INSERT INTO OrderMenu (customer_id, menuitem_id) VALUES
                                ('{order_id}', '{item['menuitem_id']}');
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

@order_bp.route('/api/fetchorders', methods=['GET'])
def fetch_orders():
     """
     An API endpoint to fetch and return all current orders.
     """
     conn = get_db_connection()
     cursor = conn.cursor()
     cursor.execute(f'''SELECT * FROM "Order" ORDER BY time_ordered asc;''')
     order = cursor.fetchall()

     orders = [{'order_id': item[0],
                'customer_id': item[1],
                'status': item[2],
                'time_ordered': item[3],
                'is_paid': item[4]} for item in order]
     
     cursor.close()
     conn.close()
     return jsonify(orders)

@order_bp.route('/api/getTableOrder', methods=['Get'])
def get_order_by_table():
    try:
        #connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        #execute sql query
        cursor.execute("SELECT * FROM 'ORDER';")
        orders = cursor.fetchall()
        
        #close connection
        cursor.close()
        conn.close()
        
        #sort data into json package
        return jsonify(orders)
        
    except Exception as e:  #database couldn't be reached
        return jsonify("Something went wrong"), 500

