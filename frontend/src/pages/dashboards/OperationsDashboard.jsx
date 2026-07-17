// ====================================
// IMPORTS
// ====================================

import { useNavigate } from "react-router-dom";

import useDashboard from "../../hooks/useDashboard";

import DashboardStats from "../../components/dashboard/DashboardStats";
import CustomerSummary from "../../components/dashboard/CustomerSummary";
import SalesSummary from "../../components/dashboard/SalesSummary";

import OpsSummary from "../../components/dashboard/OpsSummary";

import QuoteSummary
from "../../components/dashboard/QuoteSummary";
import WorkflowTracker from "../../components/dashboard/WorkflowTracker";


// ====================================
// PAGE
// ====================================

export default function OperationsDashboard(){

    const navigate = useNavigate();

    const {

        dashboard,

        receivedEnquiryId,
        setReceivedEnquiryId,

        sentEnquiryId,
        setSentEnquiryId

    } = useDashboard();

    return(

        <div className="dashboard-page">

            {/* ==================================== */}
            {/* HEADER */}
            {/* ==================================== */}

            <div className="dashboard-header">

                <h1>

                    Operations Dashboard

                </h1>

                <p>

                    Operations Approval Workspace

                </p>

            </div>


            {/* ==================================== */}
            {/* STATS */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <DashboardStats

                    stats={dashboard?.stats}

                />

            </div>


            {/* ==================================== */}
            {/* RECEIVED ENQUIRIES */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Received Enquiries

                </h2>

                <select

                    value={receivedEnquiryId ?? ""}

                    onChange={(event)=>{

                        setReceivedEnquiryId(

                            Number(event.target.value)

                        );

                    }}

                >

                    <option value="">

                        Select Received Enquiry

                    </option>

                    {

                        dashboard?.received_enquiries?.map(

                            enquiry=>(

                                <option

                                    key={enquiry.id}

                                    value={enquiry.id}

                                >

                                    ENQ-{enquiry.id}

                                    {" | "}

                                    CR-{enquiry.customer_request_id}

                                    {" | "}

                                    {enquiry.workflow_status}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            {/* ==================================== */}
            {/* SENT ENQUIRIES */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <h2>

                    Sent Enquiries

                </h2>

                <select

                    value={sentEnquiryId ?? ""}

                    onChange={(event)=>{

                        setSentEnquiryId(

                            Number(event.target.value)

                        );

                    }}

                >

                    <option value="">

                        Select Sent Enquiry

                    </option>

                    {

                        dashboard?.sent_enquiries?.map(

                            enquiry=>(

                                <option

                                    key={enquiry.id}

                                    value={enquiry.id}

                                >

                                    ENQ-{enquiry.id}

                                    {" | "}

                                    CR-{enquiry.customer_request_id}

                                    {" | "}

                                    {enquiry.workflow_status}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            {/* ==================================== */}
            {/* CUSTOMER */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <CustomerSummary

                    summary={

                        dashboard?.customer_summary

                    }

                />

            </div>


            {/* ==================================== */}
            {/* SALES SURVEY */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <SalesSummary

                    summary={

                        dashboard?.selected_summary

                    }

                />

            </div>

            {/* ==================================== */}
            {/* OPS SUMMARY */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <OpsSummary

                    summary={

                        dashboard?.ops_summary

                    }

                />

            </div>



            <div className="dashboard-section">

                <QuoteSummary

                    summary={

                        dashboard?.quote_summary

                    }

                />

            </div>


            {/* ==================================== */}
            {/* WORKFLOW */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <WorkflowTracker

                    enquiry={

                        dashboard?.selected_enquiry

                    }

                />

            </div>




            {/* ==================================== */}
            {/* ACTION */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <button

                    className="dashboard-primary-action"

                    onClick={() => {

                        if(!dashboard?.selected_enquiry){

                            alert(

                                "Please select an enquiry."

                            );

                            return;

                        }

                        localStorage.setItem(

                            "ops_customer_request_id",

                            dashboard.selected_enquiry.customer_request_id

                        );

                        localStorage.setItem(

                            "ops_sales_survey_id",

                            dashboard.selected_enquiry.sales_survey_id

                        );

                        localStorage.setItem(

                            "ops_enquiry_id",

                            dashboard.selected_enquiry.id

                        );

                        navigate(

                            "/ops-approval"

                        );

                    }}

                >

                    Open OPS Approval

                </button>



                <button

                    className="dashboard-primary-action"

                    style={{

                        marginTop:"16px"

                    }}

                    onClick={()=>{

                        if(

                            !dashboard?.selected_enquiry

                        ){

                            alert(

                                "Please select an enquiry."

                            );

                            return;

                        }

                        localStorage.setItem(

                            "ops_selector_customer_request_id",

                            dashboard.selected_enquiry.customer_request_id

                        );

                        localStorage.setItem(

                            "ops_selector_sales_survey_id",

                            dashboard.selected_enquiry.sales_survey_id

                        );

                        localStorage.setItem(

                            "ops_selector_enquiry_id",

                            dashboard.selected_enquiry.id

                        );

                        navigate(

                            "/ops-selector"

                        );

                    }}

                >

                    Open OPS Selector

                </button>

            </div>

        </div>

    );

}