from backend.models.customer_requests import CustomerRequest
from backend.models.sales_survey import SalesSurvey
from backend.models.ops_selector import OpsSelection

from backend.models.techno_commercial_quote import Quote

from backend.services.status_service import (

    WORKFLOW_STATUS

)


def get_dashboard_requests(
    db,
    start_customer_id,
    limit=5
):
    
    customers = (

                    db.query(

                        CustomerRequest

                    )

                    .filter(

                        CustomerRequest.id >= start_customer_id

                    )

                    .order_by(

                        CustomerRequest.id

                    )

                    .limit(

                        limit

                    )

                    .all()

                )
    
    print("\n========== DASHBOARD ==========")

    print(

        "Loaded Requests:",

        len(customers)

    )

    for customer in customers:

        print(

            f"CR-{customer.id}",

            customer.company_name,

            customer.status

        )

    print("===============================\n")

    return customers



def get_customer_surveys(

    db,

    customer_request_id

):

    surveys = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.customer_request_id ==

            customer_request_id

        )

        .order_by(

            SalesSurvey.id

        )

        .all()

    )

    print(

        f"Customer {customer_request_id}"

    )

    print(

        "Sales Surveys:",

        [survey.id for survey in surveys]

    )

    return surveys


def get_sales_summary(

    db,

    sales_survey_id

):

    survey = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.id ==

            sales_survey_id

        )

        .first()

    )

    print(

        "\n----- SALES SUMMARY -----"

    )

    print(

        "Survey ID:",

        sales_survey_id

    )

    print(

        "Found:",

        survey is not None

    )

    if survey:

        print(

            "Customer:",

            survey.customer_request_id

        )

    print(

        "-------------------------\n"

    )

    return survey


def get_ops_summary(

    db,

    sales_survey_id

):

    ops = (

        db.query(

            OpsSelection

        )

        .filter(

            OpsSelection.sales_survey_id ==

            sales_survey_id

        )

        .first()

    )

    print(

        "\n----- OPS SUMMARY -----"

    )

    print(

        "Survey ID:",

        sales_survey_id

    )

    print(

        "Found:",

        ops is not None

    )

    if ops:

        print(

            "Ops ID:",

            ops.id

        )

    print(

        "-----------------------\n"

    )

    return ops



def build_ops_summary(

    db,

    sales_survey_id

):

    ops = get_ops_summary(

        db,

        sales_survey_id

    )

    if ops is None:

        return None

    summary = {

        "ops_id":

            ops.id,

        "engine_version":

            ops.ops_engine_version,

        "doability":

            ops.doability,

        "service_configuration":

            ops.service_configuration,

        "recommended_machine":

            ops.recommended_machine,

        "pump_hose_package":

            ops.pump_hose_package,

        "accessories":

            ops.accessories,

        "recommended_package":

            ops.recommended_package,

        "mobilisation_days":

            ops.mobilisation_days,

        "setup_days":

            ops.setup_days,

        "execution_days":

            ops.execution_days,

        "demob_days":

            ops.demob_days,

        "total_job_days":

            ops.total_job_days,

        "manpower_required":

            ops.manpower_required,

        "approval_gate":

            ops.approval_gate,

        "internal_next_action":

            ops.internal_next_action,

        "selection_reason":

            ops.selection_reason

    }

    print(

        "\n========== OPS SUMMARY SERVICE =========="

    )

    print(

        "Ops:",

        ops.id

    )

    print(

        "Fields:",

        list(

            summary.keys()

        )

    )

    print(

        "=========================================\n"

    )

    return summary


# ====================================
# QUOTE SUMMARY
# ====================================

def build_quote_summary(

    db,

    sales_survey_id

):

    ops = (

        db.query(

            OpsSelection

        )

        .filter(

            OpsSelection.sales_survey_id ==

            sales_survey_id

        )

        .order_by(

            OpsSelection.id.desc()

        )

        .first()

    )

    if ops is None:

        return None

    quote = (

        db.query(

            Quote

        )

        .filter(

            Quote.ops_selection_id ==

            ops.id

        )

        .order_by(

            Quote.revision_number.desc()

        )

        .first()

    )

    if quote is None:

        return None

    return {

        "quote_id":

            quote.id,

        "revision":

            quote.revision_number,

        "workflow_status":

            quote.workflow_status,

        "recommended_machine":

            quote.recommended_machine,

        "service_configuration":

            quote.service_configuration,

        "pump_hose_package":

            quote.pump_hose_package,

        "dewatering_method":

            quote.dewatering_method,

        "approval_gate":

            quote.approval_gate,

        "cleaning_quote":

            quote.cleaning_quote,

        "dewatering_addon":

            quote.dewatering_addon,

        "combined_budgetary_value":

            quote.combined_budgetary_value

    }


# ====================================
# WORKFLOW COUNT
# ====================================

def count_workflow_stage(

    customers,

    stage

):

    target_index = WORKFLOW_STATUS.index(

        stage

    )

    count = 0

    for customer in customers:

        if customer.status not in WORKFLOW_STATUS:

            continue

        current_index = WORKFLOW_STATUS.index(

            customer.status

        )

        if current_index >= target_index:

            count += 1

    print(

        f"{stage}:",

        count

    )

    return count


