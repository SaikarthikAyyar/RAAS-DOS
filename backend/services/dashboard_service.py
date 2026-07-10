from backend.repositories.dashboard_repository import (

    build_ops_summary,
    get_dashboard_requests,

    get_customer_surveys,

    get_sales_summary,

    get_ops_summary,

    get_dashboard_statistics,

    get_dashboard_customer_list,

    get_customer_summary, 

    get_sales_survey_summary,

    get_dashboard_surveys,

    get_dashboard_survey_list

)


def get_dashboard_data(

    db,

    start_customer_id,

    selected_customer_id=None,

    selected_sales_survey_id=None

):

    print("\n========== DASHBOARD SERVICE ==========")

    customers = get_dashboard_requests(

        db,

        start_customer_id

    )

    stats = get_dashboard_statistics(

        db

    )

    print(

        "Statistics Loaded:",

        stats

    )

    print(

        "Customer IDs:",

        [customer.id for customer in customers]

    )

    if not customers:

        print("No customer requests found.")

        return {

            "customers": [],

            "selected_customer": None,

            "surveys": [],

            "selected_survey": None,

            "ops_summary": None

        }

    if selected_customer_id is None:

        selected_customer_id = customers[0].id



    customer_summary = build_customer_summary(

        db,

        selected_customer_id

    )

    print(

        "Customer Summary Loaded:",

        customer_summary is not None

    )

    print(

        "Selected Customer:",

        selected_customer_id

    )

    survey_list = get_dashboard_survey_list_request(

        db,

        selected_customer_id

    )

    if selected_sales_survey_id is None and survey_list:

        selected_sales_survey_id = survey_list[0].id

    surveys = get_dashboard_surveys(

        db,

        selected_customer_id,

        selected_sales_survey_id

    )

    print(

        "Survey IDs:",

        [survey.id for survey in surveys]

    )

    if surveys:

        if selected_sales_survey_id is None:

            selected_sales_survey_id = surveys[-1].id

    else:

        selected_sales_survey_id = None

    print(

        "Selected Survey:",

        selected_sales_survey_id

    )

    sales_summary = None

    ops_summary = None

    if selected_sales_survey_id is not None:

        sales_summary = build_sales_summary(

            db,

            selected_sales_survey_id

        )

        ops_summary = build_ops_summary(

            db,

            selected_sales_survey_id

        )

    print("Dashboard Loaded Successfully")

    print("=======================================\n")

    return {

        "stats": stats,

        "customers": customers,

        "customer_summary": customer_summary,

        "selected_customer": selected_customer_id,

        "survey_navigator": survey_list,

        "visible_surveys": surveys,

        "selected_summary": sales_summary,

        "ops_summary": ops_summary

    }

# ====================================
# CUSTOMER NAVIGATOR
# ====================================

def get_dashboard_customer_list_request(

    db

):

    customers = get_dashboard_customer_list(

        db

    )

    print(

        "\n========== DASHBOARD NAVIGATOR SERVICE =========="

    )

    print(

        "Customers Returned:",

        len(

            customers

        )

    )

    print(

        "===============================================\n"

    )

    return customers


# ====================================
# SURVEY NAVIGATOR
# ====================================

def get_dashboard_survey_list_request(

    db,

    customer_request_id

):

    surveys = get_dashboard_survey_list(

        db,

        customer_request_id

    )

    print(

        "\n========== SURVEY NAVIGATOR SERVICE =========="

    )

    print(

        "Surveys Returned:",

        len(

            surveys

        )

    )

    print(

        "=============================================\n"

    )

    return surveys

# ====================================
# CUSTOMER SUMMARY
# ====================================

def build_customer_summary(

    db,

    customer_request_id

):

    customer = get_customer_summary(

        db,

        customer_request_id

    )

    if customer is None:

        return None

    summary = {

        "customer_request_id":

            customer.id,

        "company_name":

            customer.company_name,

        "plant_site_location":

            customer.plant_site_location,

        "contact_person":

            customer.contact_person,

        "contact_number":

            customer.contact_number,

        "nearest_city_hub":

            customer.nearest_city_hub,

        "service_requirement":

            customer.service_requirement_type,

        "urgency":

            customer.urgency,

        "status":

            customer.status

    }

    print(

        "\n========== CUSTOMER SUMMARY SERVICE =========="

    )

    print(

        "Customer:",

        customer.id

    )

    print(

        "Fields:",

        list(

            summary.keys()

        )

    )

    print(

        "==============================================\n"

    )

    return summary
    


# ====================================
# SALES SURVEY SUMMARY
# ====================================

def build_sales_summary(

    db,

    sales_survey_id

):

    survey = get_sales_survey_summary(

        db,

        sales_survey_id

    )

    if survey is None:

        return None

    summary = {

        "survey_id":

            survey.id,

        "survey_date":

            survey.survey_date,

        "workflow":

            survey.status,

        "tank_type":

            survey.tank_type,

        "job_type":

            survey.job_type,

        "material":

            survey.material_category,

        "sludge":

            survey.sludge_type,

        "estimated_volume":

            survey.estimated_volume,

        "average_output":

            survey.average_output,

        "solids":

            survey.solids_pct,

        "hazard":

            survey.hazard_level,

        "pumpable":

            survey.pumpable

    }

    print(

        "\n========== SALES SUMMARY SERVICE =========="

    )

    print(

        "Survey:",

        survey.id

    )

    print(

        "Fields:",

        list(

            summary.keys()

        )

    )

    print(

        "===========================================\n"

    )

    return summary