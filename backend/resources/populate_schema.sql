INSERT INTO MenuItem(menuitem_id, name, description, type, price, calories, spice, image) VALUES
(DEFAULT, 'Cheeseburger', 'Our classic two-patty burger with two slices of melted American cheese.', 'Burgers', 8.50, 800, 0, 'https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg'),
(DEFAULT, 'Vegan Burger', 'Our new 100% vegan burger with an improved patty recipe.', 'Burgers', 8.50, 600, 0,'https://i.postimg.cc/kMzTY9NZ/Beyond-Famous-Star-Hero5-B55-D-4c6ee754766f423e95eaf57cd87f30f8.jpg'),
(DEFAULT, 'Saver Burger', 'Our small value hamburger with an even smaller price tag.', 'Burgers', 4.50, 500, 0, 'https://i.postimg.cc/T15v894X/Hamburger-PNG-Image.png'),
(DEFAULT, 'Cajun Fries', 'Our classic fries, generously sprinkled with cajun seasonings.', 'Sides', 3.00, 400, 2, 'https://i.postimg.cc/JnhZJVN1/intro-1681926392.jpg'),
(DEFAULT, 'Regular Fries', '100% British potatoes, served with a sprikle of sea salt.', 'Sides', 3.00, 350, 0, 'https://i.postimg.cc/VkcG3gQj/french-fries-with-ai-generated-free-png.webp'),
(DEFAULT, 'Sweet Potato Fries', 'Crispy and salty-sweet potatoes, served with a sprinkle of sea salt.', 'Sides', 3.00, 400, 0, 'https://i.postimg.cc/YSQptbhM/83f45e25-16f1-473b-b503-40608443e4f9.avif'),
(DEFAULT, 'Fanta Orange', 'Fanta''s original Recipe.', 'Drinks', 2.50, 50, 0, 'https://i.postimg.cc/3r4tNV3X/580b57fbd9996e24bc43c10f.png'),
(DEFAULT, 'Water', 'Still natural mineral water.', 'Drinks', 2.50, 50, 0, 'https://i.postimg.cc/509rJ3jR/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIy-LTA1-L3-B4-ODAx-MTE5-LWlt-YWdl-LWt3dnhme-HQ3-Lmpw-Z.png'),
(DEFAULT, 'Coke Original', 'Coca Cola''s original recipe.', 'Drinks', 2.50, 50, 0, 'https://i.postimg.cc/sXp5ndVF/CocaCola.jpg');

INSERT INTO Allergen(allergen_name) VALUES
('Cheese'),
('Eggs');

INSERT INTO MenuAllergen(menuitem_id, allergen_name) VALUES
(1, 'Cheese'),
(1, 'Eggs'),
(3, 'Cheese');

INSERT INTO MenuIngredient(menuitem_id, ingredient_name) VALUES
(1, 'Cheese'),
(1, 'Eggs'),
(1, 'Beef'),
(1, 'Burger bun'),
(3, 'Cheese'),
(5, 'Potato'),
(5, 'Salt'),
(8, 'Water');