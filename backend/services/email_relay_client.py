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


# from_tag: optional Gmail "+tag" address suffix (e.g. "noreply"),
# built by the relay itself (only it knows the real SMTP_USERNAME -
# the backend never sees the actual mailbox address). Omitted for
# every interactive/manual send; only the automatic user-account-
# created path passes one. See frontend/api/send-email.js.
def post_to_relay(to, subject, text, from_tag=None):

    payload = {
        "to": to,
        "subject": subject,
        "text": text
    }

    if from_tag:
        payload["fromTag"] = from_tag

    response = requests.post(
        EMAIL_RELAY_URL,
        json=payload,
        headers={
            "x-relay-secret": EMAIL_RELAY_SECRET
        },
        timeout=15
    )
    response.raise_for_status()
