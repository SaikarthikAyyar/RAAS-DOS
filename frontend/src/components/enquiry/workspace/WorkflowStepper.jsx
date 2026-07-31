// ====================================
// WORKFLOW STAGES
// ====================================

const WORKFLOW_STAGES = [

    "Customer Request",

    "Sales Survey",

    "Ops Review",

    "Techno Commercial",

    "Commercial Approval",

    "Purchase Order",

    "Job Creation",

    "Execution",

    "Closed"

];


// ====================================
// COMPONENT
// ====================================

export default function WorkflowStepper({

    currentStage

}){

    return(

        <div className="workflow-stepper">

            {

                WORKFLOW_STAGES.map(

                    (stage,index)=>(

                        <div

                            key={stage}

                            className={

                                stage===currentStage

                                    ? "workflow-step workflow-step-active"

                                    : "workflow-step"

                            }

                        >

                            <div className="workflow-step-number">

                                {index+1}

                            </div>

                            <div className="workflow-step-name">

                                {stage}

                            </div>

                        </div>

                    )

                )

            }

        </div>

    );

}