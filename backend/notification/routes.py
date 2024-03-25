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

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/fetchunseennotifications', methods=['GET'])
def fetch_unseen_notification():
    """
    An API endpoint to fetch unseen notification messages from the database.
    This route expects a JSON payload containing a staff_id. 

    Returns:
        str: A JSON response and a HTTP code.
    """
    staff = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        staff_id = staff['staff_id']

        cursor.execute(f'''SELECT message, time_sent FROM "Notification" WHERE staff_id = '{staff_id}' AND seen = 'false' ORDER BY time_sent ASC;''')
        notification = cursor.fetchall() #Fetches the data from the database
        if (notification != None): #Checks there are existing notifications for the specified staff_id
            notifications = [{'message' : item[0], 
                            'time_sent' : item[1]} for item in notification] #Sorts the messages and times into dictionary items
            cursor.close()
            conn.close()
            return jsonify(notifications), 200
        else:
            return jsonify({
                'message': 'No unseen notifications'
            }), 200
    except Exception as e:
        print(e)
        return jsonify({
            'message': 'Something went wrong'
        }), 500
    finally:
        cursor.close() #Closes connections
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

    
    Returns:
        str: A JSON response and a HTTP code.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        notification = request.get_json(force = True)
        staff_id = notification['staff_id']
        message = notification['message']

        cursor.execute(f'''SELECT * FROM "Notification" WHERE staff_id = '{staff_id}' AND message = '{message}';''')
        existing_notif = cursor.fetchall()
        if (existing_notif != None): #checks the notification exists in the database
            cursor.execute(f'''DELETE FROM "Notification" WHERE staff_id = '{staff_id}' AND message = '{message}';''') #Deletes the notification from the database
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