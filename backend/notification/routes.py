"""
A Flask blueprint defining the API routes for notifying staff members.
"""
from datetime import datetime

from flask import Blueprint, request, jsonify, Response
from menu.connection import get_db_connection
from auth.session import AuthSession, UnauthorisedAccessError
from auth.authentication import customer_waiters

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/fetchunseennotifications', methods=['GET'])
def fetch_unseen_notification():
    """
    An API endpoint to fetch unseen notification messages from the database.

    This route expects a JSON payload containing a staff_id. 

    Returns:
        response: A JSON response and a HTTP code.

    Raises:
        UnauthorisedAccessError: If the user accessing this route is not a staff.
        Exception: For unexpected behaviours.
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
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If notification could not be added.
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
        response: A JSON response and a HTTP code.

    Raises:
        Exception: If notification could not be deleted.
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
    """
    Mark an existing notification as seen.

    Param:
        notification_id (int): The id of the notification to be seen.

    Returns:
        response: a JSON message and a HTTP code.

    Raises:
        Exception: If there was an error in the server-side.
    """
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

@notification_bp.route('/api/orderReady/<int:order_id>')
def order_ready(order_id: int):
    """
    An API endpoint to notify a waiter a specific customers order is ready

    Returns:
        response: A JSON statement indicating if a notification has been sent successfully.
    """

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        session = AuthSession()
        session.assert_role("Kitchen")

        # Use order id to get customer id
        cursor.execute('''
            SELECT O.customer_id, C.table_number 
            FROM "Order" O
            INNER JOIN customer C ON O.customer_id = C.customer_id 
            WHERE order_id = %s
        ''', (order_id,))

        [cust_id, table_number] = cursor.fetchone()

        # Finding staff_id assigned to the customer id
        staff_id = None
        for staff, cust_list in customer_waiters.items():
            for id in cust_list:
                if id == cust_id:
                    staff_id = staff
        
        if staff_id is None:
            return jsonify({
                'message': 'No staff id found'
            }), 404
        
        # Write message
        message = f'Deliver order {order_id} to table {table_number}'

        # Cursor
        cursor.execute('''
            UPDATE "Order"
            SET status = %s
            WHERE order_id = %s;
        ''', ("Delivered", order_id))

        # Inserts the notification into the database
        cursor.execute('''
            INSERT INTO "Notification"(staff_id, message, seen, time_sent)
            VALUES (%s, %s, %s, %s)
            RETURNING notification_id
        ''', (staff_id, message, False, datetime.now()))

        conn.commit()
        
        return jsonify({
            'message': "Waiter notified!"
        }), 200

    # Unhandled exceptions
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500

    finally:
        # close connection
        cursor.close()
        conn.close()