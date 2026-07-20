// ====================================
// IMPORTS
// ====================================

import useDashboard from "../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

import DashboardStats
from "../../components/dashboard/DashboardStats";

import CustomerSummary
from "../../components/dashboard/CustomerSummary";

import SalesSummary
from "../../components/dashboard/SalesSummary";

import OpsSummary
from "../../components/dashboard/OpsSummary";

import QuoteSummary
from "../../components/dashboard/QuoteSummary";

import WorkflowTracker
from "../../components/dashboard/WorkflowTracker";





// ====================================
// PAGE
// ====================================

export default function ManagementDashboard(){



    const navigate = useNavigate();

    const{

        dashboard,

        receivedEnquiryId,
        setReceivedEnquiryId,

        sentEnquiryId,
        setSentEnquiryId

    } = useDashboard();

    return(

        <div className="dashboard-page">

            <div className="dashboard-header">

                <h1>

                    Management Dashboard

                </h1>

             

            </div>


            <div className="dashboard-section">

                <DashboardStats

                    stats={dashboard?.stats}

                />

            </div>


            <div className="dashboard-section">

                <h2>

                    Received Enquiries

                </h2>

                <select

                    value={receivedEnquiryId || ""}

                    onChange={(e)=>

                        setReceivedEnquiryId(

                            Number(e.target.value)

                        )

                    }

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

                                    {`ENQ-${enquiry.id} | CR-${enquiry.customer_request_id}`}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            <div className="dashboard-section">

                <h2>

                    Sent Enquiries

                </h2>

                <select

                    value={sentEnquiryId || ""}

                    onChange={(e)=>

                        setSentEnquiryId(

                            Number(e.target.value)

                        )

                    }

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

                                    {`ENQ-${enquiry.id} | CR-${enquiry.customer_request_id}`}

                                </option>

                            )

                        )

                    }

                </select>

            </div>


            <div className="dashboard-section">

                <CustomerSummary

                    summary={

                        dashboard?.customer_summary

                    }

                />

            </div>

            <div className="dashboard-section">

                <SalesSummary

                    summary={

                        dashboard?.selected_summary

                    }

                />

            </div>

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

            <div className="dashboard-section">

                <WorkflowTracker

                    enquiry={

                        dashboard?.selected_enquiry

                    }

                />

            </div>

            {
            dashboard?.selected_enquiry?.requested_task === "APPROVAL_BOARD" &&

            <button
                className="dashboard-primary-action"
                onClick={() => {

                    navigate(
                        `/approval/${dashboard.selected_enquiry.quote_id}`
                    );

                }}
            >

                Open Approval Board

            </button>
            }

        </div>

    );

}