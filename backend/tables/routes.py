from datetime import datetime

from flask import Blueprint, jsonify
from menu.connection import get_db_connection
from auth.session import AuthSession

tables_bp = Blueprint('tables', __name__)

@tables_bp.route('/api/tables/waiter/call')
def waiter_call():
    """
    Pushes a notification to the waiter the customer is trying to call.

    Returns:
        response: A JSON message and a HTTP code.

    Raises:
        Exception: If the notification could not be pushed to the waiter.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        session = AuthSession()  # Ensures valid auth session exists
        session.assert_customer()  # Ensures this route can only be used by customers

        table_number = session.get_table_number()
        waiter_id = session.get_waiter_id()

        cursor.execute("""
            INSERT INTO "Notification"(staff_id, message, seen, time_sent)
            VALUES (%(staff_id)s, %(message)s, %(seen)s, %(time_sent)s)
            RETURNING notification_id
        """, {
            'staff_id': waiter_id,
            'message': f'Table {table_number} is requesting help',
            'seen': False,
            'time_sent': datetime.now()
        })

        new_notification_id = cursor.fetchone()[0]  # The id of the new notification

        conn.commit()  # Save changes to database

        return jsonify({
            'message': f'Requested help for table {table_number}',
            'id': new_notification_id
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'message': 'Something went wrong'}), 500

    finally:
        cursor.close()
        conn.close()


