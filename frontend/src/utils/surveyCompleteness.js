// ====================================
// REQUIRED FIELD KEYS
// Single source of truth for which Sales Survey fields are required
// (Sections A/B/C previously; now also selected fields in D/E - see
// below). Shared by useSalesSurvey.js's own submit gate and
// SurveySummary.jsx's "Request Ops Review" gate, so both read the
// exact same completeness rule and can never drift apart.
//
// Deliberately excluded: Section A's Company Name / Site / Plant /
// Person Of Contact / Contact Number are readOnly - populated only as
// a side effect of picking a Customer Request above them, never
// directly typed on this form. Gating submission on them blocked
// users with no way to fix the flagged field themselves; compulsory
// checks here only apply to fields the user can actually input.
//
// The 10 D/E-onward entries below were added after an audit of
// ops_engine.py/quote_engine.py found these exact fields are read
// (via backend/mapping/survey_field_mapper.py's OPS_FIELD_MAP) by the
// Ops Engine's scoring/doability/pump-selection logic, but had no
// compulsory marking - so a blank value was silently treated the same
// as "None"/0, quietly skipping real penalties/filters (e.g. a blank
// Hazard Level never triggers the EHS Review gate). `geometry.
// opening_height` replaces what would otherwise have been
// `geometry.height_from_ground` in this list - that was the field the
// engine was ACTUALLY reading under the (buggy) "opening_height" key
// before the OPS_FIELD_MAP fix landed alongside this change; post-fix,
// height_from_ground is no longer read by any algorithm at all, so
// it stays optional, and the real opening_height field (always meant
// to be read here) is the one that's now required.
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
    "job.cleaning_frequency",
    "job.hazard_level",
    "job.material_ph_condition",
    "job.temperature_range",

    // Section C
    "geometry.tank_type",
    "geometry.length_dia",
    "geometry.width",
    "geometry.sludge_depth",
    "geometry.opening_width",
    "geometry.opening_height",
    "geometry.vertical_lift",
    "geometry.crane_available",

    // Section D
    "safety.power_available",

    // Section E
    "pump.suction_depth",
    "pump.target_flow"

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
