# Team Project Changelog

This is the changelog for our team project. Here, you can find a summary of our latest additions, improvements and bug fixes we've made to the Restaurant Management System.

If you have any feedback or suggestions, please feel free to contact us.

# [v0] - 2024-02-22

## Overview

### Key features

- **View Menu**: Customers can now browse through dishes, view images and each respective description, including calories and price.
- **Frontend and Backend integration**: Frontend can now communicate with the Backend database, allowing for real time updates to the Menu web page.
- **Menu management**: Admins can now edit the menu page, including deletion and addition.

## Frontend

### Added

- Web app setup
- Switch mock data for live menu items from database

- Side menu
    - Make side menu to be dynamic
    - Navigation links
- Menu pages
    - Links between menu page and category pages
    - View menu
        - View all menu items in a single page
        - View menu item name, description, price, type, calories and image
    - Categories
        - Burgers
        - Sides
        - Drinks
        - Desserts
    - Back button

- Admin pages
    - Links between view and add pages
    - Edit menu items
        - Menu filters
        - Delete menu items
            - Item is first staged for deletion, then the user must confirm
              that they want to delete the item.
    - Add new item
        - Form for the admin to enter new food item data
        - Send form data to API endpoint to be received by the database

- Order page
- 404 page
- Component to display the current user

- Styling
    - CSS global styles
    - CSS tailwind

## Backend

### Added

- ER & Relational Model design
- SQL query to populate schema with test data
- Script to initialise and populate a Postgres instance

- Schema
    - Create schema query
    - Update schema so users can have accounts

- Api routes
    - Route to fetch menu items
    - GET route for menu items
    - Route to add menu items
        - Add new food items to the menu
    - Login POST route
        - Checks whether an email and password combination are valid
    - Secure login/signup logic and routes
        - Sign up logic for customers
        - Login session logic
    - Route to update menu items
    - Route to remove menu items
        - Remove food items from the menu
        - Data can be received and removed from the database
    - Error handling

- Dynamic data from database for view menu
- Initialise system with admin user
    - Include admin roles for staff on application launch
- Images to MenuItem table
    - Image links to populateSchema.sql

