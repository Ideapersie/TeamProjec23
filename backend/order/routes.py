"""
A Flask blueprint defining the API routes for interacting with the orders.
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection
from auth.authentication import customer_waiters
from datetime import datetime, timedelta
from auth.session import AuthSession

order_bp = Blueprint('order', __name__)


@order_bp.route('/api/addorder', methods=['POST'])
def add_order():
    """
    An API endpoint to add orders to the database.

    This route expects a JSON payload containing the menu items and quantity ordered.

    Returns:
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If order could not be added.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        session = AuthSession()  # Get session from cookie
        session.assert_customer()  # Only allow access to customers

        data = request.get_json(force=True)

        customer_id = session.get_user_id()
        time_ordered = datetime.now()

        # Insert order into Order table to create the unique order_id
        cursor.execute('''
            INSERT INTO "Order" (customer_id, status, time_ordered, is_paid)
            VALUES (%s, %s, %s, %s)
            RETURNING order_id;
        ''', (customer_id, 'Unconfirmed', time_ordered, False))

        order_id = cursor.fetchone()[0]  # fetch order_id that has just been created

        # Insert order items into OrderMenu
        for item in data['items']:
            cursor.execute('''
                INSERT INTO OrderMenu (order_id, menuitem_id, quantity) 
                VALUES (%s, %s, %s);
            ''', (order_id, item['menuitem_id'], item['quantity']))

        # Find the waiter associated with the customer
        staff_id = None
        for waiter, customers in customer_waiters.items():
            if int(customer_id) in customers:
                staff_id = waiter
                break

        # Insert staff_id and order_id into StaffOrder
        if staff_id:
            cursor.execute("""
                INSERT INTO StaffOrder (staff_id, order_id)
                VALUES (%s, %s)
            """, (staff_id, order_id))
            print(f'SUCCESS: STAFF_ID {staff_id} & ORDER_ID {order_id} INSERTED INTO STAFFORDER')
        else:
            print(f'ERROR: CUSTOMER_ID {customer_id} HAS NO ASSOCIATED STAFF_ID, ' +
                  'YOU WILL NEED TO LOG INTO A WAITER ACCOUNT FIRST')
            return jsonify({
                'message': f'ERROR: CUSTOMER_ID {customer_id} HAS NO ASSOCIATED STAFF_ID'
            }), 503

        conn.commit()

        return jsonify({
            "message": "Order successfully added.",
            "new_order_id": order_id
        }), 200

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500

    finally:
        cursor.close()
        conn.close()

@order_bp.route('/api/deleteorder', methods=['POST'])
def delete_order():
    """
    An API endpoint to delete orders from the database.

    This route expects a JSON payload which contains an order_id to be deleted.

    Returns:
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If order could not be deleted.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        order_to_delete = request.get_json(force = True)
        order_id = order_to_delete['order_id']

        cursor.execute(f'''
                        SELECT order_id FROM "Order" WHERE order_id = '{order_id}';
                        ''')
        existing_order = cursor.fetchall()

        if(existing_order != None): #Checks if the order exists in the database before executing SQL queries
            cursor.execute(f'''
                            DELETE FROM OrderMenu WHERE order_id = '{order_id}';
                            DELETE FROM stafforder WHERE order_id = '{order_id}';
                            DELETE FROM "Order" WHERE order_id = '{order_id}';
                            ''')
            conn.commit()
            return jsonify({
            'message': 'Order successfully deleted'
            }), 200
        else:
            return jsonify({
            'message': 'Order does not exist'
            }), 406 #Error code used as the order being requested to delete does not exist
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
    finally: #Closes connections
        cursor.close()
        conn.close()


@order_bp.route('/api/fetchorders', methods=['GET'])
def fetch_orders():
    """
    An API endpoint to fetch and return all current orders.

    Returns:
       str: The orders as JSON and a HTTP code.
   Raises:
        Exception: If all orders could not be fetched.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        filter_confirmed = request.args.get('confirmed', default=False)

        # Gets all confirmed orders for any customer
        if filter_confirmed:
            cursor.execute('''
                SELECT *
                FROM "Order"
                WHERE status = 'Confirmed'
                ORDER BY time_ordered asc;
            ''')

        # Gets all orders
        else:
            cursor.execute('''
                SELECT *
                FROM "Order"
                ORDER BY time_ordered asc;
            ''')

        order = cursor.fetchall()

        if (order != None):  # Check if there are orders available in the database
            orders = [{'order_id': item[0],
                       'customer_id': item[1],
                       'status': item[2],
                       'time_ordered': item[3],
                       'is_paid': item[4]} for item in order]  # Sorts the relevent database entries into dictionary items
            return jsonify(orders), 200
        else:
            return jsonify({
                'message': 'No orders made yet'
            }), 200

    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500

    finally:
        cursor.close()  # Closes the connections
        conn.close()


