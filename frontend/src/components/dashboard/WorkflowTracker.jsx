import "./Dashboard.css";

export default function WorkflowTracker({

    enquiry

}){

    if(!enquiry){

        return(

            <div className="dashboard-placeholder">

                No workflow selected.

            </div>

        );

    }

    const stages = [

        {

            key:"CUSTOMER_REQUEST",

            label:"Customer Request"

        },

        {

            key:"SALES_SURVEY",

            label:"Sales Survey"

        },

        {

            key:"OPS_APPROVAL",

            label:"Ops Approval"

        },

        {

            key:"OPS_SELECTION",

            label:"Ops Selection"

        },



        {

            key:"QUOTE",

            label:"Quote"

        },

        {

            key:"APPROVAL_BOARD",

            label:"Approval"

        },

        {

            key:"JOB_CREATION",

            label:"Job"

        },

        {

            key:"EXECUTION",

            label:"Execution"

        }

    ];

    // Handle legacy/current module names
    const moduleMap = {

        TECHNO_COMMERCIAL_QUOTE: "QUOTE",

        QUOTE: "QUOTE",

        OPS: "OPS_SELECTION",

        OPS_SELECTOR: "OPS_SELECTION",

        OPS_SELECTION: "OPS_SELECTION",

        OPS_APPROVAL: "OPS_APPROVAL"

    };

    const currentModule =

        moduleMap[enquiry.current_module] ||

        enquiry.current_module;

    const currentIndex = stages.findIndex(

        stage =>

            stage.key === currentModule

    );

    return(

        <div className="workflow-card">

            <div className="workflow-title">

                Workflow Progress

            </div>

            <div className="workflow-stage-row">

                {

                    stages.map(

                        (stage,index)=>(

                            <div

                                key={stage.key}

                                className={

                                    index <= currentIndex

                                    ?

                                    "workflow-stage active"

                                    :

                                    "workflow-stage"

                                }

                            >

                                {stage.label}

                            </div>

                        )

                    )

                }

            </div>

            <div className="workflow-footer">

                <div>

                    Current Module :

                    <strong>

                        {enquiry.current_module}

                    </strong>

                </div>

                <div style={{marginTop:"10px"}}>

                    Workflow Status :

                    <strong>

                        {enquiry.workflow_status}

                    </strong>

                </div>

            </div>

        </div>

    );

}