from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)

def get_db_connection():
    conn = psycopg2.connect(dbname = 'restaurant',
                            user = 'postgres',
                            password = '`.L0P0:gaH72',
                            host = 'localhost')
    return conn

@app.route("/api/menuitems", methods = ['GET'])
def get_menuitems():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM MenuItem;')
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