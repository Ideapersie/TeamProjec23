DROP TABLE IF EXISTS Customer CASCADE;
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    table_number INTEGER NOT NULL
);

DROP TABLE IF EXISTS Staff CASCADE;
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    email VARCHAR(320) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS "Order" CASCADE; -- 'Order' is a reserved keyword, "" required
CREATE TABLE "Order" (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(customer_id) NOT NULL,
    status VARCHAR(15) NOT NULL,
    time_ordered TIMESTAMP NOT NULL,
    is_paid BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS MenuItem CASCADE;
CREATE TABLE MenuItem (
    menuitem_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- Not nullable as items must be filterable
    price DECIMAL(5, 2) NOT NULL,
    calories INTEGER,
    spice INTEGER CHECK(spice<=3) CHECK(0<=spice) NOT NULL,
    image VARCHAR(140) NOT NULL
);

DROP TABLE IF EXISTS Allergen CASCADE;
CREATE TABLE Allergen (
    allergen_name VARCHAR(50) PRIMARY KEY
);

DROP TABLE IF EXISTS PaymentInfo CASCADE;
CREATE TABLE PaymentInfo (
    paymentinfo_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(customer_id) NOT NULL,
    card_number VARCHAR(19) NOT NULL,
    holder_name VARCHAR(100) NOT NULL,
    expiration_date DATE NOT NULL
);

/* Junction Tables */

DROP TABLE IF EXISTS OrderMenu CASCADE;
CREATE TABLE OrderMenu (
    order_id INTEGER REFERENCES "Order"(order_id) NOT NULL,
    menuitem_id INTEGER REFERENCES MenuItem(menuitem_id) NOT NULL,
    PRIMARY KEY (order_id, menuitem_id)
);

DROP TABLE IF EXISTS StaffOrder CASCADE;
CREATE TABLE StaffOrder (
    staff_id INTEGER REFERENCES Staff(staff_id) NOT NULL,
    order_id INTEGER REFERENCES "Order"(order_id) NOT NULL,
    PRIMARY KEY (staff_id, order_id)
);

DROP TABLE IF EXISTS Ingredient CASCADE;
CREATE TABLE Ingredient (
    ingredient_name VARCHAR(50) NOT NULL,
    allergen_name VARCHAR(50),
    PRIMARY KEY (ingredient_name)
);

DROP TABLE IF EXISTS MenuIngredient CASCADE;
CREATE TABLE MenuIngredient (
    menuitem_id INTEGER REFERENCES MenuItem(menuitem_id) NOT NULL,
    ingredient_name VARCHAR(50) REFERENCES Ingredient(ingredient_name) NOT NULL,
    PRIMARY KEY (menuitem_id, ingredient_name)
);