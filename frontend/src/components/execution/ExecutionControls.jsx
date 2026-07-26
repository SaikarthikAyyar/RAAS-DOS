// ====================================
// EXECUTION CONTROLS
// ====================================

export default function ExecutionControls({

    execution,

    startCurrentPhase,

    completeCurrentPhase,

    updateExecution

}){

    if(!execution){

        return null;

    }

    const completed =

        execution.workflow_status ===

        "EXECUTION_COMPLETED";

    return(

        <div
            style={{

                marginTop:"20px",

                padding:"20px",

                border:"1px solid #444",

                borderRadius:"8px",

                background:"#1f1f1f"

            }}
        >

            <h2>

                Execution Controls

            </h2>

            <br/>

            <button

                disabled={completed}

                onClick={

                    startCurrentPhase

                }

            >

                Start Current Phase

            </button>

            {" "}

            <button

                disabled={completed}

                onClick={

                    updateExecution

                }

            >

                Update Execution

            </button>

            {" "}

            <button

                disabled={completed}

                onClick={

                    completeCurrentPhase

                }

            >

                Complete Current Phase

            </button>

        </div>

    );

}