# ====================================
# DASHBOARD STATISTICS
# ====================================

from sqlalchemy import func


def get_dashboard_statistics(

    db

):

    customers = (

        db.query(

            CustomerRequest

        )

        .all()

    )

    stats = {

        "customer_requests":

            len(

                customers

            ),

        "requested":

            count_workflow_stage(

                customers,

                "REQUESTED"

            ),

        "survey_completed":

            count_workflow_stage(

                customers,

                "SURVEY_COMPLETED"

            ),

        "ops_completed":

            count_workflow_stage(

                customers,

                "OPS_COMPLETED"

            ),

        "quote_created":

            count_workflow_stage(

                customers,

                "MANAGEMENT_APPROVAL"

            ),

        "job_in_progress":

            count_workflow_stage(

                customers,

                "JOB_IN_PROGRESS"

            )

    }

    print("\n========== DASHBOARD STATS ==========")

    print(

        "Total Requests:",

        stats["customer_requests"]

    )

    print(

        "Requested:",

        stats["requested"]

    )

    print(

        "Survey Completed:",

        stats["survey_completed"]

    )

    print(

        "Ops Completed:",

        stats["ops_completed"]

    )

    print(

        "Quote Created:",

        stats["quote_created"]

    )

    print(

        "Job In Progress:",

        stats["job_in_progress"]

    )

    print("=====================================\n")

    return {

        "customer_requests": stats["customer_requests"],

        "requested": stats["requested"],

        "survey_completed": stats["survey_completed"],

        "ops_completed": stats["ops_completed"],

        "quote_created": stats["quote_created"],

        "job_in_progress": stats["job_in_progress"]

    }


# ====================================
# CUSTOMER NAVIGATOR
# ====================================

def get_dashboard_customer_list(

    db

):

    customers = (

        db.query(

            CustomerRequest

        )

        .order_by(

            CustomerRequest.id

        )

        .all()

    )

    print(

        "\n========== DASHBOARD NAVIGATOR =========="

    )

    print(

        "Total Customers:",

        len(

            customers

        )

    )

    print(

        "Customer IDs:",

        [

            customer.id

            for customer in customers

        ]

    )

    print(

        "=========================================\n"

    )

    return customers




# ====================================
# CUSTOMER SUMMARY
# ====================================

# ====================================
# CUSTOMER SUMMARY
# ====================================

def get_customer_summary(

    db,

    customer_request_id

):

    customer = (

        db.query(

            CustomerRequest

        )

        .filter(

            CustomerRequest.id ==

            customer_request_id

        )

        .first()

    )

    print(

        "\n========== CUSTOMER SUMMARY =========="

    )

    print(

        "Customer Request:",

        customer_request_id

    )

    print(

        "Found:",

        customer is not None

    )

    if customer:

        print(

            "Company:",

            customer.company_name

        )

        print(

            "Status:",

            customer.status

        )

    print(

        "======================================\n"

    )

    return customer


# ====================================
# DASHBOARD SURVEY WINDOW
# ====================================

def get_dashboard_surveys(

    db,

    customer_request_id,

    start_survey_id,

    limit=5

):

    query = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.customer_request_id ==

            customer_request_id

        )

    )

    if start_survey_id is not None:

        query = query.filter(

            SalesSurvey.id >=

            start_survey_id

        )

    surveys = (

        query

        .order_by(

            SalesSurvey.id

        )

        .limit(

            limit

        )

        .all()

    )

    print(

        "\n========== DASHBOARD SURVEY WINDOW =========="

    )

    print(

        "Customer:",

        customer_request_id

    )

    print(

        "Start Survey:",

        start_survey_id

    )

    print(

        "Visible Surveys:",

        [survey.id for survey in surveys]

    )

    print(

        "=============================================\n"

    )

    return surveys


# ====================================
# SURVEY NAVIGATOR
# ====================================

def get_dashboard_survey_list(

    db,

    customer_request_id

):

    surveys = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.customer_request_id ==

            customer_request_id

        )

        .order_by(

            SalesSurvey.id

        )

        .all()

    )

    print(

        "\n========== SURVEY NAVIGATOR =========="

    )

    print(

        "Survey IDs:",

        [survey.id for survey in surveys]

    )

    print(

        "======================================\n"

    )

    return surveys


# ====================================
# SALES SURVEY SUMMARY
# ====================================

def get_sales_survey_summary(

    db,

    sales_survey_id

):

    survey = (

        db.query(

            SalesSurvey

        )

        .filter(

            SalesSurvey.id ==

            sales_survey_id

        )

        .first()

    )

    print(

        "\n========== SALES SURVEY SUMMARY =========="

    )

    

    print("======================\n")

    print("Material Category:", survey.material_category)

    print(survey.__table__.columns.keys())

    print(

        "Survey:",

        sales_survey_id

    )

    print(

        "Found:",

        survey is not None

    )

    if survey:

        print(

            "Customer:",

            survey.customer_request_id

        )

        print(

            "Tank:",

            survey.tank_type

        )

        print(

            "Job:",

            survey.job_type

        )

    print(

        "==========================================\n"

    )

    return survey