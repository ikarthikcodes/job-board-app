from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

from werkzeug.utils import secure_filename
from models import User
from extensions import db

import os

profile_bp = Blueprint("profile", __name__)


@profile_bp.route("/upload-resume", methods=["POST"])
@jwt_required()
def upload_resume():

    user_id = int(get_jwt_identity())

    user = User.query.get(user_id)

    if "resume" not in request.files:
        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "Empty filename"
        }), 400

    filename = secure_filename(file.filename)

    filepath = os.path.join(
        current_app.config['UPLOAD_FOLDER'],
        filename
    )

    file.save(filepath)

    user.resume = filename

    db.session.commit()

    return jsonify({
        "message": "Resume uploaded",
        "filename": filename
    })


# Update Email Endpoint
@profile_bp.route("/update-email", methods=["PUT"])
@jwt_required()
def update_email():
    user_id = int(get_jwt_identity()) 
    user = User.query.get(user_id) 
    data = request.json 

    # Only update the email
    if "email" in data:
        user.email = data.get("email") 
        db.session.commit() 
        return jsonify({"message": "Email updated successfully"}) 

    return jsonify({"message": "Email field is required"}), 400

@profile_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "name": user.name,
        "email": user.email
    })
