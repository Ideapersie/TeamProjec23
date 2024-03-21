"""
A Flask web app defining API routes.

This module runs the server-side, API routes expect to be called by the frontend to perform a service.

To run:
    `flask run` 
"""
from flask import Flask
from menu.routes import menu_bp
from auth.routes import auth_bp
from order.routes import order_bp
from payment.routes import payment_bp
from notification.routes import notification_bp

app = Flask(__name__)
app.register_blueprint(menu_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(order_bp)
app.register_blueprint(payment_bp)
app.register_blueprint(notification_bp)

app.run(debug=True)