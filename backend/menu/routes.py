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
from auth.authentication import validate_admin_token, validate_staff_token, secret_key, protect_customer

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

        type_filter = request.args.get("type")  # e.g. Burger
        allergen_filter = (request.args.get("allergies") or "").split(",")  # e.g. Eggs, Cheese, Gluten

        # Get all ingredients
        sql_ingredients = """
            SELECT menuitem_id, MenuIngredient.ingredient_name, Ingredient.allergen_name
            FROM MenuIngredient
            INNER JOIN Ingredient on MenuIngredient.ingredient_name = Ingredient.ingredient_name;
        """
        cursor.execute(sql_ingredients)
        data_ingredients = cursor.fetchall()

        # Parse data into ingredients list
        all_ingredients = {}
        if data_ingredients:
            for item in data_ingredients:
                [menuitem_id, ingredient_name, allergen_name] = item

                new_item = {
                    'name': ingredient_name,
                    'allergen': allergen_name
                }

                if menuitem_id in all_ingredients:
                    all_ingredients[menuitem_id].append(new_item)
                else:
                    all_ingredients[menuitem_id] = [new_item]

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

                ingredients = all_ingredients.get(menuitem_id) or []

                # Check each ingredient for filtered allergens
                has_filtered_allergen = False
                for ing in ingredients:
                    if ing['allergen'] in allergen_filter:
                        has_filtered_allergen = True
                        break

                # If found, skip to next menu item
                if has_filtered_allergen:
                    continue

                menu_items.append({
                    "menuitem_id": menuitem_id,
                    "name": name,
                    "description": description,
                    "type": type,
                    "price": price,
                    "calories": calories,
                    "image": image,
                    "ingredients": ingredients
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

        # Execute query + pull data into python
        cursor.execute("""
            SELECT menuitem_id, name, description, type, price, calories, image, spice
            FROM MenuItem
            WHERE menuitem_id = %s;
        """, (item_id,))
        data_main_item = cursor.fetchone()

        related_items = []
        ingredients = []

        # If item found...
        if data_main_item:
            item_type = data_main_item[3]

            # Get related items
            cursor.execute("""
                SELECT menuitem_id, name, description, type, price, calories, image, spice
                FROM MenuItem
                WHERE (menuitem_id <> %s) AND (MenuItem.type = %s);
            """, (item_id, item_type))
            data_related = cursor.fetchall()

            if data_related:
                for row in data_related:
                    [menuitem_id, name, description, type, price, calories, image, spice] = row

                    related_items.append({
                        'menuitem_id': menuitem_id,
                        'name': name,
                        'description': description,
                        'type': type,
                        'price': price,
                        'calories': calories,
                        'image': image,
                        'spice': int(spice)
                    })

            # Get ingredients
            cursor.execute("""
                SELECT menuitem_id, MenuIngredient.ingredient_name, Ingredient.allergen_name
                FROM MenuIngredient
                INNER JOIN Ingredient on MenuIngredient.ingredient_name = Ingredient.ingredient_name
                WHERE menuitem_id = %s;
            """, (item_id,))
            data_ingredients = cursor.fetchall()

            if data_ingredients:
                for row in data_ingredients:
                    ingredient_name = row[1]
                    allergen_name = row[2]
                    new_item = {
                        'name': ingredient_name,
                        'allergen': allergen_name
                    }
                    ingredients.append(new_item)

        # Close connection
        cursor.close()
        conn.close()

        if data_main_item:
            [menuitem_id, name, description, type, price, calories, image, spice] = data_main_item

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
                    "spice": int(spice),
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
        ingredients = data['ingredients']
        spice = data['spice']

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE MenuItem
            SET name = %s,
                description = %s,
                price = %s,
                spice = %s,
                type = %s,
                calories = %s,
                image = %s
            WHERE menuitem_id = %s
        """, (name, description, price, spice, type, calories, image, menuitem_id))

        # Delete previous links
        cursor.execute("""
            DELETE FROM MenuIngredient
            WHERE menuitem_id=%s
        """, (menuitem_id,))

        # Add each ingredient one by one
        for ingredient in ingredients:
            cursor.execute("""
                INSERT INTO Ingredient(ingredient_name, allergen_name)
                VALUES (%(name)s, %(allergen)s)
                ON CONFLICT (ingredient_name)
                DO UPDATE
                SET ingredient_name = %(name)s,
                    allergen_name = %(allergen)s;
                    
                INSERT INTO MenuIngredient(menuitem_id, ingredient_name)
                VALUES (%(id)s, %(name)s)
            """, {
                'name': ingredient['name'],
                'allergen': ingredient['allergen'],
                'id': menuitem_id
            })

        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({'message': f'Item {menuitem_id} has been updated.'}), 200

    except Exception as e:
        print(e)
        return jsonify("Something went wrong"), 500


@menu_bp.route('/api/menu/item/add', methods=['POST'])
def add_item():
    """
    An API endpoint to add a menu item to the database.

    Returns:
        A message to inform the user if the item has been successfully added.
    """

    try:
        new_item = request.get_json(force=True)

        print("Add item:", new_item)

        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch items with same name
        cursor.execute("SELECT name FROM menuitem WHERE name = %s;", (new_item['name'],))
        menu_items = cursor.fetchone()

        # If item already exists...
        if menu_items is not None:

            print("Item already exists")

            # Close connections
            cursor.close()
            conn.close()

            # Return error response
            return jsonify({
                "message": "An item with this name already exists",
                "success": False
            }), 400

        # Else, if item does not exist...
        else:

            print("Create new item")

            # Create new item
            cursor.execute("""
                    INSERT INTO menuitem (name, description, type, price, calories, image, spice)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                new_item['name'],
                new_item['description'],
                new_item['type'],
                float(new_item['price']),
                int(new_item['calories']),
                new_item['image'],
                int(new_item.get('spice', 0))
            ))

            # Save database changes.
            conn.commit()

            # Close connections
            cursor.close()
            conn.close()

            # Return success response
            return jsonify({
                "message": "Menu item successfully added.",
                "success": True
            }), 200

    except Exception as e:
        print(e)
        return jsonify({
            "message": "Something went wrong",
            "success": False
        }), 500


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
