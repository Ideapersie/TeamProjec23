"""
A Flask blueprint defining the API routes for notifying staff members.

The blueprint defines the following endpoints:
- /api/fetchunseennotifications (GET): Fetches all unseen orders for a given staff_id.
- /api/addnotification (POST): Adds a notification to the database.
- /api/deletenotification (POST): Deletes a notification from the database.
"""
from datetime import datetime

from flask import Blueprint, request, jsonify, Response
from menu.connection import get_db_connection
from auth.session import AuthSession, UnauthorisedAccessError
from test.test_urllib2 import add_ordered_mock_handlers
from auth.authentication import customer_waiters

notification_bp = Blueprint('notification', __name__)


@notification_bp.route('/api/fetchunseennotifications', methods=['GET'])
def fetch_unseen_notification():
    """
    An API endpoint to fetch unseen notification messages from the database.

    This route expects a JSON payload containing a staff_id. 

    Returns:
        str: A JSON response and a HTTP code.
    """

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        session = AuthSession()  # Throws error if no valid session

        try:
            session.assert_staff()  # Throws error if not staff user
        except UnauthorisedAccessError as e:
            print(e)
            return jsonify({
                'message': 'Access denied: only accessible by staff members'
            }), 403

        staff_id = session.get_user_id()

        # Fetches the data from the database
        cursor.execute('''
            SELECT message, time_sent, seen, notification_id
            FROM "Notification"
            WHERE staff_id = %s AND seen = %s
            ORDER BY time_sent ASC;
        ''', (staff_id, False))

        data = cursor.fetchall() or []

        # Sorts the messages and times into dictionary items
        notifications = [{
            'message': item[0],
            'time_sent': item[1],
            'is_seen': item[2],
            'id': item[3]
        } for item in data]

        # Success 200 response
        return jsonify({
            'message': 'Successfully fetched unseen notifications',
            'data': {
                'notifications': notifications
            }
        }), 200

    # Any other unhandled exceptions...
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500

    finally:
        cursor.close()  # Closes connections
        conn.close()

@notification_bp.route('/api/addnotification', methods=['POST'])
def add_notification():
    """
    An API endpoint to add a notification to the database.

    This route expects a JSON payload containing a staff_id and message.

    Returns:
        str: A JSON response and a HTTP code.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        data = request.get_json(force=True)

        staff_id = data['staff_id']
        message = data['message']
        time_sent = datetime.now()

        # Inserts the notification into the database
        cursor.execute('''
            INSERT INTO "Notification"(staff_id, message, seen, time_sent)
            VALUES (%s, %s, %s, %s)
            RETURNING notification_id
        ''', (staff_id, message, False, time_sent))

        notification_id = cursor.fetchone()[0]

        conn.commit()  # Commit database changes

        return jsonify({
            'message': 'Notification added.',
            'notification_id': notification_id
        }), 200

    # Any unhandled exceptions
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500

    finally:
        # Ensures connection is always closed, even if exception occurs
        cursor.close()
        conn.close()

@notification_bp.route('/api/deletenotification', methods=['POST'])
def delete_notification():
    """
    An API endpoint to delete a notification.

    This route expects a JSON payload containing a notification_id.
    
    Returns:
        str: A JSON response and a HTTP code.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        notification = request.get_json(force = True)
        notification_id = notification['notification_id']
        
        cursor.execute(f'''SELECT * FROM "Notification" WHERE notification_id = '{notification_id}';''')
        existing_notif = cursor.fetchall()
        if (existing_notif != None): #Checks the notification exists in the database
            cursor.execute(f'''DELETE FROM "Notification" WHERE notification_id = '{notification_id}';''') #Deletes the notification from the database
            cursor.commit() #Commit changes into the database
            return jsonify({
            'message': 'Notification deleted'
            }), 200
        else:
            return jsonify({
            'message': 'Notification does not exist'
            }), 406 #Error code used as the notification requested to delete does not exist
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
    finally: #Closes connections
        cursor.close()
        conn.close()

@notification_bp.route('/api/notifications/mark/<int:notification_id>')
def mark_notification_as_seen(notification_id):
    """Mark an existing notification as seen"""

    conn = get_db_connection()
    cursor = conn.cursor()

    try:

        # Mark notification as seen in the database
        cursor.execute("""
            UPDATE "Notification"
            SET seen = true
            WHERE notification_id = %s
            RETURNING notification_id;
        """, (notification_id,))

        if cursor.fetchone() is None:  # I.e. if notification id does not exist
            return Response(status=404)

        conn.commit()  # Save database changes

        return Response(status=200)  # Success response

    except Exception as e:
        print(e)
        return Response(status=500)  # Server-side error response

    finally:
        cursor.close()
        conn.close()

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
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        #use order id to get customer id
        cursor.execute(f'SELECT customer_id FROM "Order" WHERE order_id = {order_id}')
        cust_id = cursor.fetchall()
        
        #close connection
        cursor.close()
        conn.close()
        
        #finding staff_id assigned to the customer id
        staff_id = None
        for staff, cust_list in customer_waiters.items():
            for id in cust_list:
                if id == cust_id:
                    staff_id = staff
        
        if staff_id is None:
            return jsonify("No staff id was found"), 500
        
        #write message
        message = f'Order {order_id} is ready to be delivered.'
        
        #compile notification data
        notification = {
            'staff_id': staff_id,
            'message': message,
            'time_sent': datetime.datetime.now()
            }
        
        add_notification(notification)
        
        return jsonify("Notification has been sent."), 200
    
    except Exception as e:  #database could not be reached
        return jsonify("Something went wrong."), 500