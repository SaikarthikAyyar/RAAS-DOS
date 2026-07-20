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

import InvoiceStats from "../../components/dashboard/InvoiceStats";

import InvoiceWorkflowTracker from "../../components/dashboard/InvoiceWorkflowTracker";


// ====================================
// PAGE
// ====================================

export default function OperationsDashboard(){

 

    const DASHBOARD_TABS = {

        ENQUIRIES: "ENQUIRIES",

        INVOICES: "INVOICES"

    };

    const [successMessage, setSuccessMessage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [activeTab, setActiveTab] = useState(

        DASHBOARD_TABS.ENQUIRIES

    );

    const navigate = useNavigate();

    const {

        dashboard,

        receivedEnquiryId,
        setReceivedEnquiryId,

        sentEnquiryId,
        setSentEnquiryId

    } = useDashboard();

    const [

        selectedInvoice,

        setSelectedInvoice

    ] = useState("");

    console.log(selectedInvoice);

    const selectedInvoiceData =

    dashboard?.invoices?.find(

    invoice =>

    String(invoice.id) ===

    String(selectedInvoice)

    );
    return(

        <div className="dashboard-page">

            {/* ==================================== */}
            {/* HEADER */}
            {/* ==================================== */}

            <div className="dashboard-header">

            <div className="dashboard-tabs">

                <button

                    className={

                        activeTab===DASHBOARD_TABS.ENQUIRIES

                        ?

                        "dashboard-tab dashboard-tab-active"

                        :

                        "dashboard-tab"

                    }

                    onClick={()=>setActiveTab(

                        DASHBOARD_TABS.ENQUIRIES

                    )}

                >

                    Enquiries

                </button>

                <button

                    className={

                        activeTab===DASHBOARD_TABS.INVOICES

                        ?

                        "dashboard-tab dashboard-tab-active"

                        :

                        "dashboard-tab"

                    }

                    onClick={()=>setActiveTab(

                        DASHBOARD_TABS.INVOICES

                    )}

                >

                    Invoices

                </button>

            </div>

                <h1>

                    Operations Dashboard

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

            


            {

            activeTab === DASHBOARD_TABS.ENQUIRIES &&

            <>

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

            </>
            }

           {

            activeTab === DASHBOARD_TABS.INVOICES &&

            <>

            <div className="dashboard-section">

            <h2>

                Invoice Dashboard

            </h2>

            <br/>

            <InvoiceStats

                stats={dashboard?.stats}

            />

            <br/>

            <h3>

                Select Job

            </h3>

            <select

                className="dashboard-select"

                value={selectedInvoice}

                onChange={

                    e=>setSelectedInvoice(

                        e.target.value

                    )

                }

            >

            <option value="">

                Select Job

            </option>

            {

                dashboard?.invoices?.map(

                    invoice=>(

                        <option

                            key={invoice.id}

                            value={invoice.id}

                        >

                            {invoice.generated_job_id}

                            {" | Enquiry #"}

                            {invoice.customer_request_id}

                        </option>

                    )

                )

            }

            </select>

            <br/>

            <br/>

            {
            selectedInvoiceData && (

            <div className="dashboard-section">

            <h2>

            Job Summary

            </h2>

            <div className="invoice-summary-grid">

                <div className="invoice-summary-card">

                    <h3>Job Information</h3>

                    <div className="invoice-summary-item">
                        <span>Generated Job ID</span>
                        <strong>{selectedInvoiceData.generated_job_id || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Customer Request</span>
                        <strong>CR-{selectedInvoiceData.customer_request_id || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Site Location</span>
                        <strong>{selectedInvoiceData.destination || "-"}</strong>
                    </div>

                </div>


                <div className="invoice-summary-card">

                    <h3>Schedule</h3>

                    <div className="invoice-summary-item">
                        <span>Planned Start</span>
                        <strong>{selectedInvoiceData.planned_start || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Estimated Completion</span>
                        <strong>{selectedInvoiceData.estimated_completion || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Actual Completion</span>
                        <strong>{selectedInvoiceData.actual_completion || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Delay</span>
                        <strong>{selectedInvoiceData.delay_days || 0} Days</strong>
                    </div>

                </div>


                <div className="invoice-summary-card">

                    <h3>Execution</h3>

                    <div className="invoice-summary-item">
                        <span>Invoice Status</span>
                        <strong>{selectedInvoiceData.invoice_status}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Execution Phase</span>
                        <strong>{selectedInvoiceData.execution_phase}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Execution Progress</span>
                        <strong>{selectedInvoiceData.execution_progress}%</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Transport Status</span>
                        <strong>{selectedInvoiceData.transport_status}</strong>
                    </div>

                </div>


                <div className="invoice-summary-card">

                    <h3>Allocation</h3>

                    <div className="invoice-summary-item">
                        <span>Machine</span>
                        <strong>{selectedInvoiceData.machine_name || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Machine Status</span>
                        <strong>{selectedInvoiceData.machine_status || "-"}</strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Personnel</span>
                        <strong>

                            {selectedInvoiceData.personnel_json?.length || 0}

                        </strong>
                    </div>

                    <div className="invoice-summary-item">
                        <span>Personnel Status</span>
                        <strong>{selectedInvoiceData.personnel_status || "-"}</strong>
                    </div>

                </div>

            </div>

            </div>

            )
            }
            </div>


            {/* =======================================
            MACHINE SUMMARY
            ======================================= */}

  
        <div className="dashboard-summary-section">
            <h2 className="dashboard-section-title">

                Machine Summary

            </h2>

            <div className="summary-grid">

                <div className="summary-card">

                    <label>Machine Name</label>

                    <h3>{selectedInvoice?.machine_name || "-"}</h3>

                </div>

                <div className="summary-card">

                    <label>Machine Code</label>

                    <h3>{selectedInvoice?.machine_code || "-"}</h3>

                </div>

                <div className="summary-card">

                    <label>Machine Status</label>

                    <h3>{selectedInvoice?.machine_status || "-"}</h3>

                </div>

                <div className="summary-card">

                    <label>Machine Location</label>

                    <h3>{selectedInvoice?.machine_location || "-"}</h3>

                </div>

            </div>

        </div>
        



        


            {/* =======================================
            PERSONNEL SUMMARY
            ======================================= */}

        <div className="dashboard-summary-section">

            <h2 className="dashboard-section-title">

                Personnel Summary

            </h2>

            <div className="summary-grid">

                <div className="summary-card">

                    <label>Personnel Status</label>

                    <h3>{selectedInvoice?.personnel_status || "-"}</h3>

                </div>

                <div className="summary-card">

                    <label>Assigned Personnel</label>

                    <h3>

                        {

                            selectedInvoice?.personnel_json?.length

                            ||

                            0

                        }

                    </h3>

                </div>

                <div className="summary-card">

                    <label>Personnel List</label>

                    <h3>

                        {

                            selectedInvoice?.personnel_json?.join(", ")

                            ||

                            "-"

                        }

                    </h3>

                </div>

            </div>
        
        </div>

        {/* =======================================
        TRANSPORT SUMMARY
        ======================================= */}

        <div className="dashboard-summary-section">

        <h2 className="dashboard-section-title">

            Transport Summary

        </h2>

        <div className="summary-grid">

            <div className="summary-card">

                <label>Transport Status</label>

                <h3>{selectedInvoice?.transport_status || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Current GPS</label>

                <h3>{selectedInvoice?.gps_location || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Destination</label>

                <h3>{selectedInvoice?.destination || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Distance Remaining</label>

                <h3>

                    {selectedInvoice?.distance_remaining_km ?? 0}

                    {" km"}

                </h3>

            </div>

            <div className="summary-card">

                <label>ETA</label>

                <h3>

                    {selectedInvoice?.eta_minutes ?? 0}

                    {" mins"}

                </h3>

            </div>

        </div>

        </div>

        {/* =======================================
        EXECUTION SUMMARY
        ======================================= */}

        <div className="dashboard-summary-section">

        <h2 className="dashboard-section-title">

            Execution Summary

        </h2>

        <div className="summary-grid">

            <div className="summary-card">

                <label>Execution Phase</label>

                <h3>{selectedInvoice?.execution_phase || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Progress</label>

                <h3>

                    {selectedInvoice?.execution_progress ?? 0}

                    %

                </h3>

            </div>

            <div className="summary-card">

                <label>Current Activity</label>

                <h3>{selectedInvoice?.current_activity || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Customer Status</label>

                <h3>{selectedInvoice?.customer_visible_status || "-"}</h3>

            </div>

            <div className="summary-card">

                <label>Delay</label>

                <h3>

                    {selectedInvoice?.delay_days ?? 0}

                    {" Days"}

                </h3>

            </div>

        </div>

        </div>


        <div className="dashboard-summary-section">

            <InvoiceWorkflowTracker

                invoice={selectedInvoice}

            />

        </div>
            

            </>

            }
        </div>

    );

}