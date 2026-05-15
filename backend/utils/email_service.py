import resend
import os

resend.api_key = os.getenv("RESEND_API_KEY")


def send_status_email(to_email, job_title, status):

    try:

        resend.Emails.send({
            "from": "onboarding@resend.dev",
            "to": to_email,
            "subject": f"Application Update - {job_title}",
            "html": f"""
                <h2>Application Status Updated</h2>

                <p>Your application for
                <strong>{job_title}</strong>
                has been updated.</p>

                <p>New Status:
                <strong>{status}</strong></p>
            """
        })

        return True

    except Exception as e:
        print(e)
        return False