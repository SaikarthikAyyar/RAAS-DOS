// ====================================
// IMPORTS
// ====================================

import { useNavigate } from "react-router-dom";


import {

    useState,

    useEffect

} from "react";

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

import InvoiceDashboard
from "../../components/dashboard/InvoiceDashboard";


// ====================================
// PAGE
// ====================================

export default function OperationsDashboard(){




 

    const DASHBOARD_TABS = {

        ENQUIRIES: "ENQUIRIES",

        INVOICES: "INVOICES"

    };






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

    console.log("========== OPERATIONS DASHBOARD ==========");
    console.log("dashboard =", dashboard);
    console.log("received =", dashboard?.received_enquiries);
    console.log("sent =", dashboard?.sent_enquiries);
    console.log("invoices =", dashboard?.invoices);
    console.log("selected =", dashboard?.selected_enquiry);
    console.log("==========================================");

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

    useEffect(()=>{

        if(

            !selectedInvoice &&

            dashboard?.invoices?.length

        ){

            setSelectedInvoice(

                String(

                    dashboard.invoices[0].id

                )

            );

        }

    },[

        dashboard,

        selectedInvoice

    ]);

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
                    activeTab === DASHBOARD_TABS.INVOICES && (

                        <>

                            <div className="dashboard-section">

                                <h2>

                                    Invoice Dashboard

                                </h2>

                                <select

                                    value={selectedInvoice}

                                    onChange={(event)=>{

                                        setSelectedInvoice(

                                            event.target.value

                                        );

                                    }}

                                >

                                    {

                                        dashboard?.invoices?.map(

                                            (invoice)=>(

                                                <option

                                                    key={invoice.id}

                                                    value={invoice.id}

                                                >

                                                    INV-{invoice.id} | JOB-{invoice.job_creation_id}

                                                </option>

                                            )

                                        )

                                    }

                                </select>

                            </div>

                            <InvoiceDashboard

                                invoice={

                                    selectedInvoiceData ||

                                    dashboard?.invoices?.[0] ||

                                    null

                                }

                            />

                        </>

                    )
                }
                
            </div>

        );

    }
