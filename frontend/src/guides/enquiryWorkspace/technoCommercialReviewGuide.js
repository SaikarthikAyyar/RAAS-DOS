// ====================================
// TECHNO-COMMERCIAL REVIEW TAB — GUIDE CONTENT
// componentId here must match the data-guide-id attribute placed in
// TechnoCommercialReviewSummary.jsx. This tab is entirely read-only —
// one component, one step.
// ====================================

export const components = {

    "tcr-bifurcation-table": {
        title: "Full Bifurcation (Min-Max Range)",
        explanation: "A read-only, line-by-line breakdown of the quote's commercial figures — mobilisation, setup/access, execution, pump add-on, documentation and access-support buffers, dewatering add-on, overhead, contingency and margin — shown as the min/max range the quote was generated with. This is a snapshot of whatever the Deployment Plan Card's \"Save Deployment Plan & Generate Quote\" action last produced on the Ops Review tab; nothing here is editable. The real decisions for this leg of the workflow happen on the Ops Review tab (which approves moving the quote forward) and the Quote & Commercial tab (which approves the quote itself) — this tab exists purely so anyone can review the numbers in between."
    }

};

export const workflowSteps = [

    {
        componentId: "tcr-bifurcation-table",
        stepText: "There is nothing to do on this tab — it is a pure review screen. Use it to check the commercial breakdown before the case reaches the Quote & Commercial gate, where the real approve/send-back decision for this quote actually happens."
    }

];
