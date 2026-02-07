from flask_jwt_extended import create_access_token
from extensions import db, bcrypt
from models.user import User

# AUTH
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
