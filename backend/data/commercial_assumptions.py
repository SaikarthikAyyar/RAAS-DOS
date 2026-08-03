# ====================================
# MOBILISATION
# ====================================

MOBILISATION_RATE = 35000

SETUP_RATE = 25000

DEMOBILISATION_RATE = 25000


# ====================================
# COMMERCIAL
# ====================================

OVERHEAD_PERCENTAGE = 0.15

MARGIN_PERCENTAGE = 0.25

CONTINGENCY_PERCENTAGE = 0.10


# ====================================
# SERVICE RATES
# ====================================

SERVICE_RATES = {

    "SC-COMPACT": 45000,

    "SC-CUTTER": 65000,

    "SC-HEAVY": 85000,

    "SC-PIPELINE": 95000,

    "SC-AQUA": 75000,

    "SC-SURVEY": 40000

}


# ====================================
# ADD-ONS
# ====================================

PUMP_ADDON_RATE = 10000

DOCUMENTATION_BUFFER = 15000

ACCESS_SUPPORT_BUFFER = 25000


# ====================================
# DEWATERING (INR per m3 of survey volume)
# The one genuine min/max driver in the quote
# range - dewatering_method_min/max on OpsSelection
# picks which rate applies to each bound.
# ====================================

DEWATERING_RATE = {

    "FILTER_PRESS": 150,

    "CENTRIFUGE": 220

}