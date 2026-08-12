# ====================================
# IMPORTS
# ====================================

import os
import requests

from dotenv import load_dotenv

load_dotenv()

# Render's outbound network blocks raw SMTP ports (confirmed via
# [Errno 101] Network is unreachable connecting to smtp.gmail.com:587),
# so the backend can't send mail directly. This relay hop (a Vercel
# serverless function, frontend/api/send-email.js) does the actual
# Gmail SMTP send over plain HTTPS instead - factored out here so
# every send-email code path (the original welcome email in
# email_service.py, and the new template-driven sends in
# email_template_service.py) shares the exact same HTTP call instead
# of each reimplementing it.
EMAIL_RELAY_URL = os.getenv("EMAIL_RELAY_URL")
EMAIL_RELAY_SECRET = os.getenv("EMAIL_RELAY_SECRET")


def post_to_relay(to, subject, text):

    response = requests.post(
        EMAIL_RELAY_URL,
        json={
            "to": to,
            "subject": subject,
            "text": text
        },
        headers={
            "x-relay-secret": EMAIL_RELAY_SECRET
        },
        timeout=15
    )
    response.raise_for_status()
