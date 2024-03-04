"""
A Flask blueprint defining the API routes for interacting with the menu.

The blueprint defines the following endpoints:
- /api/menuitems (GET): Retreives a list of all menu items in JSON format.
- /api/update_item (PUT): Updates an existing items attribute with a new value.
- /api/add_item (POST): Adds an item to the database.
- /api/delete_item (POST): Deletes an item to the database.
"""
from flask import Blueprint, request, jsonify
from menu.connection import get_db_connection
from auth.authentication import validate_admin_token, validate_staff_token, secret_key

menu_bp = Blueprint('menu', __name__)

@menu_bp.route('/api/menuitems/<menuitem_id>', methods = ['GET'])
def get_menuitems(menuitem_id):
    """
    An API endpoint to retrieve all or one menu items from the database.
    
    Args:
        menuitem_id: the ID of a single item to retrieve from the database.

    Returns:
        A JSON object containing all fetched menu items.
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if type(menuitem_id) is int:
        cursor.execute(f"SELECT * FROM MenuItem WHERE menuitem_id = {menuitem_id}")
        menuitem = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        return jsonify(menuitem), 200
        
    else:   #if no ID is given all items are returned
        cursor.execute('SELECT * FROM MenuItem;')
        menuitem = cursor.fetchall()

        cursor.close()
        conn.close()

        menuitems = [{'menuitem_id': item[0],
                       'name': item[1],
                       'description': item[2],
                       'type': item[3],
                       'price': item[4],
                       'calories': item[5],
                       'image': item[6]} for item in menuitem]
        
        return jsonify(menuitems), 200


@menu_bp.route('/api/updateitem/<menuitem_id>', methods=['PUT'])
def update_item(menuitem_id):
    """
    An API endpoint to update an existing menu item in the database.

    This function expects a JSON payload and a header to identify the resource:
    localhost/api/updateitem/<menuitem_id>
    {
        'name': '<varchar(50)>',
        'description': '<text>',
        'type': '<varchar(20)>',
        'price': '<numeric(5,2)>',
        'calories': '<integer>',
        'image': '<varchar(140)>'
    }
    The request will only succeed if the user is authenticated as an admin or staff.

    Args:
        menuitem_id: The ID of the menu item to update.
    
    Returns: 
        A JSON statement indicating success.
    """

    # if not request.cookies.get('token'):
    #     return jsonify({'message' : 'Unauthorized access.'}), 401
    # elif not validate_admin_token(request.cookies.get('token'), secret_key) and not validate_staff_token(request.cookies.get('token'), secret_key):
    #     return jsonify({'message' : 'Unauthorized access.'}), 401

    try:
        data = request.get_json(force=True)

        name = data['name']
        description = data['description']
        price = data['price']
        type = data['type']
        calories = data['calories']
        image = data['image']

        conn = get_db_connection()
        cursor = conn.cursor()

        statement = f"""
                UPDATE MenuItem
                SET name='{name}',
                    description='{description}',
                    price='{price}',
                    type='{type}',
                    calories='{calories}',
                    image='{image}'
                WHERE menuitem_id={menuitem_id}
            """

        cursor.execute(statement)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': f'Item {menuitem_id} has been updated.'}), 200

    except Exception as e:
        print(e)
        return jsonify("Something went wrong"), 500


@menu_bp.route('/api/additem', methods=['POST'])
def add_item():
    """
    An API endpoint to add a menu item to the database.

    Returns:
        A message to inform the user if the item has been successfully added.
    """
    newItem = request.get_json(force = True)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(f"SELECT name FROM menuitem WHERE name = '{(newItem["name"])}';")
    menuitems = cursor.fetchall()
    if (menuitems != None):
        print("true")
        cursor.execute('INSERT INTO menuitem (name, description, type, price, calories,image) VALUES (%s, %s, %s, %s, %s, %s)', (newItem['name'], newItem['description'], newItem['type'], newItem['price'], newItem['calories'], newItem['image'] ))
        message = {
            "message" : "Menu item successfully added."
        } 
    else:
        message = {
        "message" : "Adding menu item unsuccessful."
        }
    cursor.close()
    conn.commit()
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


@menu_bp.route('/api/menu/types', methods=['GET'])
def get_all_types():
    """
    API endpoint to return all menu item types currently stored in the database.

    Returns:
        A success message.
    """

    try:
        # Querying the database
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT DISTINCT "type" AS test FROM menuitem;')
        data = cursor.fetchall()
        cursor.close()
        conn.close()

        # Processing the response
        types = set()
        for row in data:
            for item in row:
                types.add(item)

        # Return success message + data
        return jsonify({
            "message": "Success",
            "data": list(types)
        }), 200

    # Else return error response
    except Exception as e:
        print(e)
        return jsonify({
            "message": "Something went wrong",
            "data": None
        }), 500
