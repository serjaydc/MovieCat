from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import db, jwt, bcrypt
from .routes.routes import auth_routes, tmdb_routes, list_routes
import os

# Initialize the app
app = Flask(__name__)
# Load config
app.config.from_object(Config)
# Initialize CORS
CORS(app)

# Register blueprints
app.register_blueprint(auth_routes)
app.register_blueprint(tmdb_routes)
app.register_blueprint(list_routes)

# Initialize extensions
db.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

# Create the database
with app.app_context():
    instance_path = os.path.join(os.path.dirname(__file__), "instance")
    os.makedirs(instance_path, exist_ok=True)
    db.create_all()
