"""
A Flask blueprint defining the API routes for notifying staff members.

The blueprint defines the following endpoints:
- /api/fetchunseennotifications (GET): Fetches all unseen orders for a given staff_id.
- /api/addnotification (POST): Adds a notification to the database.
- /api/deletenotification (POST): Deletes a notification from the database.
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection

notification_bp = Blueprint('notification', __name__)

@notification_bp.route('/api/fetchunseennotifications', methods=['GET'])
def fetch_unseen_notification():
    """
    An API endpoint to fetch unseen notification messages from the databases.
    """
    staff = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    staff_id = staff['staff_id']

    cursor.execute(f'''SELECT message, time_sent FROM "Notification" WHERE staff_id = '{staff_id}' AND seen = 'false' ORDER BY time_sent ASC;''')
    notification = cursor.fetchall() #fetches the data from the database
    if (notification != None): #checks there are existing notifications for the specified staff_id
        notifications = [{'message' : item[0], 
                          'time_sent' : item[1]} for item in notification] #sorts the messages and times into dictionary items
        cursor.close()
        conn.close()
        return jsonify(notifications)
    
    message = {
        'message' : 'No unseen notifications.'
        }
    cursor.close()
    conn.close()
    return jsonify(message)

@notification_bp.route('/api/addnotification', methods=['POST'])
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
                   VALUES ('{staff_id}', '{message}', 'false', '{time_sent}');''') #inserts the notification into the database
    
    message = {
        'message' : 'Notification added.'
    }
    cursor.close()
    conn.close()
    return jsonify(message)

@notification_bp.route('/api/deletenotification', methods=['POST'])
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
    if (existing_notif != None): #checks the notification exists in the database
        cursor.execute(f'''DELETE FROM "Notification" WHERE staff_id = '{staff_id}' AND message = '{message}';''') #deletes the notification from the database
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