# ====================================
# SHARED CONTACT FORMAT VALIDATORS
# One place for the "is this a valid email / phone number" rule,
# reused as a Pydantic field_validator body across every schema that
# collects an email or phone/contact number. Mirrors
# frontend/src/utils/validators.js exactly - client and server both
# defend the same rule.
#
# PHONE_PATTERN matches the shared PhoneInput component's output: a
# real country dial code (1-4 digits, "+" prefixed) + a space + exactly
# 10 digits (e.g. "+91 9876543210") - not India-only, since PhoneInput
# offers a real country selector everywhere it's used.
#
# Email format is intentionally domain-agnostic here - only
# backend/utils/email_validation.py's is_janyutech_email() restricts
# to @janyutech.com, and that stays scoped to user-account creation
# (Administration -> Users, public Signup) only, per direct
# instruction - every other email field in the app accepts any real
# address.
# ====================================

import re


PHONE_PATTERN = re.compile(r"^\+\d{1,4} \d{10}$")

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def validate_phone_format(value):

    if not value:
        return value

    if not PHONE_PATTERN.match(value.strip()):
        raise ValueError("Enter a valid 10-digit phone number.")

    return value


def validate_email_format(value):

    if not value:
        return value

    if not EMAIL_PATTERN.match(value.strip()):
        raise ValueError("Enter a valid email address.")

    return value
