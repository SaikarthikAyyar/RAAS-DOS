# ====================================
# IMPORTS
# ====================================

from fastapi import APIRouter

from fastapi import Depends

from sqlalchemy.orm import Session

from backend.database.connection import get_db

from backend.services.dashboard_service import (

    get_dashboard_data,

    get_dashboard_customer_list_request

)

# ====================================
# ROUTER
# ====================================

router = APIRouter()

# ====================================
# DASHBOARD
# ====================================

@router.get(

    "/dashboard"

)

def dashboard(

    start_customer_id: int,

    selected_customer_id: int | None = None,

    selected_sales_survey_id: int | None = None,

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== DASHBOARD API =========="

    )

    print(

        "Start Customer:",

        start_customer_id

    )

    print(

        "Selected Customer:",

        selected_customer_id

    )

    print(

        "Selected Survey:",

        selected_sales_survey_id

    )

    dashboard = get_dashboard_data(

        db,

        start_customer_id,

        selected_customer_id,

        selected_sales_survey_id

    )

    print(

        "Dashboard Response Ready"

    )

    print(

        "===================================\n"

    )

    return dashboard

# ====================================
# CUSTOMER NAVIGATOR
# ====================================

@router.get(

    "/dashboard/customer-list"

)

def dashboard_customer_list(

    db: Session = Depends(

        get_db

    )

):

    print(

        "\n========== DASHBOARD NAVIGATOR API =========="

    )

    customers = get_dashboard_customer_list_request(

        db

    )

    print(

        "Navigator Response Ready"

    )

    print(

        "=============================================\n"

    )

    return customers