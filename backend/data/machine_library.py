# ====================================
# MACHINE LIBRARY
# ====================================
#
# Backend representation of the
# Machine Library Excel sheet.
#
# This file contains NO business logic.
#
# It is only a structured data source
# used by the Ops Engine.
#
# ====================================

MACHINE_LIBRARY = [

    # ====================================
    # SCE COMPACT ELECTRIC ROVER
    # ====================================

    {

        "code": "SCE-V1-M2",

        "name": "SCE Compact Electric Rover",

        "service_configuration": "SC-COMPACT",

        "power_type": "Electric",

        "minimum_width": 450,

        "minimum_height": 450,

        "base_output_per_day": 42,

        "recommended_max_volume": 270,

        "pump_package": "3HP / 2 inch pump",

        "hose_size": "2 inch",

        "preferred_job_types": [

            "Tank / Pit / Sump",

            "Drain / Channel",

            "Clarifier / ETP / STP"

        ],

        "preferred_materials": [

            "Watery slurry",

            "Pumpable sludge",

            "Settled sludge"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "Low",

        "crew": 4,

        "approval_gate": "Ops Review",

        "accessories": [

            "Basic hose kit",

            "Console",

            "Lighting",

            "Suction mouth"

        ],

        "description":

        "Compact robotic sludge cleaning for small pits, tanks and drains.",

        "active": True

    },


    # ====================================
    # SCH-300
    # ====================================

    {

        "code": "SCH-300-PBM",

        "name": "SCH-300 / SCH-PBM Truck Mounted Hydraulic Sludge Machine",

        "service_configuration": "SC-HEAVY",

        "power_type": "Hydraulic / Truck Mounted",

        "minimum_width": 500,

        "minimum_height": 500,

        "base_output_per_day": 60,

        "recommended_max_volume": 750,

        "pump_package": "10HP / 4 inch pump",

        "hose_size": "4 inch",

        "preferred_job_types": [

            "Tank / Pit / Sump",

            "Industrial Tank",

            "Clarifier / ETP / STP"

        ],

        "preferred_materials": [

            "Pumpable sludge",

            "Settled sludge",

            "Heavy sludge / scale"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "Medium",

        "crew": 6,

        "approval_gate": "Ops Review",

        "accessories": [

            "Truck-mounted hydraulic package",

            "Powerpack",

            "Winch",

            "4 inch hose kit",

            "Cutter/drum option",

            "Safety kit"

        ],

        "description":

        "Truck mounted hydraulic sludge cleaning configuration.",

        "active": True

    },


    # ====================================
    # SCH V3
    # ====================================

    {

        "code": "SCH-V3",

        "name": "SCH V3 Hydraulic Crawler",

        "service_configuration": "SC-CUTTER",

        "power_type": "Hydraulic",

        "minimum_width": 450,

        "minimum_height": 450,

        "base_output_per_day": 45,

        "recommended_max_volume": 220,

        "pump_package": "5HP / 4 inch pump",

        "hose_size": "4 inch",

        "preferred_job_types": [

            "Industrial Tank",

            "Tank / Pit / Sump"

        ],

        "preferred_materials": [

            "Sticky sludge",

            "Settled sludge",

            "Heavy sludge / scale"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "Medium",

        "crew": 5,

        "approval_gate": "Ops Review",

        "accessories": [

            "Hydraulic powerpack",

            "Roller",

            "Cutter",

            "Hose kit",

            "Safety kit"

        ],

        "description":

        "Hydraulic crawler for cutter-assisted sludge cleaning.",

        "active": True

    },


    # ====================================
    # RHINO
    # ====================================

    {

        "code": "RHINO",

        "name": "RHINO Heavy Sludge / Scale Cleaner",

        "service_configuration": "SC-HEAVY",

        "power_type": "Hydraulic + Electric",

        "minimum_width": 1100,

        "minimum_height": 1500,

        "base_output_per_day": 210,

        "recommended_max_volume": 1500,

        "pump_package": "10HP / 4 inch pump",

        "hose_size": "4 inch",

        "preferred_job_types": [

            "Clarifier / ETP / STP",

            "Industrial Tank",

            "Tank / Pit / Sump"

        ],

        "preferred_materials": [

            "Heavy sludge / scale",

            "Pumpable sludge",

            "Settled sludge"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "High",

        "crew": 7,

        "approval_gate": "Ops + Engineering Review",

        "accessories": [

            "Heavy crawler",

            "Round cutter",

            "10HP pump",

            "Safety kit"

        ],

        "description":

        "Heavy duty sludge and scale removal platform.",

        "active": True

    },


    # ====================================
    # VARAHA 700
    # ====================================

    {

        "code": "VARAHA-700",

        "name": "Varaha 700 Heavy Cutter / High Volume",

        "service_configuration": "SC-HEAVY",

        "power_type": "Hydraulic",

        "minimum_width": 750,

        "minimum_height": 1100,

        "base_output_per_day": 90,

        "recommended_max_volume": 700,

        "pump_package": "40HP / 4 inch pump",

        "hose_size": "4 inch",

        "preferred_job_types": [

            "Industrial Tank",

            "Hot Zone / Furnace / Ash",

            "Tank / Pit / Sump"

        ],

        "preferred_materials": [

            "Heavy sludge / scale",

            "Ash / abrasive slurry",

            "Settled sludge"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "High",

        "crew": 7,

        "approval_gate": "Engineering Review",

        "accessories": [

            "Heavy cutter",

            "High volume pump",

            "Powerpack",

            "Hose kit"

        ],

        "description":

        "High volume heavy cutter configuration.",

        "active": True

    },


    # ====================================
    # VARAHA PIPELINE
    # ====================================

    {

        "code": "VARAHA-500-PBM",

        "name": "Varaha 500 Pipeline Cleaning Machine",

        "service_configuration": "SC-PIPELINE",

        "power_type": "Hydraulic",

        "minimum_width": 500,

        "minimum_height": 500,

        "base_output_per_day": 0,

        "recommended_max_volume": 0,

        "pump_package": "Pipeline pump package",

        "hose_size": "Pipeline hose",

        "preferred_job_types": [

            "Pipeline / Conduit"

        ],

        "preferred_materials": [

            "Pipeline deposits",

            "Heavy sludge / scale"

        ],

        "debris_tolerance": "None",

        "setup_complexity": "High",

        "crew": 5,

        "approval_gate": "Engineering Review",

        "accessories": [

            "Pipeline cutter",

            "Hydraulic powerpack",

            "Cable",

            "Hose kit"

        ],

        "description":

        "Dedicated pipeline cleaning system.",

        "active": True

    },


    # ====================================
    # MATSYA DIESEL
    # ====================================

    {

        "code": "MATSYA-DIESEL",

        "name": "Matsya Diesel Operated Aqua Machine",

        "service_configuration": "SC-AQUA",

        "power_type": "Diesel",

        "minimum_width": 0,

        "minimum_height": 0,

        "base_output_per_day": 360,

        "recommended_max_volume": 3000,

        "pump_package": "Aqua pump package",

        "hose_size": "Floating hose",

        "preferred_job_types": [

            "Pond / Lagoon",

            "Open Channel / Intake Well"

        ],

        "preferred_materials": [

            "Watery slurry",

            "Pumpable sludge",

            "Pond silt",

            "Ash / abrasive slurry"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "Medium",

        "crew": 5,

        "approval_gate": "Engineering Review",

        "accessories": [

            "Floating platform",

            "Pump",

            "Discharge hose",

            "Retrieval kit"

        ],

        "description":

        "Diesel operated floating sludge removal platform.",

        "active": True

    },


    # ====================================
    # MATSYA ELECTRIC
    # ====================================

    {

        "code": "MATSYA-ELECTRIC",

        "name": "Matsya Electric Cable Operated Aqua Machine",

        "service_configuration": "SC-AQUA",

        "power_type": "Electric",

        "minimum_width": 0,

        "minimum_height": 0,

        "base_output_per_day": 360,

        "recommended_max_volume": 3000,

        "pump_package": "Aqua pump package",

        "hose_size": "Floating hose",

        "preferred_job_types": [

            "Pond / Lagoon",

            "Open Channel / Intake Well"

        ],

        "preferred_materials": [

            "Watery slurry",

            "Pumpable sludge",

            "Pond silt"

        ],

        "debris_tolerance": "Minor screenable debris",

        "setup_complexity": "Medium",

        "crew": 5,

        "approval_gate": "Engineering Review",

        "accessories": [

            "Floating platform",

            "Cable control",

            "Pump",

            "Retrieval kit"

        ],

        "description":

        "Electric floating sludge removal platform.",

        "active": True

    },


    # ====================================
    # MATSYA BATHYMETRIC
    # ====================================

    {

        "code": "MATSYA-BATHY",

        "name": "Matsya Bathymetric Survey Machine",

        "service_configuration": "SC-SURVEY",

        "power_type": "Survey",

        "minimum_width": 0,

        "minimum_height": 0,

        "base_output_per_day": 0,

        "recommended_max_volume": 0,

        "pump_package": "Survey only",

        "hose_size": None,

        "preferred_job_types": [

            "Bathymetric Survey / Pre-Survey",

            "Pond / Lagoon",

            "Open Channel / Intake Well"

        ],

        "preferred_materials": [

            "Surveying",

            "Waterbody depth mapping",

            "Pond silt assessment"

        ],

        "debris_tolerance": None,

        "setup_complexity": "Low",

        "crew": 2,

        "approval_gate": "Ops + Engineering Review",

        "accessories": [

            "GPS",

            "Depth sensor",

            "Laptop",

            "Retrieval kit"

        ],

        "description":

        "Survey only machine.",

        "active": True

    }

]