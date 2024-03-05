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


@menu_bp.route('/api/menu', methods=['GET'])
def get_all_menu_items():
    """
    An endpoint that returns all menu items in the database, including their ingredients.

    Returns:
        A JSON object containing a list of menu items (with their ingredients)
    """
    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        type_filter = request.args.get("type")

        # Get all ingredients
        sql_ingredients = """
            SELECT menuitem_id, ingredient_name
            FROM menuingredient;
        """
        cursor.execute(sql_ingredients)
        data_ingredients = cursor.fetchall()

        # Parse data into ingredients list
        ingredients = {}
        if data_ingredients:
            for item in data_ingredients:
                [menuitem_id, ingredient_name] = item

                new_item = {
                    'name': ingredient_name,
                    'allergen': None
                }

                if menuitem_id in ingredients:
                    ingredients[menuitem_id].append(new_item)
                else:
                    ingredients[menuitem_id] = [new_item]

        print("Ingredients:", ingredients)

        # Get all menu items from database
        sql_items = f"""
            SELECT menuitem.menuitem_id, name, description, type, price, calories, image
            FROM MenuItem
            {f"WHERE type = '{type_filter}'" if type_filter is not None else ""}
        """

        cursor.execute(sql_items)
        data_items = cursor.fetchall()

        # Parse data into list of menu items
        menu_items = []
        if data_items:
            for item in data_items:
                [menuitem_id, name, description, type, price, calories, image] = item
                menu_items.append({
                    "menuitem_id": menuitem_id,
                    "name": name,
                    "description": description,
                    "type": type,
                    "price": price,
                    "calories": calories,
                    "image": image,
                    "ingredients": ingredients.get(menuitem_id) or []
                })

        print("Items:", menu_items)

        # Close database connection
        cursor.close()
        conn.close()

        # Success response
        return jsonify(menu_items), 200

    # Handle any exceptions thrown
    except Exception as e:

        # Print and return error message
        print(e)
        return jsonify({
            "message": "Something went wrong"
        }), 500



@menu_bp.route('/api/menu/item/<int:item_id>', methods=['GET'])
def get_menu_item_by_id(item_id: int):
    """
    An API endpoint to retrieve one menu item from the database.

    Args:
        item_id: the ID of a single item to retrieve from the database.

    Returns:
        A Response containing the item's data.
    """

    try:
        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # TODO: See if possible to combine all sql statements into one query

        # Prepare sql query
        sql_main_item = f"""
            SELECT menuitem_id, name, description, type, price, calories, image
            FROM MenuItem
            WHERE menuitem_id = {item_id};
        """

        # Execute query + pull data into python
        cursor.execute(sql_main_item)
        data_main_item = cursor.fetchone()

        related_items = []
        ingredients = []

        # If item found...
        if data_main_item:
            item_type = data_main_item[3]

            # Get related items
            sql_related = f"""
                SELECT menuitem_id, name, description, type, price, calories, image
                FROM MenuItem
                WHERE (menuitem_id <> {item_id}) AND (MenuItem.type = '{item_type}');
            """
            cursor.execute(sql_related)
            data_related = cursor.fetchall()

            if data_related:
                for row in data_related:
                    [menuitem_id, name, description, type, price, calories, image] = row

                    related_items.append({
                        'menuitem_id': menuitem_id,
                        'name': name,
                        'description': description,
                        'type': type,
                        'price': price,
                        'calories': calories,
                        'image': image
                    })

            # Get ingredients
            sql_ingredients = f"""
                SELECT menuitem_id, ingredient_name
                FROM menuingredient
                WHERE menuitem_id = {item_id};
            """
            cursor.execute(sql_ingredients)
            data_ingredients = cursor.fetchall()

            if data_ingredients:
                for row in data_ingredients:
                    ingredient_name = row[1]
                    new_item = {
                        'name': ingredient_name,
                        'allergen': None
                    }
                    ingredients.append(new_item)

        # Close connection
        cursor.close()
        conn.close()

        if data_main_item:
            [menuitem_id, name, description, type, price, calories, image] = data_main_item

            # Return success response + data
            return jsonify({
                "message": f"Successfully retrieved item {item_id}",
                "item": {
                    "menuitem_id": int(menuitem_id),
                    "name": name,
                    "description": description,
                    "type": type,
                    "price": float(price),
                    "calories": int(calories),
                    "image": image,
                    "related": related_items,
                    "ingredients": ingredients
                }
            }), 200

        else:
            # Return failed response
            return jsonify({
                "message": f"Item {item_id} not found",
                "item": None
            }), 404

    # Handle any exceptions
    except Exception as e:
        print(e)
        return jsonify("Something went wrong"), 500


@menu_bp.route('/api/updateitem/<menuitem_id>', methods=['POST'])
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


@menu_bp.route('/api/menu/delete/item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id: int):
    """
    API endpoint to remove a menu item from the database.

    Returns:
        A message to inform the user if the item has been deleted.
    """

    try:
        # TODO: Add auth check. Only admin roles should be able to delete items

        # Connect to the database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Delete related menu ingredients
        cursor.execute(f'DELETE FROM menuingredient WHERE menuitem_id = {item_id};')

        # Delete item from the database
        cursor.execute(f'DELETE FROM menuitem WHERE menuitem_id = {item_id};')

        # Close connection
        cursor.close()
        conn.commit()
        conn.close()

        # Success response
        return jsonify({
            "message": "Menu item successfully deleted."
        }), 200

    # Any unhandled exceptions...
    except Exception as e:

        # Print and return error message
        print(e)
        return jsonify({
            "message": "Something went wrong"
        }), 500


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
            "types": list(types)
        }), 200

    # Else return error response
    except Exception as e:
        print(e)
        return jsonify({
            "message": "Something went wrong",
            "data": None
        }), 500
