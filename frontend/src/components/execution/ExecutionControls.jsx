// ====================================
// IMPORTS
// ====================================

import "./Execution.css";

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";


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

    // Matches the backend's own _current_phase_status() check - the
    // current phase's own status field, not workflow_status (which
    // only ever moves READY -> CURRENTLY_WORKING once, at Phase 1's
    // start, and stays that way across every later phase transition
    // even while a new phase's own status is still PENDING).
    const currentPhaseStatus = {
        PHASE_1: execution.phase_1_status,
        PHASE_2: execution.phase_2_status,
        PHASE_3: execution.phase_3_status
    }[execution.current_phase];

    const phaseStarted = currentPhaseStatus !== "PENDING";

    // Every job is scheduled against a real planned_start date (set at
    // booking, editable via Job Creation) - Phase 1's mobilisation leg
    // can't genuinely begin before that date has arrived, no matter how
    // early the button gets clicked. Only applies to Phase 1/while
    // still PENDING - Phase 2/3 have no separate scheduled date of
    // their own to jump ahead of, they only ever begin once the prior
    // phase has actually completed. Update/Complete automatically
    // reflect this too, since they're already gated on phaseStarted,
    // which stays false the whole time this blocks Start.
    const beforePlannedStart =
        execution.current_phase === "PHASE_1" &&
        !phaseStarted &&
        execution.planned_start &&
        new Date().toISOString().slice(0, 10) < execution.planned_start;

    const canStart =

        !completed && !phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "start_phase");

    const canUpdate =

        !completed && phaseStarted && hasTask("enquiry-tab-execution", "update_progress");

    const canComplete =

        !completed && phaseStarted && hasTask("enquiry-tab-execution", "complete_phase");

    let startTitle;

    if(phaseStarted){
        startTitle = "This phase has already been started.";
    }
    else if(beforePlannedStart){
        startTitle = `This job isn't scheduled to start until ${execution.planned_start} - execution can't begin before then.`;
    }

    return(

        <div className="execution-card" data-guide-id="execution-controls" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="execution-controls" floating/>

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

                    title={startTitle}

                >

                    Start Current Phase

                </button>

                <button

                    className="execution-btn"

                    disabled={!canUpdate}

                    onClick={updateExecution}

                    title={!phaseStarted ? "Start Current Phase before recording any progress." : undefined}

                >

                    Update Execution

                </button>

                <button

                    className="execution-btn"

                    disabled={!canComplete}

                    onClick={completeCurrentPhase}

                    title={!phaseStarted ? "Start Current Phase before it can be completed." : undefined}

                >

                    Complete Current Phase

                </button>

            </div>

        </div>

    );

}