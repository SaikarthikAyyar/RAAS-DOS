# ====================================
# IMPORTS
# ====================================

import os
import smtplib

from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "RAAS-DOS")

# Display "From" address - separate from SMTP_USERNAME, which is the
# Gmail account actually authenticating. Gmail only lets the From
# header be something other than the authenticated account if that
# address is added as a verified "Send mail as" alias under
# Settings -> Accounts and Import in that Gmail account; otherwise
# Gmail silently rewrites it back to SMTP_USERNAME.
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", SMTP_USERNAME)


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
    subject = "Welcome to RAAS-DOS"

    body = f"""Hi {name},

An account has been created for you on RAAS-DOS, the role-based workflow management system used to run enquiries, surveys, and job execution from a single place.

Your login details:

  Email:    {to_email}
  Password: {password}
  Role:     {role}

RAAS-DOS walks an enquiry through its full lifecycle - Customer Request, Sales Survey, Ops Review, Techno-Commercial Approval, Commercial Approval, PO, Job Creation, Execution, and Completion - with each stage handled by the people whose role covers it. As a {role}, your sidebar will show only the modules relevant to your role.

Log in at the RAAS-DOS URL you were given, using the email and password above. You can change your password later from within the app.

If anything about your access looks wrong, contact your administrator.

- RAAS-DOS
"""

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{SMTP_FROM_NAME} <{SMTP_FROM_EMAIL}>"
    message["To"] = to_email
    message.set_content(body)

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(message)

        print(f"[EmailService] Welcome email sent to {to_email}")

    except Exception as error:
        print(f"[EmailService] Failed to send welcome email to {to_email}: {error}")
