// ====================================
// IMPORTS
// ====================================

import "./Execution.css";

import { useAuth } from "../../contexts/AuthContext";


// ====================================
// EXECUTION CONTROLS
// ====================================

export default function ExecutionControls({

    execution,

    startCurrentPhase,

    completeCurrentPhase,

    updateExecution

}){

    const { hasTask } = useAuth();

    if(!execution){

        return null;

    }

    const completed =

        execution.workflow_status ===

        "EXECUTION_COMPLETED";

    const canStart =

        !completed && hasTask("enquiry-tab-execution", "start_phase");

    const canUpdate =

        !completed && hasTask("enquiry-tab-execution", "update_progress");

    const canComplete =

        !completed && hasTask("enquiry-tab-execution", "complete_phase");

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">

                Execution Controls

            </h2>

            <p
                style={{
                    color:"var(--muted)",
                    fontSize:"12.5px",
                    marginBottom:"12px"
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