from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.controllers import register, login, logout, profile, delete

auth_routes = Blueprint('auth_routes', __name__, url_prefix='/api/auth')

@auth_routes.route('/register', methods=['POST'])
def register_route():
    return register(request.json)

@auth_routes.route('/login', methods=['POST'])
def login_route():
    return login(request.json)

@auth_routes.route('/profile', methods=['GET'])
@jwt_required()
def profile_route():
    user_id = get_jwt_identity()
    return profile(user_id)

@auth_routes.route('/logout', methods=['POST'])
@jwt_required()
def logout_route():
    user_id = get_jwt_identity()
    return logout(user_id)

@auth_routes.route('/delete', methods=['DELETE'])
@jwt_required()
def delete_route():
    user_id = get_jwt_identity()
    return delete(user_id)