# ====================================
# GEOMETRY CALCULATIONS
# ====================================

def calculate_geometry(customer):

    """
    Calculates basic tank geometry using the
    approximate dimensions stored in the
    Customer Request.

    Returns a dictionary.
    """

    # --------------------------------
    # INPUTS
    # --------------------------------

    length = customer.approx_length_dia
    width = customer.approx_width
    depth = customer.approx_depth


    # --------------------------------
    # VALIDATION
    # --------------------------------

    if (

        length is None or
        width is None or
        depth is None

    ):

        return {

            "tank_volume": None,
            "working_volume": None,
            "sludge_volume": None,
            "surface_area": None

        }


    # --------------------------------
    # CALCULATIONS
    # --------------------------------

    tank_volume = (

        length *
        width *
        depth

    )

    working_volume = (

        tank_volume * 0.90

    )

    sludge_volume = (

        tank_volume * 0.10

    )

    surface_area = (

        length *
        width

    )


    # --------------------------------
    # OUTPUT
    # --------------------------------

    return {

        "tank_volume": round(tank_volume, 2),

        "working_volume": round(working_volume, 2),

        "sludge_volume": round(sludge_volume, 2),

        "surface_area": round(surface_area, 2)

    }