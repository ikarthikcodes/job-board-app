from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Job
from extensions import db
jobs_bp = Blueprint("jobs", __name__)


@jobs_bp.route("/create", methods=["POST"])
@jwt_required()
def create_job():

    user_id = get_jwt_identity()

    from models import User

    user = User.query.get(user_id)

    if user.role != "employer":
        return jsonify({
            "error": "Only employers can post jobs"
        }), 403

    data = request.json

    job = Job(
        title=data["title"],
        description=data["description"],
        location=data["location"],
        salary=data["salary"],
        employer_id=user_id
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "Job created"})

@jobs_bp.route("/", methods=["GET"])
def get_jobs():

    salary = request.args.get("salary", "")
    search = request.args.get("search", "")
    location = request.args.get("location", "")

    jobs = Job.query.filter(
        Job.title.ilike(f"%{search}%"),
        Job.location.ilike(f"%{location}%"),
        Job.salary.ilike(f"%{salary}%"),
        Job.status == "open"
    ).all()

    result = []

    for job in jobs:
        result.append({
            "id": job.id,
            "title": job.title,
            "description": job.description,
            "location": job.location,
            "salary": job.salary,
            "status": job.status
        })

    return jsonify(result)


@jobs_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_job(id):

    user_id = get_jwt_identity()

    from models import User

    user = User.query.get(user_id)

    if user.role != "employer":
        return jsonify({
            "error": "Only employers can update jobs"
        }), 403

    job = Job.query.get_or_404(id)

    data = request.json

    job.title = data["title"]
    job.description = data["description"]
    job.location = data["location"]
    job.salary = data["salary"]
    job.status = data["status"]

    db.session.commit()

    return jsonify({"message": "Job updated"})


@jobs_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_job(id):

    user_id = get_jwt_identity()

    from models import User

    user = User.query.get(user_id)

    if user.role != "employer":
        return jsonify({
            "error": "Only employers can delete jobs"
        }), 403

    job = Job.query.get_or_404(id)

    db.session.delete(job)
    db.session.commit()

    return jsonify({"message": "Job deleted"})