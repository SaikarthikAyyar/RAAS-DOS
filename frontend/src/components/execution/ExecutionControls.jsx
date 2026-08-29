// ====================================
// IMPORTS
// ====================================

import "./Execution.css";

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";

import { isBeforePlannedStart } from "../../utils/executionSchedule";


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

    // A pure date check, unconditional on phaseStarted/current_phase -
    // every job is scheduled against a real planned_start date, and
    // nothing that records or advances execution should be usable
    // before that date has genuinely arrived, no matter what state the
    // execution otherwise happens to be in. Only Get Coordinates and
    // Save Route (Phase 1's own Source & Destination card) stay
    // available before this date, so the user can still view/prepare
    // the map ahead of time - every action here is blocked.
    const beforePlannedStart = isBeforePlannedStart(execution);

    const canStart =

        !completed && !phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "start_phase");

    const canUpdate =

        !completed && phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "update_progress");

    const canComplete =

        !completed && phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "complete_phase");

    const plannedStartTitle = `This job isn't scheduled to start until ${execution.planned_start} - no updates can be recorded before then.`;

    let startTitle;

    if(beforePlannedStart){
        startTitle = plannedStartTitle;
    }
    else if(phaseStarted){
        startTitle = "This phase has already been started.";
    }

    const updateTitle = beforePlannedStart
        ? plannedStartTitle
        : (!phaseStarted ? "Start Current Phase before recording any progress." : undefined);

    const completeTitle = beforePlannedStart
        ? plannedStartTitle
        : (!phaseStarted ? "Start Current Phase before it can be completed." : undefined);

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

                    title={updateTitle}

                >

                    Update Execution

                </button>

                <button

                    className="execution-btn"

                    disabled={!canComplete}

                    onClick={completeCurrentPhase}

                    title={completeTitle}

                >

                    Complete Current Phase

                </button>

            </div>

        </div>

    );

}