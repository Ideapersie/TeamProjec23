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
    An API endpoint to fecth unseen notification messages from the databases.
    """
    staff = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()

    staff_id = staff['staff_id']

    cursor.execute(f'''SELECT message FROM "Notification" WHERE staff_id = '{staff_id}' AND seen = 'false'; ''')
    notification = cursor.fetchall()
    if (notification != None):
        notifications = [{'message' : item[0] for item in notification}]
        cursor.close()
        conn.close()
        return jsonify(notifications)
    
    message = {
        'message' : 'No unseen notifications.'
        }
    cursor.close()
    conn.close()
    return jsonify(message)