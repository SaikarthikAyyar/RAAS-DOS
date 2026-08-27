// ====================================
// SURVEY PROFILE FIELDS
// Shared field list for asset.profile - the Sales-Survey-driven
// site-profile JSONB write-back (backend/services/customer_master_service.py
// ::SURVEY_PROFILE_FIELDS / DEWATERING_PROFILE_FIELDS). Drives the
// Enquiry Workspace's "Site Profile" cards (SurveySummary.jsx). The
// Customer 360 export is generated server-side (backend/reporting/
// customer_360_xlsx.py) and keeps its own matching Python copy of
// this same list - the two must be kept in sync by hand since they
// run in different languages.
//
// Shape: [key, label, isBool?, group] - isBool marks fields stored as
// real booleans in the profile blob, needing Yes/No formatting instead
// of being printed raw. `group` mirrors the same section split already
// used for the live Sales Survey data elsewhere in SurveySummary.jsx
// (Customer Details / Job Details / Sludge Details / Geometry /
// Access & Setup / Safety / Pump Details / Dewatering / Customer
// Insights), so the profile snapshot reads as a parallel set of cards.
//
// The "dewatering" group is conditional at sync time, not at display
// time: the backend only ever populates these 15 keys when that
// survey's own Dewatering Required answer was "Yes" - when "No", none
// of them are written at all (not even a "No" for dewatering_required
// itself). The card still always renders (so the group heading is
// never missing), it just shows "-" for every row on an asset whose
// last real survey didn't require dewatering.
//
// Deliberately excludes setup_distance, ph_condition, disposal_route -
// real columns on the SalesSurvey model, but with no input anywhere in
// the actual Sales Survey form, so they can never hold a real value.
// Listing them here would just show a permanent "-" in every card and
// export - noise, not data. Left off this list entirely rather than
// carried as always-blank rows.
// ====================================

export const SURVEY_PROFILE_FIELDS = [

    ["nearest_hub", "Nearest Hub", false, "customer"],
    ["urgency", "Urgency", false, "customer"],
    ["survey_date", "Survey Date", false, "customer"],
    ["surveyed_by", "Surveyed By", false, "customer"],
    ["repeat_potential", "Repeat Potential", false, "customer"],

    ["cleaning_date", "Cleaning Date", false, "job"],
    ["material_ph_condition", "pH / Corrosiveness (Material)", false, "job"],
    ["sample_available", "Sample Available", false, "job"],
    ["temperature_range", "Temperature", false, "job"],

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
    ["pump_power_source", "Pump Power Source", false, "pump"],
    ["discharge_medium", "Discharge Medium", false, "pump"],
    ["disposal_responsibility", "Disposal Responsibility", false, "pump"],
    ["discharge_point_distance", "Discharge Point Distance (m)", false, "pump"],
    ["suction_depth", "Suction Depth (m)", false, "pump"],
    ["discharge_distance", "Discharge Distance (m)", false, "pump"],
    ["discharge_pit_dimension", "Discharge Pit Dimension", false, "pump"],

    // Conditional group - see file header comment. Backend only fills
    // these in when that survey's dewatering_required was "Yes".
    ["dewatering_required", "Dewatering Required", false, "dewatering"],
    ["dewatering_volume", "Dewatering Volume (m³)", false, "dewatering"],
    ["inlet_moisture", "Inlet Moisture %", false, "dewatering"],
    ["target_final_moisture", "Target Final Moisture %", false, "dewatering"],
    ["expected_final_form", "Expected Final Form", false, "dewatering"],
    ["visible_free_water", "Visible Free Water", false, "dewatering"],
    ["natural_settling", "Natural Settling Ability", false, "dewatering"],
    ["oily_emulsified", "Oily / Emulsified", true, "dewatering"],
    ["space_available", "Space for Bags / Holding", false, "dewatering"],
    ["filtrate_route", "Filtrate Route Available", true, "dewatering"],
    ["moisture_guarantee", "Final Moisture Guarantee", true, "dewatering"],
    ["cake_handling_scope", "Cake Handling Scope", false, "dewatering"],
    ["filtrate_route_detail", "Filtrate Route Detail", false, "dewatering"],
    ["polymer_allowed", "Polymer Allowed", false, "dewatering"],
    ["commitment", "Commitment", false, "dewatering"],

    ["customer_pain_point", "Customer Pain", false, "insights"],
    ["shutdown_window", "Shutdown Window", false, "insights"],
    ["current_method", "Current Method", false, "insights"],
    ["budget_estimate", "Budget Estimate (INR)", false, "insights"],
    ["decision_maker", "Decision Maker", false, "insights"]

];


// Card groupings for the Enquiry Workspace's Site Profile display -
// same section split the fields above are already tagged with, kept
// as an ordered list here so the cards render in a stable, sensible
// order (matching the live Sales Survey's own A -> G section order).
export const SURVEY_PROFILE_GROUPS = [
    { key: "customer", title: "Site Profile — Customer Details" },
    { key: "job", title: "Site Profile — Job Details" },
    { key: "sludge", title: "Site Profile — Sludge Details" },
    { key: "geometry", title: "Site Profile — Geometry" },
    { key: "access", title: "Site Profile — Access & Setup" },
    { key: "safety", title: "Site Profile — Safety" },
    { key: "pump", title: "Site Profile — Pump Details" },
    { key: "dewatering", title: "Site Profile — Dewatering" },
    { key: "insights", title: "Site Profile — Customer Insights" }
];
