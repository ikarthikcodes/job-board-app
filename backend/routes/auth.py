from flask import Blueprint, request, jsonify
from models import User
from extensions import db
from flask_jwt_extended import create_access_token
import bcrypt

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.json

    hashed = bcrypt.hashpw(
        data["password"].encode('utf-8'),
        bcrypt.gensalt()
    )

    user = User(
        name=data["name"],
        email=data["email"],
        password=hashed.decode('utf-8'),
        role=data["role"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered"})


@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.json

    user = User.query.filter_by(email=data["email"]).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if bcrypt.checkpw(
        data["password"].encode('utf-8'),
        user.password.encode('utf-8')
    ):

        token = create_access_token(identity=str(user.id))

        return jsonify({
            "token": token,
            "role": user.role,
            "user_id": user.id
        })

    return jsonify({"error": "Invalid credentials"}), 401