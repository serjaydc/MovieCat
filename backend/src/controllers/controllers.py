from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models.user import User, UserListItem
import requests
from config import Config

TMDB_BASE_URL = Config.TMDB_BASE_URL
TMDB_API_KEY = Config.TMDB_API_KEY

# AUTH CONTROLLERS
def register(data):
    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return {"message": "Fill in all fields"}, 400

    if User.query.filter((User.email == data["email"]) |(User.username == data["username"])).first():
        return {"message": "Username or email already exists"}, 409

    user = User(
        username=data["username"],
        email=data["email"],
        password=bcrypt.generate_password_hash(
            data["password"]
        ).decode("utf-8")
    )

    db.session.add(user)
    db.session.commit()

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": create_access_token(identity=str(user.id))
    }, 201


def login(data):
    if not data or not data.get("email") or not data.get("password"):
        return {"message": "Fill in all fields"}, 400

    user = User.query.filter_by(email=data["email"]).first()

    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return {"message": "Invalid credentials"}, 401

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": create_access_token(identity=str(user.id))
    }, 200


def profile(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"message": "User not found"}, 404

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }, 200


def logout():
    return {"message": "Logout successful"}, 200


def delete(user_id):
    user = User.query.get(user_id)

    if not user:
        return {"message": "User not found"}, 404

    db.session.delete(user)
    db.session.commit()

    return {"message": "Account deleted successfully"}, 200

# PERSONAL LIST CONTROLLERS
def fetch_user_list(user_id):
    items = UserListItem.query.filter_by(user_id=user_id).all()
    return [item.to_dict() for item in items], 200


def add_list_item(user_id, data):
    if not data or not data.get("tmdb_id") or not data.get("media_type"):
        return {"message": "Invalid data"}, 400

    item = UserListItem(
        user_id=user_id,
        tmdb_id=data["tmdb_id"],
        media_type=data["media_type"]
    )

    db.session.add(item)
    db.session.commit()

    return {"message": "Added to list"}, 201


def update_list_item(item_id, data):
    item = UserListItem.query.get(item_id)
    if not item:
        return {"message": "Item not found"}, 404

    item.watched = data.get("watched", item.watched)
    item.liked = data.get("liked", item.liked)
    item.in_list = data.get("in_list", item.in_list)

    db.session.commit()
    return {"message": "Updated"}, 200


def remove_list_item(item_id):
    item = UserListItem.query.get(item_id)
    if not item:
        return {"message": "Item not found"}, 404

    db.session.delete(item)
    db.session.commit()

    return {"message": "Removed"}, 200

# TMDB CONTROLLER
def tmdb(endpoint, params=None):
    if params is None:
        params = {}
    params["api_key"] = TMDB_API_KEY
    return requests.get(f"{TMDB_BASE_URL}{endpoint}", params=params).json()