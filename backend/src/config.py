import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    SQLALCHEMY_DATABASE_URI = ("sqlite:///" + os.path.join(BASE_DIR, "instance", "app.db"))
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    TMDB_BASE_URL = "https://api.themoviedb.org/3"
    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

