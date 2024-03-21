"""
A Flask blueprint defining the API routes for notifying staff.

The blueprint defines the following endpoints:
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection

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

@notification_bp.route('/api/deletenotification')
def delete_notification():
    """
    An API endpoint to delete a notification.
    """
    notification = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    staff_id = notification['staff_id']
    message = notification['message']

    cursor.execute(f'''SELECT * FROM "Notification" WHERE staff_id = '{staff_id}' AND message = '{message}';''')
    existing_notif = cursor.fetchall()

    if (existing_notif != None):
        cursor.execute(f'''DELETE FROM "Notification" WHERE staff_id = '{staff_id}' AND message = '{message}';''')
        message = {
        'message' : 'Notification has been removed'
        }
    else:
        message = {
            'message' : 'Notification does not exist in database'
        }
    cursor.close()
    conn.close()
    return jsonify(message)