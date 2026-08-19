// ====================================
// EMAIL
// Standard "local@domain.tld" shape - the same baseline check used
// by most production form libraries (react-hook-form, Formik docs,
// HTML5 type="email" pattern) before any deeper MX/SMTP check.
// ====================================

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {

    if (!value) {
        return true;
    }

    return EMAIL_PATTERN.test(value.trim());

}


// ====================================
// PHONE
// Matches the shared PhoneInput component's output exactly: a real
// country dial code (1-4 digits, "+" prefixed) + a space + exactly 10
// digits - e.g. "+91 9876543210". PhoneInput itself only ever emits
// this shape (its digits field is hard-capped at 10 characters), so
// this validator mainly guards against stale/hand-typed data that
// predates PhoneInput, or an empty selection.
// ====================================

const PHONE_PATTERN = /^\+\d{1,4} \d{10}$/;

export function isValidPhone(value) {

    if (!value) {
        return true;
    }

    return PHONE_PATTERN.test(value.trim());

}


// ====================================
// JANYUTECH EMAIL
// Only @janyutech.com addresses are accepted for new user accounts
// (both the public signup form and Administration's Add User form) -
// mirrors backend/utils/email_validation.py's is_janyutech_email.
// ====================================

export function isJanyutechEmail(value) {

    if (!value) {
        return true;
    }

    const normalized = value.trim().toLowerCase();

    const [localPart, domain] = normalized.split("@");

    return Boolean(localPart) && domain === "janyutech.com";

}
