from ..extensions import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    userlist = db.relationship('UserListItem', backref='user', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email
        }

class UserListItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    tmdb_id = db.Column(db.Integer, nullable=False)
    media_type = db.Column(db.String(10), nullable=False)

    title = db.Column(db.String(255), nullable=False)
    poster_path = db.Column(db.String(255))
    release_date = db.Column(db.String(10))
    vote_average = db.Column(db.Float)

    watched = db.Column(db.Boolean, default=False)
    liked = db.Column(db.Boolean, default=False)
    in_list = db.Column(db.Boolean, default=True)

    __table_args__ = (
    db.UniqueConstraint('user_id', 'tmdb_id', name='unique_user_movie'),
    )
    
    def to_dict(self):
        return {
            "id": self.id,
            "tmdb_id": self.tmdb_id,
            "media_type": self.media_type,
            "title": self.title,
            "poster_path": self.poster_path,
            "release_date": self.release_date,
            "vote_average": self.vote_average,
            "watched": self.watched,
            "liked": self.liked,
            "in_list": self.in_list
        }