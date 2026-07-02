# ====================================
# IMPORTS
# ====================================

from PIL import report

from backend.reporting.report_models import (
    ReportData
)

from backend.reporting.calculations.engine import (
    calculate_report
)
from backend.reporting.report_sections import computations


# ====================================
# BUILD REPORT DATA
# ====================================

def build_report(

    customer,
    survey,
    media

):

    report = ReportData()

    # ====================================
    # CUSTOMER
    # ====================================

    report.customer.company_name = customer.company_name
    report.customer.plant_site_location = customer.plant_site_location
    report.customer.contact_person = customer.contact_person
    report.customer.contact_number = customer.contact_number
    report.customer.nearest_city_hub = customer.nearest_city_hub
    report.customer.urgency = customer.urgency

    # ====================================
    # REQUIREMENT
    # ====================================

    report.requirement.service_requirement_type = (
        customer.service_requirement_type
    )

    report.requirement.observed_material = (
        customer.observed_material
    )

    report.requirement.estimated_quantity_known = (
        customer.estimated_quantity_known
    )

    report.requirement.tank_type = (
        customer.tank_type
    )

    report.requirement.approx_length_dia = (
        customer.approx_length_dia
    )

    report.requirement.approx_width = (
        customer.approx_width
    )

    report.requirement.approx_depth = (
        customer.approx_depth
    )

    report.requirement.access_opening_type = (
        customer.access_opening_type
    )

    report.requirement.can_place_equipment_nearby = (
        customer.can_place_equipment_nearby
    )

    report.requirement.quote_basis = (
        customer.quote_basis
    )

    report.requirement.pain_point = (
        customer.pain_point
    )

    # ====================================
    # SALES SURVEY
    # ====================================

    if survey:

        report.survey = survey
    
        # --------------------------------
    # COMPUTATIONS
    # --------------------------------

    # --------------------------------
# COMPUTATIONS
# --------------------------------

    computations = calculate_report(

        customer,

        survey

    )

    report.computations.tank_volume = (
        computations.get("tank_volume")
    )


    report.computations.working_volume = (
    computations.get("working_volume")
)

    report.computations.sludge_volume = (
        computations.get("sludge_volume")
    )


    report.computations.surface_area = (
        computations.get("surface_area")
    )

    report.computations.estimated_duration = (
        computations.get("estimated_duration")
    )

    report.computations.estimated_manpower = (
        computations.get("estimated_manpower")
    )

    report.computations.pump_capacity = (
        computations.get("pump_capacity")
    )

    report.computations.dewatering_required = (
        computations.get("dewatering_required")
    )

    # --------------------------------
# SAFETY
# --------------------------------

    if survey:

        report.safety.opening_length = survey.opening_length

        report.safety.opening_width = survey.opening_width

        report.safety.height_from_ground = survey.height_from_ground

        report.safety.drop_to_floor = survey.drop_to_floor

        report.safety.setup_distance = survey.setup_distance

        report.safety.vertical_lift = survey.vertical_lift

        report.safety.hose_distance = survey.hose_distance

        report.safety.access_path_width = survey.access_path_width

        report.safety.scaffolding_needed = survey.scaffolding_needed

        report.safety.crane_available = survey.crane_available

        report.safety.power_available = survey.power_available

        report.safety.water_available = survey.water_available

        report.safety.confined_space = survey.confined_space

        report.safety.ventilation_required = survey.ventilation_required

        report.safety.gas_testing_required = survey.gas_testing_required

        report.safety.ehs_restriction = survey.ehs_restriction

    # ====================================
    # MEDIA
    # ====================================

    if media:

        report.media.photos = [
            item
            for item in media
            if item.media_type == "photo"
        ]

        report.media.videos = [
            item
            for item in media
            if item.media_type == "video"
        ]

        report.media.layouts = [
            item
            for item in media
            if item.media_type == "layout"
        ]

        for photo in report.media.photos:
            print(photo.file_path)

        for layout in report.media.layouts:
            print(layout.file_path)

        for video in report.media.videos:
            print(video.file_path)
        
        if media:

            for item in media:
                print(
                    item.media_type,
                    item.file_name,
                    item.file_path
                )

    # ====================================
    # METADATA
    # ====================================

    report.metadata.customer_request_id = customer.id

    if survey:

        report.metadata.sales_survey_id = survey.id

    return report