@order_bp.route('/api/getTableOrder', methods=['Get'])
def get_order_by_table():
    """
    An api endpoint to get each order_id and its corresponding table number.
        
    Returns:
        response: A response containing data in the format {table_number, order_id}.
    """
    try:
        #connect to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        #execute sql query
        cursor.execute("""
                       SELECT C.table_number, O.order_id
                       FROM Customer C
                       JOIN "Order" O ON C.customer_id = O.customer_id
                       GROUP BY C.table_number, O.order_id
                       ORDER BY C.table_number ASC
                       """) 
        orders = cursor.fetchall()
        
        #close connection
        cursor.close()
        conn.close()

        formatted_orders = [{"order_id": row[1], "table_number": row[0]} for row in orders]
        
        #return data
        return jsonify(formatted_orders)
       
    except Exception as e:  #database couldn't be reached
        return jsonify("Something went wrong."), 500

@order_bp.route('/api/changeorderstatus', methods=['POST'])
def change_order_status():
    """
    An API endpoint to change the status of an order.

    This route expects a JSON payload containing an order_id and status change.
    
    Returns:
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If order status could not be changed.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        order_to_change = request.get_json(force = True)
        order_id = order_to_change['order_id']
        status_change = order_to_change['status']

        cursor.execute(f'''SELECT * FROM "Order" WHERE order_id = '{order_id}';''')
        existing_order = cursor.fetchall()
        if (existing_order != None): #Checks if the order exists
            cursor.execute(f'''UPDATE "Order" SET status = '{status_change}' WHERE order_id = '{order_id}';''') #Updates order to have requested changes
            conn.commit()
            return jsonify({
            'message': 'Order status updated'
            }), 200
        else:
            return jsonify({
            'message': 'Order does not exist'
            }), 406 #Error code used as the order being requested to change does not exist
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
    finally:
        cursor.close() #Closes connections
        conn.close()

@order_bp.route('/api/fetch_customer_order', methods=['POST'])
def fetch_customer_order():
    """
    An API endpoint to fetch the order information associated to a customer.

    The customer_id in the request body is optional, but currently necessary for testing purposes.
    When login is implemented properly, the customer_id will be automatically fetched from a cookie.

    The status is also updated based on milestones e.g. if current_time - time_ordered > 5 mins then status is `Cooking`.

    Returns:
        response: The order information as JSON and a HTTP code.
    """
    data = request.get_json(force=True)
    # Sending customer_id via body is for testing purposes
    # When auth is implemented, customer_id is automatically fetched via a cookie
    if not data:
        customer_id = request.cookies.get('customer_id')
    else:
        customer_id = data['customer_id']
    # Query database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
                   SELECT *
                   FROM "Order"
                   WHERE customer_id = %s
                   """, (customer_id))
    orders = cursor.fetchall()
    cursor.close()
    conn.close()
    # Return as formatted JSON
    out = []
    for order in orders:
        # Compute time elapsed until order was placed
        time_ordered = order[3]
        current_time = datetime.now()
        time_elapsed = current_time - time_ordered
        time_elapsed_seconds = time_elapsed.total_seconds()
        # Milestones are small for testing purposes
        if (time_elapsed_seconds < 30):
            status = 'Preparing'
        elif (30 < time_elapsed_seconds < 60):
            status = 'Cooking'
        elif (time_elapsed_seconds > 60):
            status = 'Finishing Up'
        out.append({'menuitem_id': order[0],
                 'customer_id': order[1],
                 'status': status,
                 'time_ordered': order[3],
                 'is_paid': order[4]})
    return jsonify(out), 200

