"""
A Flask web app defining API routes.

This module runs the server-side, API routes expect to be called by the frontend to perform a service.

The app defines the following endpoints:
- /api/menuitems (GET): Retreives a list of all menu items in JSON format.
- /api/update_item : Updates an existing items attribute with a new value.

To run:
    `flask run` 
"""
from flask import Flask, jsonify, request
import psycopg2
from resources import config
from menu.routes import menu_bp
from _overlapped import NULL

app = Flask(__name__)
app.register_blueprint(menu_bp)

def get_db_connection():
    """
    Establishes a connection to Postgres.
    
    Returns:
        A psycopg2 connection object.
    """
    conn = psycopg2.connect(dbname = config.DATABASE_NAME,
                            user = config.DATABASE_USER,
                            password = config.DATABASE_PASSWORD,
                            host = config.DATABASE_HOST)
    return conn

app.run(debug=True)