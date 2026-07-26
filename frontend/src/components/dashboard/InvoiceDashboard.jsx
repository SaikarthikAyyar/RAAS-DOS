import { useState } from "react";

import InvoiceJobTab from "./InvoiceJobTab";

import InvoiceExecutionTab from "./InvoiceExecutionTab";

export default function InvoiceDashboard({

    invoice

}){

    const TABS = {

        JOB:"JOB",

        EXECUTION:"EXECUTION"

    };

    const [

        activeTab,

        setActiveTab

    ] = useState(

        TABS.JOB

    );

    if(!invoice){

        return(

            <div className="dashboard-section">

                <h2>

                    Invoice Dashboard

                </h2>

                <p>

                    Select an invoice.

                </p>

            </div>

        );

    }

    return(

        <>

            <div className="dashboard-tabs">

                <button

                    className={

                        activeTab===TABS.JOB

                        ?

                        "dashboard-tab dashboard-tab-active"

                        :

                        "dashboard-tab"

                    }

                    onClick={()=>setActiveTab(

                        TABS.JOB

                    )}

                >

                    Job

                </button>

                <button

                    className={

                        activeTab===TABS.EXECUTION

                        ?

                        "dashboard-tab dashboard-tab-active"

                        :

                        "dashboard-tab"

                    }

                    onClick={()=>setActiveTab(

                        TABS.EXECUTION

                    )}

                >

                    Execution

                </button>

            </div>

            {

                activeTab===TABS.JOB && (

                    <InvoiceJobTab

                        invoice={invoice}

                    />

                )

            }

            {

                activeTab===TABS.EXECUTION && (

                    <InvoiceExecutionTab

                        invoice={invoice}

                    />

                )

            }

        </>

    );

}