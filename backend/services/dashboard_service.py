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

from backend.repositories.dashboard_repository import (


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

from backend.repositories.techno_commercial_quote_repository import (
    get_quote_by_ops_selection
)

from backend.repositories.approval_board_repository import (
    get_approval_board_by_quote
)

from backend.services.enquiry_service import EnquiryService




def get_dashboard_data(

    db,

    role,

    received_enquiry_id=None,

    sent_enquiry_id=None

):

    print("\n========== DASHBOARD SERVICE ==========")

    stats = get_dashboard_statistics(db)

    enquiry_data = EnquiryService.get_dashboard_enquiries(

        db,

        role

    )

    received = enquiry_data["received"]

    sent = enquiry_data["sent"]


    # ====================================
    # SELECT CURRENT ENQUIRY
    # ====================================

    selected = None

    if received_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in received

                if enquiry.id == received_enquiry_id

            ),

            None

        )

    if selected is None and sent_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in sent

                if enquiry.id == sent_enquiry_id

            ),

            None

        )

    if selected is None:

        if received:

            selected = received[0]

        elif sent:

            selected = sent[0]


    customer_summary = None

    sales_summary = None

    ops_summary = None

    quote_summary = None


    if selected:

        if selected.customer_request_id:

            customer_summary = build_customer_summary(

                db,

                selected.customer_request_id

            )

            if selected.sales_survey_id:

                sales_summary = build_sales_summary(
                    db,
                    selected.sales_survey_id
                )

                ops_summary = build_ops_summary(
                    db,
                    selected.sales_survey_id
                )

            if selected.ops_selector_id:

                quote_summary = build_quote_summary(
                    db,
                    selected.ops_selector_id
                )


    # ====================================
    # SERIALIZE ENQUIRY
    # ====================================

    selected_enquiry = None

    if selected:

        selected_enquiry = {

            "id":
                selected.id,

            "customer_request_id":
                selected.customer_request_id,

            "sales_survey_id":
                selected.sales_survey_id,

            "ops_selector_id":
                selected.ops_selector_id,

            "dewatering_assessment_id":
                selected.dewatering_assessment_id,

            "quote_id":
                selected.quote_id,

            "approval_board_id":
                selected.approval_board_id,

            "job_creation_id":
                selected.job_creation_id,

            "execution_id":
                selected.execution_id,

            "sender_role":
                selected.sender_role,

            "receiver_role":
                selected.receiver_role,

            "requested_task":
                selected.requested_task,

            "current_module":
                selected.current_module,

            "workflow_status":
                selected.workflow_status,

            "completed":
                selected.completed,

            "created_at":
                selected.created_at

        }


    
    approval_board_summary = None

    if (
        selected_enquiry
        and selected_enquiry.requested_task == "APPROVAL_BOARD"
    ):
        approval_board_summary = get_approval_board_by_quote(
            db,
            selected_enquiry.quote_id
        )


    return {

        "stats": {

            **stats,

            "received_count": len(received),

            "sent_count": len(sent)

        },

        "received_enquiries": received,

        "sent_enquiries": sent,

        "selected_enquiry": selected_enquiry,

        "customer_summary": customer_summary,

        "selected_summary": sales_summary,

        "ops_summary": ops_summary,

        "quote_summary": quote_summary,

        "approval_board_summary": approval_board_summary
        

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




# ====================================
# QUOTE SUMMARY
# ====================================

def build_quote_summary(

    db,

    ops_selection_id

):

    if ops_selection_id is None:

        return None

    quote = get_quote_by_ops_selection(

        db,

        ops_selection_id

    )

    if quote is None:

        return None
    
    print("\n========== QUOTE SUMMARY ==========")
    print("Quote Object :", quote)
    print("ID :", quote.id)
    print("Revision :", quote.revision_number)
    print("Workflow :", quote.workflow_status)
    print("Cleaning :", quote.cleaning_quote)
    print("Budget :", quote.combined_budgetary_value)
    print("===================================")

    return {

        "quote_id": quote.id,

        "revision": quote.revision_number,

        "workflow_status": quote.workflow_status,

        "recommended_machine": quote.recommended_machine,

        "service_configuration": quote.service_configuration,

        "pump_hose_package": quote.pump_hose_package,

        "dewatering_method": quote.dewatering_method,

        "approval_gate": quote.approval_gate,

        "cleaning_quote": quote.cleaning_quote,

        "dewatering_addon": quote.dewatering_addon,

        "combined_budgetary_value": quote.combined_budgetary_value

    }

from backend.services.enquiry_service import EnquiryService




def get_dashboard_data(

    db,

    role,

    received_enquiry_id=None,

    sent_enquiry_id=None

):

    print("\n========== DASHBOARD SERVICE ==========")

    stats = get_dashboard_statistics(db)

    enquiry_data = EnquiryService.get_dashboard_enquiries(

        db,

        role

    )

    received = enquiry_data["received"]

    sent = enquiry_data["sent"]


    # ====================================
    # SELECT CURRENT ENQUIRY
    # ====================================

    selected = None

    if received_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in received

                if enquiry.id == received_enquiry_id

            ),

            None

        )

    if selected is None and sent_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in sent

                if enquiry.id == sent_enquiry_id

            ),

            None

        )

    if selected is None:

        if received:

            selected = received[0]

        elif sent:

            selected = sent[0]


    customer_summary = None

    sales_summary = None

    ops_summary = None

    quote_summary = None


    if selected:

        if selected.customer_request_id:

            customer_summary = build_customer_summary(

                db,

                selected.customer_request_id

            )

            if selected.sales_survey_id:

                sales_summary = build_sales_summary(
                    db,
                    selected.sales_survey_id
                )

                ops_summary = build_ops_summary(
                    db,
                    selected.sales_survey_id
                )

            if selected.ops_selector_id:

                quote_summary = build_quote_summary(
                    db,
                    selected.ops_selector_id
                )


    # ====================================
    # SERIALIZE ENQUIRY
    # ====================================

    selected_enquiry = None

    if selected:

        selected_enquiry = {

            "id":
                selected.id,

            "customer_request_id":
                selected.customer_request_id,

            "sales_survey_id":
                selected.sales_survey_id,

            "ops_selector_id":
                selected.ops_selector_id,

            "dewatering_assessment_id":
                selected.dewatering_assessment_id,

            "quote_id":
                selected.quote_id,

            "approval_board_id":
                selected.approval_board_id,

            "job_creation_id":
                selected.job_creation_id,

            "execution_id":
                selected.execution_id,

            "sender_role":
                selected.sender_role,

            "receiver_role":
                selected.receiver_role,

            "requested_task":
                selected.requested_task,

            "current_module":
                selected.current_module,

            "workflow_status":
                selected.workflow_status,

            "completed":
                selected.completed,

            "created_at":
                selected.created_at

        }


    return {

        "stats": {

            **stats,

            "received_count": len(received),

            "sent_count": len(sent)

        },

        "received_enquiries": received,

        "sent_enquiries": sent,

        "selected_enquiry": selected_enquiry,

        "customer_summary": customer_summary,

        "selected_summary": sales_summary,

        "ops_summary": ops_summary,

        "quote_summary": quote_summary

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


# ====================================
# QUOTE SUMMARY
# ====================================

def build_quote_summary(

    db,

    ops_selection_id

):

    if ops_selection_id is None:

        return None

    quote = get_quote_by_ops_selection(

        db,

        ops_selection_id

    )

    if quote is None:

        return None

    return {

        "quote_id": quote.id,

        "revision": quote.revision_number,

        "workflow_status": quote.workflow_status,

        "recommended_machine": quote.recommended_machine,

        "service_configuration": quote.service_configuration,

        "pump_hose_package": quote.pump_hose_package,

        "dewatering_method": quote.dewatering_method,

        "approval_gate": quote.approval_gate,

        "cleaning_quote": quote.cleaning_quote,

        "dewatering_addon": quote.dewatering_addon,

        "combined_budgetary_value": quote.combined_budgetary_value

    }

from backend.services.enquiry_service import EnquiryService




def get_dashboard_data(

    db,

    role,

    received_enquiry_id=None,

    sent_enquiry_id=None

):

    print("\n========== DASHBOARD SERVICE ==========")

    stats = get_dashboard_statistics(db)

    enquiry_data = EnquiryService.get_dashboard_enquiries(

        db,

        role

    )

    received = enquiry_data["received"]

    sent = enquiry_data["sent"]


    # ====================================
    # SELECT CURRENT ENQUIRY
    # ====================================

    selected = None

    if received_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in received

                if enquiry.id == received_enquiry_id

            ),

            None

        )

    if selected is None and sent_enquiry_id:

        selected = next(

            (

                enquiry

                for enquiry in sent

                if enquiry.id == sent_enquiry_id

            ),

            None

        )

    if selected is None:

        if received:

            selected = received[0]

        elif sent:

            selected = sent[0]


    customer_summary = None

    sales_summary = None

    ops_summary = None

    quote_summary = None


    if selected:

        if selected.customer_request_id:

            customer_summary = build_customer_summary(

                db,

                selected.customer_request_id

            )

            if selected.sales_survey_id:

                sales_summary = build_sales_summary(
                    db,
                    selected.sales_survey_id
                )

                ops_summary = build_ops_summary(
                    db,
                    selected.sales_survey_id
                )

            print("Selected enquiry:", selected.id)
            print("OPS Selector ID:", selected.ops_selector_id)
            print("Quote ID:", selected.quote_id)

            if selected.ops_selector_id:

                quote_summary = build_quote_summary(
                    db,
                    selected.ops_selector_id
                )


    # ====================================
    # SERIALIZE ENQUIRY
    # ====================================

    selected_enquiry = None

    if selected:

        selected_enquiry = {

            "id":
                selected.id,

            "customer_request_id":
                selected.customer_request_id,

            "sales_survey_id":
                selected.sales_survey_id,

            "ops_selector_id":
                selected.ops_selector_id,

            "dewatering_assessment_id":
                selected.dewatering_assessment_id,

            "quote_id":
                selected.quote_id,

            "approval_board_id":
                selected.approval_board_id,

            "job_creation_id":
                selected.job_creation_id,

            "execution_id":
                selected.execution_id,

            "sender_role":
                selected.sender_role,

            "receiver_role":
                selected.receiver_role,

            "requested_task":
                selected.requested_task,

            "current_module":
                selected.current_module,

            "workflow_status":
                selected.workflow_status,

            "completed":
                selected.completed,

            "created_at":
                selected.created_at

        }


    return {

        "stats": {

            **stats,

            "received_count": len(received),

            "sent_count": len(sent)

        },

        "received_enquiries": received,

        "sent_enquiries": sent,

        "selected_enquiry": selected_enquiry,

        "customer_summary": customer_summary,

        "selected_summary": sales_summary,

        "ops_summary": ops_summary,

        "quote_summary": quote_summary

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


# ====================================
# QUOTE SUMMARY
# ====================================

def build_quote_summary(

    db,

    ops_selection_id

):

    if ops_selection_id is None:

        return None

    quote = get_quote_by_ops_selection(

        db,

        ops_selection_id

    )

    if quote is None:

        return None

    return {

        "quote_id": quote.id,

        "revision": quote.revision_number,

        "workflow_status": quote.workflow_status,

        "recommended_machine": quote.recommended_machine,

        "service_configuration": quote.service_configuration,

        "pump_hose_package": quote.pump_hose_package,

        "dewatering_method": quote.dewatering_method,

        "approval_gate": quote.approval_gate,

        "cleaning_quote": quote.cleaning_quote,

        "dewatering_addon": quote.dewatering_addon,

        "combined_budgetary_value": quote.combined_budgetary_value

    }