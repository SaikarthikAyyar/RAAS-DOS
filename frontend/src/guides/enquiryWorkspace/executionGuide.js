// ====================================
// EXECUTION / JOB TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// ExecutionWorkspaceSummary.jsx and the phase components it renders
// (ExecutionSummary.jsx, ExecutionControls.jsx, Phase1Mobilisation.jsx,
// Phase2Execution.jsx, Phase3Demobilisation.jsx).
// ====================================

export const components = {

    "execution-summary": {
        title: "Execution Summary",
        explanation: "A live overview of this job's execution: which of the three phases — Mobilisation, Job Execution, Demobilisation — is current, the overall progress percentage across all three, and the machine's current activity, transport status and delay in days. Every figure here is read-only; it reflects whatever the phase-specific screen below has actually recorded."
    },

    "execution-create": {
        title: "Create Execution",
        explanation: "Creates the execution record for this job, starting it at Phase 1 - Mobilisation. Available to Admin only, once the job itself exists."
    },

    "phase1-route": {
        title: "Source & Destination",
        explanation: "Sets the two fixed endpoints of the job — the hub the machine is mobilising from, and the site it's heading to. Saving a route computes the real straight-line distance between them and draws it on the map. These two points stay fixed for the rest of the job; Phase 3's return leg reuses them rather than asking for a new route to be entered."
    },

    "phase1-position": {
        title: "Last Known Position",
        explanation: "Where the machine actually is right now, plus its speed. Distance Travelled, Distance Remaining, Phase Progress, ETA and Transport Status are never typed in by hand — all five are calculated automatically from this position, the fixed source point, and the current speed, so they can never disagree with each other. Saving records a new position; Transport Status will read Not started, In transit or Reached depending on how far along the route that position falls. Recording a position is only possible once this phase has been started from Execution Controls below."
    },

    "phase2-output": {
        title: "Live Execution Reporting",
        explanation: "Reports today's cleaning output. Total Output is never typed directly — it's the running sum of every 'Output Completed Since Last Update' entry, so it can't be accidentally overwritten by a later save. Daily Target can only be set once, on the very first save of this phase; after that it stays fixed for the rest of the job, since it's a planning figure rather than something that should change mid-way through. Reporting output is only possible once this phase has been started from Execution Controls below."
    },

    "phase3-route": {
        title: "Return Route",
        explanation: "A read-only summary of the return leg — the machine travelling from the site back to its source hub. It reuses the exact same two coordinates set in Phase 1, in reverse, so there is nothing to re-enter here; the map's Source and Destination pins are shown in that same reversed order to match the real direction of travel."
    },

    "phase3-position": {
        title: "Last Known Position",
        explanation: "The same position-driven mechanism as Phase 1, measured back toward the source instead of toward the site: Distance Travelled, Remaining, Phase Progress, ETA and Transport Status are all calculated from wherever the machine's position is recorded as. Recording a position is only possible once this phase has been started from Execution Controls below."
    },

    "execution-controls": {
        title: "Execution Controls",
        explanation: "Start Current Phase begins whichever phase the execution is currently on — nothing on that phase's own screen can be recorded before this is clicked, so a phase can never accumulate progress it never actually started. Complete Current Phase closes the phase out — but only once its real target has actually been reached (the full distance for Mobilisation and Demobilisation, the estimated volume for Job Execution); attempting it early is rejected with a message stating exactly what's still short. Completing the final phase releases the machine and crew — to the next job in their queue if one exists, or back to Available otherwise — and marks the enquiry's own stage Completed. Update Execution is a lighter save covering only current activity and remarks, without touching position or output — it too is only available once the current phase has been started. All three actions are Admin-only for now."
    }

};

export const workflowSteps = [

    {
        componentId: "execution-summary",
        stepText: "Once Job Creation is confirmed, this tab tracks the job through its three real phases: Mobilisation, Job Execution, and Demobilisation."
    },

    {
        componentId: "execution-create",
        stepText: "If nothing has started yet, create the execution record first."
    },

    {
        componentId: "phase1-route",
        stepText: "Phase 1 - Mobilisation: set the source hub and destination site once, at the very start."
    },

    {
        componentId: "phase1-position",
        stepText: "As the machine travels, record its actual position — distance, remaining distance, ETA and transport status all follow automatically from that."
    },

    {
        componentId: "phase2-output",
        stepText: "Phase 2 - Job Execution: once mobilisation is complete, report cleaning output as it happens; the running total builds up on its own."
    },

    {
        componentId: "phase3-route",
        stepText: "Phase 3 - Demobilisation: the return route is already fixed from Phase 1, shown here in the correct return direction."
    },

    {
        componentId: "phase3-position",
        stepText: "Record the machine's position on the way back the same way as Phase 1, until it reads Reached."
    },

    {
        componentId: "execution-controls",
        stepText: "Use Start/Complete Current Phase to move between phases — completion is blocked until that phase's real target has been met — and Update Execution for a lighter, activity-only save."
    }

];
