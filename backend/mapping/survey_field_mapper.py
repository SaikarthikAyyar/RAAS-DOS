# ====================================
# SALES SURVEY → OPS ENGINE FIELD MAP
# ====================================

OPS_FIELD_MAP = {

    "survey_date": "survey_date",

    "job_type": "job_type",

    "material_category": "material_category",

    "sludge_hardness": "sludge_hardness",

    "estimated_volume": "estimated_volume",

    "debris_level": "debris_level",

    "water_visibility": "water_visibility",

    "fluid_density": "bulk_density",

    "pumpable": "pumpable",

    "large_object": "large_object_type",

    "hazard": "hazard_level",

    "ph_min": "ph_min",

    "ph_max": "ph_max",

    # score_environment's extreme-pH check now derives its numeric
    # range from this categorical field (see ops_engine.py's
    # PH_RANGE_BY_CONDITION) - the Sales Survey form no longer collects
    # ph_min/ph_max directly, so the two map entries above are inert
    # leftovers (harmless, left in place rather than removed).
    "material_ph_condition": "material_ph_condition",

    "flow_after_agitation": "flow_after_agitation",

    "cleaning_date": "cleaning_date",

    "cleaning_frequency": "cleaning_frequency",

    "tank_type": "tank_type",

    "tank_length": "tank_length",

    "tank_width": "tank_width",

    "tank_depth": "tank_depth",

    "opening_length": "opening_length",

    "opening_width": "opening_width",

    # Fixed - this previously pointed at "height_from_ground" (a
    # different, genuinely separate Section C field), so score_access()
    # was comparing the site's Height-From-Ground value against each
    # machine's minimum-opening-height requirement, and the real
    # opening_height column the user actually fills in ("Opening
    # Height (mm)") was never read by the algorithm under any key.
    # height_from_ground is not consumed anywhere in ops_engine.py, so
    # it's simply left unmapped now rather than given its own inert key.
    "opening_height": "opening_height",

    "drop_to_floor": "drop_to_floor",

    "setup_distance": "setup_distance",

    "vertical_lift": "vertical_lift",

    "hose_distance": "hose_distance",

    "access_path_width": "access_path_width",

    "access_support": "access_support",

    "customer_support": "customer_support",

    "average_output": "average_output",

    "power_source": "power_available",

    "water_available": "water_available",

    "confined_space": "confined_space",

    "ventilation": "ventilation_required",

    "gas_testing": "gas_testing_required",

    "ehs_level": "ehs_restriction",

    "discharge_pit_dimension": "discharge_pit_dimension",

    "customer_pain": "customer_pain_point",

    "crane_available": "crane_available",

    "temperature": "temperature_range",

    "nearest_hub": "nearest_hub",

    "suction_depth": "suction_depth",

    "required_flow": "target_flow"

}



# ====================================
# MAP SALES SURVEY TO OPS INPUTS
# ====================================

def map_sales_survey_to_ops(

        sales_survey

):

    mapped = {}

    for target, attribute in OPS_FIELD_MAP.items():

        mapped[target] = getattr(

            sales_survey,

            attribute,

            None

        )

    return mapped