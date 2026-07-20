// ====================================
// IMPORTS
// ====================================

import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useState } from "react";

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

export default function SalesDashboard(){

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
            {/* TITLE */}
            {/* ==================================== */}

            <div className="dashboard-header">

                <h1>

                    Sales Dashboard

                </h1>


                {

                    successMessage &&

                    <div className="approval-success">

                        {successMessage}

                    </div>

                }

                {

                    errorMessage &&

                    <div className="approval-error">

                        {errorMessage}

                    </div>

                }                

                <p>

                    Sales Survey Workspace

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
            {/* RECEIVED */}
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
            {/* SALES SUMMARY */}
            {/* ==================================== */}

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


            {/* ==================================== */}
            {/* ACTION */}
            {/* ==================================== */}

            <div className="dashboard-section">

                <button

                    className="dashboard-primary-action"

                    onClick={() => {

                        if (!dashboard?.selected_enquiry) {

                            alert("Please select a received enquiry first.");

                            return;

                        }

                        localStorage.setItem(
                            "sales_customer_request_id",
                            dashboard.selected_enquiry.customer_request_id
                        );

                        localStorage.setItem(
                            "sales_enquiry_id",
                            dashboard.selected_enquiry.id
                        );

                        navigate("/sales-survey");

                    }}

                >

                    Open Sales Survey

                </button>


                <button
                    className="dashboard-primary-action"
                    onClick={() => {

                        if (!dashboard?.selected_enquiry) {

                            alert("Please select an enquiry.");

                            return;

                        }

                        localStorage.setItem(
                            "quote_customer_request_id",
                            dashboard.selected_enquiry.customer_request_id
                        );

                        localStorage.setItem(
                            "quote_sales_survey_id",
                            dashboard.selected_enquiry.sales_survey_id
                        );

                        localStorage.setItem(
                            "quote_ops_selector_id",
                            dashboard.selected_enquiry.ops_selector_id
                        );

                        localStorage.setItem(
                            "quote_enquiry_id",
                            dashboard.selected_enquiry.id
                        );

                        navigate("/quote");

                    }}
                >
                    Open Quote
                </button>

            </div>

        </div>

    );

}