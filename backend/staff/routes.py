"""
A Flask blueprint defining API routes for staff.
"""
from flask import Blueprint, jsonify, request
from menu.connection import get_db_connection

staff_bp = Blueprint('staff', __name__)


@staff_bp.route('/api/staff/all', methods=['GET'])
def get_all_staff():
    """
    Get all staff
    Returns:
        A list of all staff users
    """

    try:

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT staff_id, email, first_name, last_name, admin, role FROM staff;")

        all_staff = [{
                'id': staff_id,
                'email': email,
                'first_name': first_name,
                'last_name': last_name,
                'admin': admin,
                'role': role
            } for [staff_id, email, first_name, last_name, admin, role] in cursor.fetchall()]

        print("Fetched all staff:", all_staff)

        return jsonify({
            "staff_members": all_staff
        }), 200

    except Exception as e:
        print(e)
        return jsonify("Something went wrong"), 500


@staff_bp.route('/api/staff/update/<int:id>', methods=['POST'])
def update_staff(id: int):
    try:
        body = request.get_json(force=True)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE staff
            SET email = %(email)s,
                first_name = %(first_name)s,
                last_name = %(last_name)s,
                admin = %(is_admin)s,
                role = %(role)s
            WHERE staff_id = %(id)s;     
        """, {
            'id': id,
            'email': body['email'],
            'first_name': body['first_name'],
            'last_name': body['last_name'],
            'is_admin': body['is_admin'],
            'role': body['role']
        })

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "message": "Update successful"
        }), 200

    except Exception as e:
        print(e)
        return jsonify("Something went wrong"), 500
