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

    "flow_after_agitation": "flow_after_agitation",

    "cleaning_date": "cleaning_date",

    "cleaning_frequency": "cleaning_frequency",

    "tank_type": "tank_type",

    "tank_length": "tank_length",

    "tank_width": "tank_width",

    "tank_depth": "tank_depth",

    "opening_length": "opening_length",

    "opening_width": "opening_width",

    "opening_height": "height_from_ground",

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

    "customer_pain": "customer_pain_point"

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