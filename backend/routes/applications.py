from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import Application, Job, User
from extensions import db

applications_bp = Blueprint("applications", __name__)


# Candidate applies for a job
@applications_bp.route("/apply/<int:job_id>", methods=["POST"])
@jwt_required()
def apply_job(job_id):

    candidate_id = int(get_jwt_identity())

    user = User.query.get(candidate_id)

    # Only candidates can apply
    if user.role != "candidate":
        return jsonify({
            "error": "Only candidates can apply"
        }), 403

    # Check if job exists
    job = Job.query.get(job_id)

    if not job:
        return jsonify({
            "error": "Job not found"
        }), 404

    # Check if job is open
    if job.status != "open":
        return jsonify({
            "error": "Job is closed"
        }), 400

    # Prevent duplicate applications
    existing = Application.query.filter_by(
        candidate_id=candidate_id,
        job_id=job_id
    ).first()

    if existing:
        return jsonify({
            "message": "Already applied"
        }), 400

    application = Application(
    candidate_id=candidate_id,
    job_id=job_id,
    resume=user.resume
    )

    db.session.add(application)
    db.session.commit()

    return jsonify({
        "message": "Application submitted"
    })


# Candidate views own applications
@applications_bp.route("/my-applications", methods=["GET"])
@jwt_required()
def my_applications():

    candidate_id = int(get_jwt_identity())

    applications = Application.query.filter_by(
        candidate_id=candidate_id
    ).all()

    results = []

    applications = Application.query.filter_by(candidate_id=candidate_id).all()

    for app in applications:

        job = Job.query.get(app.job_id)

        if not job:
            continue   # skip broken records safely

        results.append({
            "application_id": app.id,
            "job_title": job.title,
            "location": job.location,
            "salary": job.salary,
            "status": app.status
        })

    return jsonify(results)



# Employer views applicants for a specific job
@applications_bp.route("/job/<int:job_id>", methods=["GET"])
@jwt_required()
def job_applicants(job_id):

    employer_id = int(get_jwt_identity())

    user = User.query.get(employer_id)

    # Only employers can view applicants
    if user.role != "employer":
        return jsonify({
            "error": "Only employers can view applicants"
        }), 403

    job = Job.query.get(job_id)

    if not job:
        return jsonify({
            "error": "Job not found"
        }), 404

    # Employer can only view their own job applicants
    if job.employer_id != employer_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    applications = Application.query.filter_by(
        job_id=job_id
    ).all()

    result = []

    for app in applications:

        candidate = User.query.get(app.candidate_id)

        result.append({
            "application_id": app.id,
            "candidate_name": candidate.name,
            "candidate_email": candidate.email,
            "resume": app.resume,
            "status": app.status
        })

    return jsonify(result)


# Employer updates application status
@applications_bp.route("/status/<int:application_id>", methods=["PUT"])
@jwt_required()
def update_status(application_id):
    from utils.email_service import send_status_email

    employer_id = int(get_jwt_identity())

    user = User.query.get(employer_id)

    # Only employers can update status
    if user.role != "employer":
        return jsonify({
            "error": "Only employers can update status"
        }), 403

    application = Application.query.get(application_id)

    if not application:
        return jsonify({
            "error": "Application not found"
        }), 404

    # Get related job
    job = Job.query.get(application.job_id)

    # Employer can only update applications for their jobs
    if job.employer_id != employer_id:
        return jsonify({
            "error": "Unauthorized"
        }), 403

    data = request.get_json()

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Rejected"
    ]

    if data["status"] not in allowed_statuses:
        return jsonify({
            "error": "Invalid status"
        }), 400

    application.status = data["status"]

    db.session.commit()
    candidate = User.query.get(application.candidate_id)

    send_status_email(
        candidate.email,
        job.title,
        application.status
    )


    return jsonify({
        "message": "Status updated"
    })