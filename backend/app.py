"""
A Flask web app defining API routes.

This module runs the server-side, API routes expect to be called by the frontend to perform a service.

The app defines the following endpoints:
- /api/menuitems (GET): Retreives a list of all menu items in JSON format.

To run:
    `flask run` 
"""
from flask import Flask, request, jsonify
import psycopg2
from resources import config

app = Flask(__name__)

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

@app.route("/api/menuitems", methods = ["GET"])
def get_menuitems():
    """
    API endpoint to retrieve all menu items.

    Returns:
        A flask response object containing the fetched JSON data.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM MenuItem;")
    menuitem = cursor.fetchall()
    cursor.close()
    conn.close()

    menuitems = [{"menuitem_id": item[0],
                   "name": item[1],
                   "description": item[2],
                   "type": item[3],
                   "price": item[4],
                   "calories": item[5]} for item in menuitem]
    
    return jsonify(menuitems)

app.run(debug=True)