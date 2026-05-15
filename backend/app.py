from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import db
import os
from flask import send_from_directory

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///jobboard.db'
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET")
    app.config['UPLOAD_FOLDER'] = 'uploads'

    CORS(app)

    db.init_app(app)
    JWTManager(app)

    from routes.auth import auth_bp
    from routes.jobs import jobs_bp
    from routes.applications import applications_bp
    from routes.profile import profile_bp


    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(jobs_bp, url_prefix="/jobs")
    app.register_blueprint(applications_bp, url_prefix="/applications")
    app.register_blueprint(profile_bp, url_prefix="/profile")

    with app.app_context():
        db.create_all()

    return app

app = create_app()
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(
        app.config['UPLOAD_FOLDER'],
        filename
    )

if __name__ == "__main__":
    app.run(debug=True)