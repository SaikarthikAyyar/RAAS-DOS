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
// Indian mobile convention (matches the wireframe's own contact
// data, e.g. "+91 98200 11223"): optional "+91" country code,
// then exactly 10 digits starting 6-9. Spaces/dashes in the typed
// value are stripped before checking.
// ====================================

const PHONE_PATTERN = /^(\+91)?[6-9]\d{9}$/;

export function isValidPhone(value) {

    if (!value) {
        return true;
    }

    const normalized = value.trim().replace(/[\s-]/g, "");

    return PHONE_PATTERN.test(normalized);

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
