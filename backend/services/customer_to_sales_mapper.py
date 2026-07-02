# ====================================
# IMPORTS
# ====================================

import math


# ====================================
# NEAREST HUB LOGIC
# ====================================

def determine_nearest_hub(

        location

):

    """
    Temporary hub suggestion.

    This will later be upgraded
    to GIS based routing.
    """

    if not location:

        return "To Be Determined"


    location = location.lower()


    hub_mapping = {

        "jurong": "Jurong Hub",

        "tuas": "Tuas Hub",

        "changi": "Changi Hub",

        "woodlands": "Woodlands Hub"

    }


    for keyword, hub in hub_mapping.items():

        if keyword in location:

            return hub


    return "Main Hub"


# ====================================
# MATERIAL CATEGORY LOGIC
# ====================================

def determine_material_category(

        observed_material

):

    if not observed_material:

        return "Unknown"


    material = observed_material.lower()


    sludge_keywords = [

        "sludge",

        "biosolids",

        "effluent"

    ]


    if any(

        keyword in material

        for keyword in sludge_keywords

    ):

        return "Sludge"


    return "General Waste"


# ====================================
# CUSTOMER REQUEST
# TO SALES SURVEY MAPPER
# ====================================

def map_customer_to_sales(

        customer

):

    return {

        "customer": {

            "company_name":

            customer.company_name,


            "plant_site_location":

            customer.plant_site_location,


            "contact_person":

            customer.contact_person,


            "urgency":

            customer.urgency,


            "nearest_hub":

            determine_nearest_hub(

                customer.plant_site_location

            )

        },


        "job": {

            "material_category":

            determine_material_category(

                customer.observed_material

            )

        },


        "geometry": {

            "length_diameter":

            customer.approx_length_dia,


            "width":

            customer.approx_width

        },


        "insights": {

            "customer_pain_point":

            customer.pain_point

        }

    }