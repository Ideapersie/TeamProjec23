"""
A Flask blueprint defining the API routes for interacting with the menu.
"""
from flask import Blueprint, request, jsonify
import psycopg2
from resources import config

menu_bp = Blueprint("menu", __name__)

@menu_bp.route("/api/menuitems", methods = ['GET'])
def get_menuitems():
    """
    API endpoint to retrieve all menu items.

    Returns:
        A flask response object containing the fetched JSON data.
    """
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

@menu_bp.route('/api/updateitem', methods=['POST'])
def update_item():
    """
    API endpoint to update the the details of an existing menu item in the database
    
    Returns: 
        A json response object with status message.
    """

    existingItem = request.get_json()   #item that is edited
    attributeToUpdate = request.get_json()  #inidivdual attribute to change
    newValue = request.get_json()   #the new value of the attribute
    
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f'SELECT * FROM menuitem WHERE name = {existingItem}')   #sql statement to find item
    menuItem = cursor.fetchone()
    
    if menuItem is None:
        return jsonify({"message" : "The item selected does not exist in this database."})
    
    cursor.execute(f'UPDATE menuitem SET {attributeToUpdate} = {newValue}'
                   f'WHERE menuitem_id = {menuItem[0]}')    #sql statment to update the item
    
    cursor.close()
    conn.close()
    
    return jsonify({"message" : "The item was successfully updated."})

@menu_bp.route('/api/additem', methods=['POST'])
def add_item():
    """
    API endpoint to add a menu item to the database.
    
    Returns:
        A message to inform the user if the item has been successfully added.
    """
    newItem = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT name FROM menuitem WHERE name = %s;' % (newItem["name"]))
    menuitems = cursor.fetchall()
    if (menuitems == None):
        cursor.execute('INSERT INTO menuitem (menuitem_id, name, description, type, price, calories) VALUES (DEFAULT, %s, %s, %s, %s, %s)'
                       % (newItem["name"], newItem['description'], newItem['type'], newItem['price'], newItem['calories']))
        message = {
            "message" : "Menu item successfully added."
        } 
    else:
        message = {
        "message" : "Adding menu item unsuccessful."
        }
    cursor.close()
    conn.close()
    return jsonify(message)

@menu_bp.route('/api/deleteitem', methods=['POST'])
def delete_item():
    """
    API endpoint to remove a menu item from the database.

    Returns:
        A message to inform the user if the item has been deleted.
    """
    item_to_delete = request.get_json()
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT name FROM menuitem WHERE name = %s;' % (item_to_delete["name"]))
    item_in_database = cursor.fetchall()
    if (item_in_database == None):
        message = {
            "message" : "Item does not exist in the menu."
        }
    else:
        cursor.execute('DELETE FROM menuitem WHERE name = %s;' % (item_to_delete["name"]))
        message = {
            "message" : "Item has been successfully deleted."
        }
    cursor.close()
    conn.close()
    return jsonify(message)