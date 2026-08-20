// ====================================
// QUOTE & COMMERCIAL TAB — GUIDE CONTENT
// componentIds here must match the data-guide-id attributes placed in
// QuoteCommercialSummary.jsx.
// ====================================

export const components = {

    "qc-breakdown": {
        title: "Commercial Breakdown & Internal-Only Addition",
        explanation: "The same line-item quote breakdown shown on the Techno-Commercial Review tab, plus one field only visible here: an internal-only addition — an extra amount and note that adjusts the quote's internal figures without appearing on anything the customer sees. Use it for costs that matter for margin tracking but should never be quoted externally."
    },

    "qc-preview": {
        title: "Preview Customer-Facing Quote",
        explanation: "Toggles a preview of what the customer-facing version of this quote looks like, stripped of internal-only figures. It only changes what you see on screen — it does not save, send, or generate anything."
    },

    "qc-valid-till": {
        title: "Valid Till & Version History",
        explanation: "Sets the date this quote is valid until, and shows every earlier version of the quote generated for this enquiry (each time Ops Review's \"Save Deployment Plan & Generate Quote\" produced a new one). Use the history to see exactly what changed between versions."
    },

    "qc-request-revision": {
        title: "Request Revision",
        explanation: "Flags this quote as needing a new version before it can be approved — for example, if the numbers need to go back to Ops Review for rework. This does not by itself send the case anywhere; it only blocks the Approve button below until a fresh quote has been generated. Once flagged, it stays flagged until Ops Review regenerates the quote."
    },

    "qc-decision": {
        title: "Approve & Send / Send Back",
        explanation: "The real decision for this gate. Approving moves the enquiry on to Commercial Approval; Sending Back returns it all the way to Ops Review. Both require the enquiry to genuinely be at the Quote & Commercial stage and that you hold Quote & Commercial approval standing for this enquiry's hub — and Approve is additionally blocked while a revision has been requested and not yet fulfilled."
    },

    "qc-request-approval": {
        title: "Request Approval",
        explanation: "A lightweight \"please take a look at this\" ping, open to anyone once the case has reached this stage. It notifies exactly the users who hold Quote & Commercial approval standing for this enquiry's hub, not everyone, and does not itself approve or change anything."
    }

};

export const workflowSteps = [

    {
        componentId: "qc-breakdown",
        stepText: "Review the commercial breakdown, and add an internal-only addition here if this quote needs an internal-only cost that should never appear on the customer-facing version."
    },

    {
        componentId: "qc-preview",
        stepText: "Use the customer-facing preview to sanity-check exactly what the customer will see before this quote goes any further."
    },

    {
        componentId: "qc-valid-till",
        stepText: "Set how long this quote stays valid, and check the version history if you need to confirm what changed since an earlier revision."
    },

    {
        componentId: "qc-request-revision",
        stepText: "If the numbers genuinely need rework, flag Request Revision — this blocks Approve until Ops Review generates a fresh quote, so nothing gets approved against stale figures by accident."
    },

    {
        componentId: "qc-request-approval",
        stepText: "Optional: ping a specific hub's Quote & Commercial approvers directly if you want their eyes on this before deciding."
    },

    {
        componentId: "qc-decision",
        stepText: "Once you hold Quote & Commercial standing for this hub and no revision is pending, Approve to send the case to Commercial Approval, or Send Back to return it to Ops Review. This decision notifies the relevant hub approvers directly and is logged in the Audit Trail."
    }

];
