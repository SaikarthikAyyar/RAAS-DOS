import "./Dashboard.css";

export default function InvoiceWorkflowTracker({

    invoice

}){

    console.log("Invoice Object");
    console.log(JSON.stringify(invoice, null, 2));

    if(!invoice){

        return(

            <div className="dashboard-placeholder">

                No invoice selected.

            </div>

        );

    }

    const stages = [

        {

            key:"JOB_CREATED",

            label:"Job Created"

        },

        {

            key:"ALLOCATION",

            label:"Allocation"

        },

        {

            key:"TRANSPORT",

            label:"Transport"

        },

        {

            key:"SITE_ARRIVAL",

            label:"Site Arrival"

        },

        {

            key:"PHASE_1",

            label:"Phase 1"

        },

        {

            key:"PHASE_2",

            label:"Phase 2"

        },

        {

            key:"PHASE_3",

            label:"Phase 3"

        },

        {

            key:"COMPLETED",

            label:"Completed"

        }

    ];

    const phaseMap = {
        JOB_CREATED: "JOB_CREATED",
        MACHINE_ALLOCATION: "ALLOCATION",
        ALLOCATION: "ALLOCATION",
        TRANSPORT: "TRANSPORT",
        SITE_ARRIVAL: "SITE_ARRIVAL",
        PHASE_1: "PHASE_1",
        PHASE_2: "PHASE_2",
        PHASE_3: "PHASE_3",
        COMPLETED: "COMPLETED"
    };

    const currentPhase =
        phaseMap[invoice.execution_phase] || "JOB_CREATED";

    const currentIndex = stages.findIndex(
        stage => stage.key === currentPhase
    );



    console.log(invoice);

    console.log(

        "Execution Phase:",

        invoice.execution_phase

    );

    console.log(

        "Current Index:",

        currentIndex

    );

    console.log("execution_phase =", invoice.execution_phase);
    console.log("mapped =", currentPhase);
    console.log("index =", currentIndex);

    return(

        <div className="workflow-card">

            <div className="workflow-title">

                Execution Workflow

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

                    Current Phase :

                    <strong>

                        {currentPhase}

                    </strong>

                </div>

                <div style={{marginTop:"10px"}}>

                    Progress :

                    <strong>

                        {" "}

                        {invoice.execution_progress}%

                    </strong>

                </div>

            </div>

        </div>

    );

}