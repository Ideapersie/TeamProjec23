INSERT INTO MenuItem(menuitem_id, name, description, type, price, calories, image) VALUES
(DEFAULT, 'Cheeseburger', 'Our classic two-patty burger with two slices of melted American cheese.', 'Burgers', 8.50, 800,'https://i.postimg.cc/rFM2sQfq/360-F-585291338-0-J8-Q8v-Yb-KDCu8yqqw-AO8-Ps-QZ4-ESP2zd8.jpg'),
(DEFAULT, 'Vegan Burger', 'Our new 100% vegan burger with an improved patty recipe.', 'Burgers', 8.50, 600,'https://i.postimg.cc/fRTXtSYG/Beyond-Famous-Star-Hero5-B55-D-4c6ee754766f423e95eaf57cd87f30f8.jpg'),
(DEFAULT, 'Saver Burger', 'Our small value hamburger with an even smaller price tag.', 'Burgers', 4.50, 500,'https://i.postimg.cc/bvpQy2dS/Hamburger-PNG-Image.png'),
(DEFAULT, 'Cajun Fries', 'Our classic fries, generously sprinkled with cajun seasonings.', 'Sides', 3.00, 400,'https://i.postimg.cc/JnhZJVN1/intro-1681926392.jpg'),
(DEFAULT, 'Regular Fries', '100% British potatoes, served with a sprikle of sea salt.', 'Sides', 3.00, 350,'https://i.postimg.cc/VkcG3gQj/french-fries-with-ai-generated-free-png.webp'),
(DEFAULT, 'Sweet Potato Fries', 'Crispy and salty-sweet potatoes, served with a sprinkle of sea salt.', 'Sides', 3.00, 400,'https://i.postimg.cc/YSQptbhM/83f45e25-16f1-473b-b503-40608443e4f9.avif'),
(DEFAULT, 'Fanta Orange', 'Fanta''s original Recipe.', 'Drinks', 2.50, 50,'https://i.postimg.cc/3r4tNV3X/580b57fbd9996e24bc43c10f.png');
(DEFAULT, 'Water', 'Still natural mineral water.', 'Drinks', 2.50, 50, 'https://i.postimg.cc/MZ5Nfm75/c-HJpdm-F0-ZS9sci9pb-WFn-ZXMvd2-Vic2l0-ZS8y-MDIy-LTA1-L3-B4-ODAx-MTE5-LWlt-YWdl-LWt3dnhme-HQ3-Lmpw-Zw.png'),
(DEFAULT, 'Coke Original', 'Coca Cola''s original recipe.', 'Drinks', 2.50, 50, 'https://i.postimg.cc/P5wHM2bY/CocaCola.jpg');

INSERT INTO Allergen(allergen_name) VALUES
('Cheese'),
('Eggs');

INSERT INTO MenuAllergen(menuitem_id, allergen_name) VALUES
(1, 'Cheese'),
(1, 'Eggs'),
(3, 'Cheese');
