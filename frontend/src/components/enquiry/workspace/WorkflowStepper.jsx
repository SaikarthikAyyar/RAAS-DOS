// ====================================
// WORKFLOW STAGES
// Keys match the backend EnquiryStage enum
// (backend/schemas/enquiry_consolidated_schema.py)
// ====================================

const WORKFLOW_STAGES = [

    { key: "CUSTOMER_REQUEST", label: "Customer Request" },
    { key: "SALES_SURVEY", label: "Sales Survey" },
    { key: "OPS_REVIEW", label: "Ops Review" },
    { key: "TECHNO_COMMERCIAL_APPROVAL", label: "Techno-Commercial Approval" },
    { key: "COMMERCIAL_APPROVAL", label: "Commercial Approval" },
    { key: "QUOTE_RELEASED", label: "Quote Released" },
    { key: "PO_RECEIVED", label: "PO Received" },
    { key: "JOB_CREATION", label: "Job Creation" },
    { key: "EXECUTION", label: "Execution" },
    { key: "COMPLETED", label: "Completed" }

];


// ====================================
// COMPONENT
// ====================================

export default function WorkflowStepper({

    currentStage

}){

    const currentIndex = WORKFLOW_STAGES.findIndex(

        stage => stage.key === currentStage

    );

    return(

        <div className="workflow-stepper">

            {

                WORKFLOW_STAGES.map(
                    (stage, index) => {

                        const done = currentIndex !== -1 && index < currentIndex;

                        const now = index === currentIndex;

                        const stepClass =
                            "workflow-step" +
                            (done ? " workflow-step-done" : "") +
                            (now ? " workflow-step-now" : "");

                        return(

                            <div
                                className={stepClass}
                                key={stage.key}
                            >

                                <div className="workflow-step-number">

                                    {done ? "✓" : index + 1}

                                </div>

                                <div className="workflow-step-name">

                                    {stage.label}

                                </div>

                                {

                                    index < WORKFLOW_STAGES.length - 1 && (

                                        <div className="workflow-step-connector" />

                                    )

                                }

                            </div>

                        );

                    }
                )

            }

        </div>

    );

}
