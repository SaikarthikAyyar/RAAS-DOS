// ====================================
// OPS REVIEW TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// OpsReviewSummary.jsx, DeploymentPlanCard.jsx and
// OpsReviewDecisionCard.jsx.
// ====================================

export const components = {

    "ops-review-scoring": {
        title: "Algorithm Recommendation & Machine Scoring",
        explanation: "The system automatically scores every active machine from the Machines/Fleet Business Master against this enquiry's survey answers — job type, material, volume, access, environment, debris, and hub availability — and recommends the best-fitting one, along with a suggested pump/hose package drawn from the Pump Master. This table shows every machine's score breakdown, not just the winner, so you can see why one was picked over another. Editing either the Machines/Fleet or Pump Master Business Masters changes what this table can recommend on future runs."
    },

    "ops-review-override": {
        title: "Machine Override",
        explanation: "Lets you pick a different machine than the one the algorithm recommended, with a required reason for the record. Once saved, the overridden machine is used everywhere downstream (the Deployment Plan, the quote, the pump/hose package) instead of the algorithm's own pick — the algorithm's recommendation is never silently discarded, it is simply superseded."
    },

    "ops-review-deployment-plan": {
        title: "Deployment Plan",
        explanation: "The day-by-day execution plan for this job — mobilisation, setup, execution and demobilisation days, the crew roles and headcounts needed, which accessories are required, and (if the job needs it) which dewatering method to price. These fields start with sensible defaults based on the recommended machine but are yours to adjust for the specifics of this site."
    },

    "ops-review-save-plan": {
        title: "Save Deployment Plan & Generate Quote",
        explanation: "Saves everything in the Deployment Plan and immediately generates a fresh commercial quote from it. This button only becomes clickable once something has actually changed since the last save — the final machine (from the algorithm or your override), the deployment plan's own fields, or the dewatering selection — comparing against the currently saved quote, so it is disabled by design when there is nothing new to generate."
    },

    "ops-review-decision": {
        title: "Approve & Send / Send Back",
        explanation: "The real decision for this gate. Approving requires a quote to already exist and moves the enquiry on to Quote & Commercial; Sending Back returns it to the Survey stage for rework. Both buttons only become clickable once the enquiry is genuinely sitting at the Ops Review stage and you personally hold Ops Review approval standing for this enquiry's hub, set in Business Masters → Hubs."
    },

    "ops-review-request-approval": {
        title: "Request Approval",
        explanation: "A lightweight \"please take a look at this\" ping — anyone can send it once the case has reached this stage, whether or not they personally hold approval standing. It notifies exactly the users who hold Ops Review approval standing for this enquiry's hub, not everyone, and does not by itself approve or change anything."
    }

};

export const workflowSteps = [

    {
        componentId: "ops-review-scoring",
        stepText: "Start here: review the algorithm's recommendation and its full scoring breakdown. This is the system's own first pass, generated automatically when the case entered this stage."
    },

    {
        componentId: "ops-review-override",
        stepText: "If the recommended machine is not right for this job, use Machine Override instead of editing anything else — it records a real reason and takes over as the machine used for every later step."
    },

    {
        componentId: "ops-review-deployment-plan",
        stepText: "Fill in or adjust the Deployment Plan — days, crew, accessories, and dewatering method — for the machine that is actually going to be used (the recommendation, or your override)."
    },

    {
        componentId: "ops-review-save-plan",
        stepText: "Click Save Deployment Plan & Generate Quote to lock in your changes and produce the commercial quote this case will carry into Quote & Commercial. Every save here is recorded — visible to every user via the notification bell 🔔 and in the Audit Trail — so anyone can see exactly what changed and when."
    },

    {
        componentId: "ops-review-request-approval",
        stepText: "Optional: if you want a specific hub approver to look at this before you formally decide, send a Request Approval ping — it reaches only that hub's real Ops Review approvers."
    },

    {
        componentId: "ops-review-decision",
        stepText: "Once a quote exists and you hold Ops Review standing for this hub, Approve to send the case on to Quote & Commercial, or Send Back if it needs to return to Survey. This decision is recorded and notifies the relevant hub approvers directly, and is logged in the Audit Trail."
    }

];
