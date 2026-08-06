# ====================================
# EMAIL DOMAIN VALIDATION
# Single source of truth so the Admin "Add User" form and the public
# signup endpoint can never drift apart on this rule.
# ====================================

def is_janyutech_email(
        email
):
    if not email:
        return False

    normalized = email.strip().lower()

    if "@" not in normalized:
        return False

    local_part, _, domain = normalized.partition("@")

    return bool(local_part) and domain == "janyutech.com"
