// ====================================
// IMPORTS
// ====================================

import "./Execution.css";


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

    const canStart =

        !completed;

    const canUpdate =

        !completed;

    const canComplete =

        !completed;

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">

                Execution Controls

            </h2>

            <p
                style={{
                    color:"#b8e5e5",
                    marginBottom:"24px"
                }}
            >

                Use the controls below to progress the execution workflow.

            </p>

            <div className="execution-actions">

                <button

                    className="execution-btn"

                    disabled={!canStart}

                    onClick={startCurrentPhase}

                >

                    Start Current Phase

                </button>

                <button

                    className="execution-btn"

                    disabled={!canUpdate}

                    onClick={updateExecution}

                >

                    Update Execution

                </button>

                <button

                    className="execution-btn"

                    disabled={!canComplete}

                    onClick={completeCurrentPhase}

                >

                    Complete Current Phase

                </button>

            </div>

        </div>

    );

}