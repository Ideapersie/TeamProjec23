"""
A Flask blueprint defining the API routes for notifying staff.

The blueprint defines the following endpoints:
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection
from test.test_urllib2 import add_ordered_mock_handlers
from auth.authentication import customer_waiters

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/fetchunseennotifications')
def fetch_unseen_notification():
    """
    An API endpoint to fetch unseen notification messages from the databases.
    """
    staff = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    staff_id = staff['staff_id']

    cursor.execute(f'''SELECT message, time_sent FROM "Notification" WHERE staff_id = '{staff_id}' AND seen = 'false' ORDER BY time_sent ASC;''')
    notification = cursor.fetchall()
    if (notification != None):
        notifications = [{'message' : item[0], 
                          'time_sent' : item[1]} for item in notification]
        cursor.close()
        conn.close()
        return jsonify(notifications)
    
    message = {
        'message' : 'No unseen notifications.'
        }
    cursor.close()
    conn.close()
    return jsonify(message)

@notification_bp.route('/api/addnotification')
def add_notification():
    """
    An API endpoint to add a notification to the database.
    """
    notification = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    staff_id = notification['staff_id']
    message = notification['message']
    time_sent = notification['time_sent']

    cursor.execute(f'''INSERT INTO "Notification"(staff_id, message, seen, time_sent)
                   VALUES ('{staff_id}', '{message}', 'false', '{time_sent}');''')
    
    message = {
        'message' : 'Notification added.'
    }
    cursor.close()
    conn.close()
    return jsonify(message)

@notification_bp.route('/api/orderReady')
def order_ready():
    """
    An API endpoint to notify a waiter a specific customers order is ready

    Returns:
        A JSON statement indicating if a notification has been sent successfully.
    """
    try:
        order_id = request.json(force = True)
        
        #use order id to get customer id
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(f'SELECT customer_id FROM "Order" WHERE order_id = {order_id}')
        cust_id = cursor.fetchall()
        
        #close connection
        cursor.close()
        conn.close()
        
        #finding staff_id to send the notification to
        for staff, cust_list in customer_waiters.items():
            for id in cust_list:
                if id == cust_id:
                    staff_id = id
        
        message = f'Order {order_id} is ready to be delivered'
    
    except Exception as e:  #database could not be reached
        return jsonify("Something went wrong."), 500