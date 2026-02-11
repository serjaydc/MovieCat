from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from controllers.controllers import register, login, logout, profile, delete, tmdb, fetch_user_list, add_list_item, update_list_item, remove_list_item

# AUTH ROUTES
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

# TMDB ROUTES
tmdb_routes = Blueprint('tmdb_routes', __name__, url_prefix='/api/tmdb')

@tmdb_routes.route("/movies")
def movies():
    return jsonify(tmdb("/movie/popular"))

@tmdb_routes.route("/tvshows")
def tvshows():
    return jsonify(tmdb("/tv/popular"))

@tmdb_routes.route("/movie/<int:movie_id>")
def single_movie(movie_id):
    return jsonify(tmdb(f"/movie/{movie_id}"))

@tmdb_routes.route("/tv/<int:tv_id>")
def single_tv(tv_id):
    return jsonify(tmdb(f"/tv/{tv_id}"))

@tmdb_routes.route("/genre/<media_type>/<int:genre_id>")
def by_genre(media_type, genre_id):
    return jsonify(tmdb(f"/discover/{media_type}", {"with_genres": genre_id}))

@tmdb_routes.route("/trending")
def trending():
    return jsonify(tmdb("/trending/all/week"))

@tmdb_routes.route("/new-releases")
def new_releases():
    return jsonify(tmdb("/movie/now_playing"))

@tmdb_routes.route("/coming-soon")
def coming_soon():
    return jsonify(tmdb("/movie/upcoming"))

@tmdb_routes.route("/top-rated")
def top_rated():
    return jsonify(tmdb("/movie/top_rated"))

# PERSONAL LIST ROUTES
list_routes = Blueprint('list_routes', __name__, url_prefix='/api/list')


@list_routes.route("/", methods=["GET"])
@jwt_required()
def user_list():
    user_id = get_jwt_identity()
    response, status = fetch_user_list(user_id)
    return jsonify(response), status

@list_routes.route("/add", methods=["POST"])
@jwt_required()
def add_item():
    user_id = get_jwt_identity()
    response, status = add_list_item(user_id, request.json)
    return jsonify(response), status

@list_routes.route("/update/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_item(item_id):
    response, status = update_list_item(item_id, request.json)
    return jsonify(response), status

@list_routes.route("/remove/<int:item_id>", methods=["DELETE"])
@jwt_required()
def remove_item(item_id):
    response, status = remove_list_item(item_id)
    return jsonify(response), status