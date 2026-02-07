from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, bcrypt

from routes.routes import auth_routes, tmdb_routes, list_routes

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

app.register_blueprint(auth_routes)
app.register_blueprint(tmdb_routes)
app.register_blueprint(list_routes)

db.init_app(app)
jwt.init_app(app)
bcrypt.init_app(app)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)