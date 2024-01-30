DROP TABLE IF EXISTS Customer CASCADE;
CREATE TABLE Customer (
    customer_id SERIAL PRIMARY KEY
);

DROP TABLE IF EXISTS Staff CASCADE;
CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS "Order" CASCADE; -- Order is a reserved keyword, "" required
CREATE TABLE "Order" (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(customer_id) NOT NULL,
    status VARCHAR(15) NOT NULL,
    time_ordered TIMESTAMP NOT NULL
);

DROP TABLE IF EXISTS MenuItem CASCADE;
CREATE TABLE MenuItem (
    menuitem_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- Not nullable as items must be filterable
    price DECIMAL(5, 2) NOT NULL,
    calories INTEGER
);

DROP TABLE IF EXISTS Allergen CASCADE;
CREATE TABLE Allergen (
    allergen_name VARCHAR(50) PRIMARY KEY
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

DROP TABLE IF EXISTS MenuAllergen CASCADE;
CREATE TABLE MenuAllergen (
    menuitem_id INTEGER REFERENCES MenuItem(menuitem_id) NOT NULL,
    allergen_name VARCHAR(50) REFERENCES Allergen(allergen_name) NOT NULL,
    PRIMARY KEY (menuitem_id, allergen_name)
);