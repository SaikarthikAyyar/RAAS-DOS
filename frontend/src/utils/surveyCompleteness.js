// ====================================
// REQUIRED FIELD KEYS
// Single source of truth for which Sales Survey fields are required
// (Sections A/B/C only - matches the "*" labels already on those
// fields; D-H have none). Shared by useSalesSurvey.js's own submit
// gate and SurveySummary.jsx's "Request Ops Review" gate, so both
// read the exact same completeness rule and can never drift apart.
//
// Deliberately excluded: Section A's Company Name / Site / Plant /
// Person Of Contact / Contact Number are readOnly - populated only as
// a side effect of picking a Customer Request above them, never
// directly typed on this form. Gating submission on them blocked
// users with no way to fix the flagged field themselves; compulsory
// checks here only apply to fields the user can actually input.
// ====================================

export const REQUIRED_FIELD_KEYS = [

    // Section A
    "customer.nearest_hub",
    "customer.urgency",
    "customer.survey_date",

    // Section B
    "job.job_type",
    "job.material_category",
    "job.sludge_hardness",
    "job.debris_level",
    "job.cleaning_date",
    "job.cleaning_frequency",

    // Section C
    "geometry.tank_type",
    "geometry.length_dia",
    "geometry.width",
    "geometry.sludge_depth"

];

export function isEmpty(value){
    return value === null || value === undefined || value === "";
}

// Returns { errors, canSubmit } - errors is keyed exactly like
// REQUIRED_FIELD_KEYS (true = that field is missing/invalid).
// enquiryCreatedAt (optional) additionally checks Survey Date isn't
// earlier than the enquiry's own creation date.
export function getSurveyCompletenessErrors(surveyData, enquiryCreatedAt){

    const errors = {};

    REQUIRED_FIELD_KEYS.forEach(key => {

        const [section, field] = key.split(".");

        const value = surveyData?.[section]?.[field];

        if(key === "customer.survey_date"){
            errors[key] = isEmpty(value) || Boolean(enquiryCreatedAt && value < enquiryCreatedAt);
        }
        else{
            errors[key] = isEmpty(value);
        }

    });

    const canSubmit = Object.values(errors).every(hasError => !hasError);

    return { errors, canSubmit };

}
