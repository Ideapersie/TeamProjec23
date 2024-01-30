INSERT INTO MenuItem(menuitem_id, name, description, type, price, calories) VALUES
(DEFAULT, 'Cheeseburger', 'Our classic two-patty burger with two slices of melted American cheese.', 'Burgers', 8.50, 800),
(DEFAULT, 'Vegan Burger', 'Our new 100% vegan burger with an improved patty recipe.', 'Burgers', 8.50, 600),
(DEFAULT, 'Saver Burger', 'Our small value hamburger with an even smaller price tag.', 'Burgers', 4.50, 500),
(DEFAULT, 'Cajun Fries', 'Our classic fries, generously sprinkled with cajun seasonings.', 'Sides', 3.00, 400),
(DEFAULT, 'Regular Fries', '100% British potatoes, served with a sprikle of sea salt.', 'Sides', 3.00, 350),
(DEFAULT, 'Sweet Potato Fries', 'Crispy and salty-sweet potatoes, served with a sprinkle of sea salt.', 'Sides', 3.00, 400),
(DEFAULT, 'Water', 'The voices keep getting louder :(', 'Drinks', 2.50, 50),
(DEFAULT, 'Coke Original', 'Coca Cola''s Original recipe.', 'Drinks', 2.50, 50),
(DEFAULT, 'Fanta Orange', 'Fanta''s Original Recipe.', 'Drinks', 2.50, 50);

INSERT INTO Allergen(allergen_name) VALUES
('Cheese'),
('Eggs');

INSERT INTO MenuAllergen(menuitem_id, allergen_name) VALUES
(1, 'Cheese'),
(1, 'Eggs'),
(3, 'Cheese');