@order_bp.route('/api/fetch_table_waiter_order', methods=['GET'])
def fetch_table_staff_order():
    """
    An API endpoint to fetch the customer, waiter, and order information associated with a table number.
    
    For the customer, this route fetches their full name and table number.
    For the waiter, it fetches their full name and staff ID.
    For the order, it fetches the order_id, is_paid attribute, status, and time ordered.

    Returns:
        response: This information as JSON and an HTTP code.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    # Fetch order customer and waiter information
    cursor.execute("""
                   SELECT c.customer_id, c.first_name AS customer_first_name, c.last_name AS customer_last_name, 
                          c.table_number, o.status, o.time_ordered, o.order_id, o.is_paid, s.staff_id, 
                          s.first_name AS waiter_first_name, s.last_name AS waiter_last_name
                   FROM Customer c
                   JOIN "Order" o ON c.customer_id = o.customer_id
                   JOIN StaffOrder so ON o.order_id = so.order_id
                   JOIN Staff s ON so.staff_id = s.staff_id
                   WHERE c.table_number != -1
                   """)
    data = cursor.fetchall()
    # Convert fetched data to a list of dictionaries for processing
    data_dicts = [{'customer_full_name': row[1] + ' ' + row[2], 'table_number': row[3],
                  'status': row[4], 'time_ordered': row[5], 'order_id': row[6], 'is_paid': row[7],
                  'staff_id': row[8], 'waiter_full_name': f"{row[9]} {row[10]}"}
                  for row in data]
    
    return jsonify(data_dicts), 200


@order_bp.route('/api/orders/<int:order_id>', methods=['GET'])
def get_order_by_id(order_id: int):
    """
    Fetches all orders with an associated order id.

    Param:
        order_id (int): The order id to fetch the data for.

    Returns:
        response: The JSON data of the order and a HTTP status code.

    Raises:
        Exception: If such orders could not be fetched.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT order_id,
                    is_paid,
                    status,
                    time_ordered,
                    C.customer_id,
                    C.first_name,
                    C.last_name,
                    C.email,
                    C.table_number
            FROM "Order" AS O
            INNER JOIN customer C ON C.customer_id = O.customer_id
            WHERE order_id = %s
        """, (order_id,))

        order_data = cursor.fetchone()

        if order_data is None:
            return jsonify({
                'message': 'Not found',
                'data': None
            }), 404

        cursor.execute("""
            SELECT OM.menuitem_id, OM.quantity, name, description, type, price, image
            FROM ordermenu OM
            INNER JOIN menuitem MI ON OM.menuitem_id = MI.menuitem_id
            WHERE order_id = %s;
        """, (order_id,))

        order_menu_items_raw = cursor.fetchall()
        ordered_items = []
        bill_total = 0

        if order_menu_items_raw:
            for item in order_menu_items_raw:
                subtotal = item[1] * item[5]
                bill_total += subtotal
                ordered_items.append({
                    'menuitem_id': item[0],
                    'quantity': item[1],
                    'name': item[2],
                    'description': item[3],
                    'type': item[4],
                    'price': item[5],
                    'subtotal': subtotal,
                    'image': item[6]
                })

        return jsonify({
            'message': 'Success',
            'data': {
                'order': {
                    'id': order_data[0],
                    'is_paid': order_data[1],
                    'status': order_data[2],
                    'time_ordered': order_data[3],
                    'customer': {
                        'id': order_data[4],
                        'first_name': order_data[5],
                        'last_name': order_data[6],
                        'email': order_data[7],
                        'table_number': order_data[8]
                    },
                    'ordered_items': ordered_items,
                    'total': bill_total
                }
            }
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'something went wrong'}), 500

    finally:
        cursor.close()
        conn.close()


@order_bp.route('/api/orders/<int:order_id>/status')
def get_order_status(order_id: int):
    """
    Returns the status and estimated time of an order.

    Param:
        order_id (int): The order id to return the info for.

    Returns:
        response: The JSON data and a HTTP status code.

    Raises:
        Exception: If the order information could not be fetched.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT order_id, time_ordered, status, is_paid
            FROM "Order"
            WHERE order_id = %s
        """, (order_id,))

        data = cursor.fetchone()

        if data is None:
            return jsonify({'message': 'Order not found'}), 404

        estimated_wait = None
        if data[2] != 'Unconfirmed' or True:
            estimated_time = data[1] + timedelta(minutes=30)  # 30 minutes after order time
            if estimated_time >= datetime.now():
                estimated_wait = (estimated_time - datetime.now()).seconds // 60
            else:
                estimated_wait = 0

        return jsonify({
            'message': 'Success',
            'data': {
                'order': {
                    'id': data[0],
                    'ordered_at': data[1],
                    'status': data[2],
                    'is_paid': data[3],
                    'estimated_wait': estimated_wait
                }
            }
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'something went wrong'}), 500

    finally:
        conn.close()
        cursor.close()


@order_bp.route('/api/orders/customer')
def get_all_customer_orders():
    """
    An API endpoint to return the order history for the current user.

    Returns:
        response: The order information as JSON and a HTTP code.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        session = AuthSession()
        session.assert_customer()
        customer_id = session.get_user_id()

        cursor.execute("""
            SELECT O.order_id, O.is_paid, O.time_ordered, O.status, OM.quantity, MI.price, MI.menuitem_id
            FROM "Order" O
            INNER JOIN ordermenu OM ON O.order_id = OM.order_id
            INNER JOIN menuitem MI ON OM.menuitem_id = MI.menuitem_id 
            WHERE customer_id = %s
            ORDER BY time_ordered DESC;
        """, (customer_id,))

        data = cursor.fetchall()

        orders = {}

        for order in data:
            subtotal = order[4] * order[5]
            menu_item = {
                'quantity': order[4],
                'price': order[5],
                'subtotal': subtotal,
                'id': order[6]
            }

            if order[0] not in orders:
                orders[order[0]] = {
                    'id': order[0],
                    'is_paid': order[1],
                    'time_ordered': order[2],
                    'status': order[3],
                    'items': [menu_item],
                    'total': subtotal
                }
            else:
                orders[order[0]]['items'].append(menu_item)
                orders[order[0]]['total'] += subtotal

        return jsonify({
            'message': 'Success',
            'data': {
                'orders': list(dict.values(orders))
            }
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'something went wrong'}), 200

    finally:
        cursor.close()
        conn.close()
