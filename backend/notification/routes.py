"""
A Flask blueprint defining the API routes for notifying staff members.

The blueprint defines the following endpoints:
- /api/fetchunseennotifications (GET): Fetches all unseen orders for a given staff_id.
- /api/addnotification (POST): Adds a notification to the database.
- /api/deletenotification (POST): Deletes a notification from the database.
"""
from datetime import datetime

from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection
from auth.session import AuthSession

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
        staff_id = session.get_user_id()

        # Fetches the data from the database
        cursor.execute('''
            SELECT message, time_sent, seen
            FROM "Notification"
            WHERE staff_id = %s AND seen = %s
            ORDER BY time_sent ASC;
        ''', (staff_id, False))

        data = cursor.fetchall() or []

        # Sorts the messages and times into dictionary items
        notifications = [{
            'message': item[0],
            'time_sent': item[1],
            'is_seen': item[2]
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
        if (existing_notif != None): #checks the notification exists in the database
            cursor.execute(f'''DELETE FROM "Notification" WHERE notification_id = '{notification_id}';''') #Deletes the notification from the database
            message = {
                'message' : 'Notification has been removed'
            }
        else:
            message = {
                'message' : 'Notification does not exist in database'
            }
        cursor.commit() #Commit changes into the database
        return jsonify(message), 200
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
    finally: #Closes connections
        cursor.close()
        conn.close()