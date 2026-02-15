from flask_jwt_extended import create_access_token
from ..extensions import db, bcrypt
from ..models.user import User, UserListItem
import requests
from ..config import Config

TMDB_BASE_URL = Config.TMDB_BASE_URL
TMDB_API_KEY = Config.TMDB_API_KEY

# AUTH CONTROLLERS
def register(data):
    # Check if all fields are filled
    if not data or not data.get("username") or not data.get("email") or not data.get("password"):
        return {"message": "Fill in all fields"}, 400
    # Check if username or email already exists
    if User.query.filter((User.email == data["email"]) |(User.username == data["username"])).first():
        return {"message": "Username or email already exists"}, 409
    # Create user
    user = User(
        username=data["username"],
        email=data["email"],
        password=bcrypt.generate_password_hash(
            data["password"]
        ).decode("utf-8")
    )
    # Add user to database
    db.session.add(user)
    db.session.commit()
    # Return user
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": create_access_token(identity=str(user.id))
    }, 201


def login(data):
    # Check if all fields are filled
    if not data or not data.get("email") or not data.get("password"):
        return {"message": "Fill in all fields"}, 400
    # Check if user exists
    user = User.query.filter_by(email=data["email"]).first()
    # Check if password is correct
    if not user or not bcrypt.check_password_hash(user.password, data["password"]):
        return {"message": "Invalid credentials"}, 401
    # Return user
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "token": create_access_token(identity=str(user.id))
    }, 200


def profile(user_id):
    # Check if user exists
    user = User.query.get(user_id)

    if not user:
        return {"message": "User not found"}, 404
    # Return user
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email
    }, 200


def logout():
    return {"message": "Logout successful"}, 200



def delete(user_id):
    # Check if user exists
    user = User.query.get(user_id)

    if not user:
        return {"message": "User not found"}, 404
    # Delete user
    db.session.delete(user)
    db.session.commit()
    # Return message
    return {"message": "Account deleted successfully"}, 200

# PERSONAL LIST CONTROLLERS
def fetch_user_list(user_id):
    # Find items based on user params
    items = UserListItem.query.filter_by(user_id=user_id).all()
    # Return items
    return [item.to_dict() for item in items], 200

def add_list_item(user_id, data):
    # Create item
    item = UserListItem(
        user_id=user_id,
        tmdb_id=data["tmdb_id"],
        media_type=data["media_type"],
        title=data["title"],
        poster_path=data["poster_path"],
        release_date=data["release_date"],
        vote_average=data["vote_average"]
    )
    # Add item to database
    db.session.add(item)
    db.session.commit()
    # Return item
    return item.to_dict(), 201

def update_list_item(item_id, data):
    # Check if item exists
    item = UserListItem.query.get(item_id)
    if not item:
        return {"message": "Item not found"}, 404
    # Update item
    item.watched = data.get("watched", item.watched)
    item.liked = data.get("liked", item.liked)
    item.in_list = data.get("in_list", item.in_list)
    # Commit changes
    db.session.commit()
    return {"message": "Updated"}, 200


def remove_list_item(item_id):
    # Check if item exists
    item = UserListItem.query.get(item_id)
    if not item:
        return {"message": "Item not found"}, 404
    # Delete item
    db.session.delete(item)
    db.session.commit()
    # Return message
    return {"message": "Removed"}, 200

# TMDB CONTROLLER
def tmdb(endpoint, params=None):
    # Get TMDB data
    if params is None:
        params = {}
    params["api_key"] = TMDB_API_KEY
    # Return data
    return requests.get(f"{TMDB_BASE_URL}{endpoint}", params=params).json()