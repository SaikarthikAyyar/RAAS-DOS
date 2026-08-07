# ====================================
# IMPORTS
# ====================================

import os
import requests

from dotenv import load_dotenv

load_dotenv()

# Render's outbound network blocks raw SMTP ports (confirmed via
# [Errno 101] Network is unreachable connecting to smtp.gmail.com:587),
# so the backend can no longer send mail directly via smtplib. Instead
# it calls a small relay endpoint deployed on Vercel
# (frontend/api/send-email.js) over plain HTTPS, which does the actual
# Gmail SMTP send from there instead - HTTPS isn't blocked the way raw
# SMTP ports are.
EMAIL_RELAY_URL = os.getenv("EMAIL_RELAY_URL")
EMAIL_RELAY_SECRET = os.getenv("EMAIL_RELAY_SECRET")


# ====================================
# WELCOME EMAIL
# Sent whenever a new User account is created, from either the
# public /signup endpoint or Administration -> Users -> Add User.
# Failures are logged and swallowed - a bad SMTP credential or
# network hiccup must not block the account itself from being
# created, since the email is a side effect, not a precondition.
# ====================================

def send_welcome_email(
        to_email,
        name,
        role,
        password
):
    subject = "RAAS-DOS Account Notification"

    body = f"""Dear {name},

This is an auto-generated notification. Please do not reply to this email.

An account has been created for you on RAAS-DOS, the role-based workflow management system used to manage enquiries, surveys, and job execution.

Account details:

  Email:    {to_email}
  Password: {password}
  Role:     {role}

RAAS-DOS manages an enquiry through its full lifecycle - Customer Request, Sales Survey, Ops Review, Techno-Commercial Approval, Commercial Approval, PO, Job Creation, Execution, and Completion - with each stage handled by the personnel whose role covers it. As a {role}, you will have access to the modules relevant to your role.

Please log in using the email and password provided above. You are advised to change your password after your first login.

If you believe you have received this email in error, or if your access appears incorrect, please contact your system administrator.

This is a system-generated email. Please do not reply.

Regards,
RAAS-DOS
"""

    try:
        response = requests.post(
            EMAIL_RELAY_URL,
            json={
                "to": to_email,
                "subject": subject,
                "text": body
            },
            headers={
                "x-relay-secret": EMAIL_RELAY_SECRET
            },
            timeout=15
        )
        response.raise_for_status()

        print(f"[EmailService] Welcome email sent to {to_email}")

    except Exception as error:
        print(f"[EmailService] Failed to send welcome email to {to_email}: {error}")
