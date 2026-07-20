// ====================================
// IMPORTS
// ====================================

import useDashboard from "../../hooks/useDashboard";



import DashboardStats
from "../../components/dashboard/DashboardStats";

import CustomerSummary
from "../../components/dashboard/CustomerSummary";

import SalesSummary from "../../components/dashboard/SalesSummary";

import OpsSummary from "../../components/dashboard/OpsSummary";

import QuoteSummary
from "../../components/dashboard/QuoteSummary";

import {

    approveQuote,

    requestQuoteRevision

}

from "../../services/technoCommercialQuoteService";



import WorkflowTracker
from "../../components/dashboard/WorkflowTracker";


// ====================================
// PAGE
// ====================================

export default function CustomerDashboard(){



    const{

        dashboard,

        receivedEnquiryId,
        setReceivedEnquiryId,

        sentEnquiryId,
        setSentEnquiryId

    } = useDashboard();

    return(

        <div className="dashboard-page">

            {/* ==================================== */}
            {/* TITLE */}
            {/* ==================================== */}

            <div className="dashboard-header">

                <h1>

                    Customer Service Dashboard

                </h1>

               

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
            {/* RECEIVED */}
            {/* ==================================== */}

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


            {/* ==================================== */}
            {/* SENT */}
            {/* ==================================== */}

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


            {/* ==================================== */}
            {/* SUMMARY */}
            {/* ==================================== */}

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

            {

            dashboard?.quote_summary?.workflow_status ===

            "CUSTOMER_REVIEW"

            &&

            <div className="dashboard-section">

                <button

                    className="dashboard-primary-action"

                    onClick={async()=>{

                        try{

                            await approveQuote(

                                dashboard.quote_summary.quote_id

                            );

                            window.location.reload();

                        }

                        catch(error){

                            console.error(error);    

                            alert(

                                "Unable to approve quote."

                            );

                        }

                    }}

                >

                    Approve Quote

                </button>

                <button

                    className="dashboard-primary-action"

                    style={{

                        marginTop:"16px"

                    }}

                    onClick={async()=>{

                        try{

                            await requestQuoteRevision(

                                dashboard.quote_summary.quote_id

                            );

                            window.location.reload();

                        }

                        catch(error){

                            console.error(error);

                            alert(

                                "Unable to request revision."

                            );

                        }

                    }}

                >

                    Request Revision

                </button>

            </div>

            }

        </div>

    );

}