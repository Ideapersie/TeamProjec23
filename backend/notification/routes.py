"""
A Flask blueprint defining the API routes for notifying staff.

The blueprint defines the following endpoints:
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection

notification_bp = Blueprint('notification', __name__)