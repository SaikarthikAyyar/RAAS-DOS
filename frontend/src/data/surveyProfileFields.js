// ====================================
// SURVEY PROFILE FIELDS
// Shared field list for asset.profile - the Sales-Survey-driven
// site-profile JSONB write-back (backend/services/customer_master_service.py
// ::SURVEY_PROFILE_FIELDS). One source of truth for every consumer that
// displays this data, so they can't drift out of sync with each other:
// the Customer 360 export (CustomerDetailView.jsx) and the Enquiry
// Workspace's Site Profile cards (SurveySummary.jsx).
//
// Shape: [key, label, isBool?, group] - isBool marks fields stored as
// real booleans in the profile blob, needing Yes/No formatting instead
// of being printed raw. `label` is bare (no "Survey: " prefix) - the
// workspace cards show it as-is (their card title already gives
// context); the export prepends "Survey: " itself since a flat sheet
// column has no such surrounding context.
//
// `group` mirrors the same section split already used for the live
// Sales Survey data elsewhere in SurveySummary.jsx (Sludge Details /
// Geometry / Access & Setup / Safety / Pump Details), so the profile
// snapshot reads as a parallel set of cards rather than a new taxonomy.
// ====================================

export const SURVEY_PROFILE_FIELDS = [

    ["material_category", "Material Category", false, "sludge"],
    ["tank_type", "Tank Type", false, "sludge"],
    ["sludge_hardness", "Sludge Hardness", false, "sludge"],
    ["debris_level", "Debris Level", false, "sludge"],
    ["water_visibility", "Water Visibility", false, "sludge"],
    ["hazard_level", "Hazard Level", false, "sludge"],
    ["last_survey_id", "Last Survey ID", false, "sludge"],
    ["last_survey_date", "Last Survey Date", false, "sludge"],

    ["tank_length", "Tank Length/Dia (m)", false, "geometry"],
    ["tank_width", "Tank Width (m)", false, "geometry"],
    ["tank_depth", "Sludge Depth (m)", false, "geometry"],
    ["opening_length", "Opening Length (mm)", false, "geometry"],
    ["opening_width", "Opening Width (mm)", false, "geometry"],
    ["opening_height", "Opening Height (mm)", false, "geometry"],
    ["height_from_ground", "Height From Ground (m)", false, "geometry"],
    ["drop_to_floor", "Drop To Floor (m)", false, "geometry"],
    ["setup_distance", "Setup Distance (m)", false, "geometry"],
    ["vertical_lift", "Vertical Lift (m)", false, "geometry"],

    ["hose_distance", "Hose Distance (m)", false, "access"],
    ["access_path_width", "Access Path Width (m)", false, "access"],
    ["access_support", "Access Support", false, "access"],
    ["customer_support", "Customer Support", false, "access"],
    ["access_type", "Access Type", false, "access"],
    ["equipment_nearby", "Equipment Nearby", false, "access"],
    ["scaffolding_needed", "Scaffolding Needed", true, "access"],
    ["crane_available", "Crane Available", true, "access"],
    ["tank_location", "Tank Location", false, "access"],
    ["setup_complexity", "Setup Complexity", false, "access"],

    ["power_available", "Power Available", false, "safety"],
    ["water_available", "Water Available", true, "safety"],
    ["air_supply_available", "Air Supply Available", false, "safety"],
    ["confined_space", "Confined Space", true, "safety"],
    ["ventilation_required", "Ventilation Required", true, "safety"],
    ["gas_testing_required", "Gas Testing Required", true, "safety"],
    ["ehs_restriction", "EHS Restriction", false, "safety"],
    ["power_distance", "Power Distance (m)", false, "safety"],

    ["abrasiveness", "Abrasiveness", false, "pump"],
    ["ph_condition", "pH Condition", false, "pump"],
    ["pump_power_source", "Pump Power Source", false, "pump"],
    ["discharge_medium", "Discharge Medium", false, "pump"],
    ["disposal_route", "Disposal Route", false, "pump"],
    ["disposal_responsibility", "Disposal Responsibility", false, "pump"],
    ["discharge_point_distance", "Discharge Point Distance (m)", false, "pump"]

];


// Card groupings for the Enquiry Workspace's Site Profile display -
// same 5-way split the fields above are already tagged with, kept as
// an ordered list here so the cards render in a stable, sensible order.
export const SURVEY_PROFILE_GROUPS = [
    { key: "sludge", title: "Site Profile — Sludge Details" },
    { key: "geometry", title: "Site Profile — Geometry" },
    { key: "access", title: "Site Profile — Access & Setup" },
    { key: "safety", title: "Site Profile — Safety" },
    { key: "pump", title: "Site Profile — Pump Details" }
];
