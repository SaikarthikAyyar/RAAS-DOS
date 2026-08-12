// =========================================
// STAGE LABELS
// Display-only lookup from the backend's real stage enum strings
// (backend/services/workflow_service.py::WorkflowStage) to the
// wireframe's own human-readable STAGES array labels. Purely a
// frontend mapping - the backend's stored values are untouched.
// =========================================

export const STAGE_LABELS = {

    CUSTOMER_REQUEST: "Enquiry",
    SALES_SURVEY: "Survey",
    OPS_REVIEW: "Ops Review",
    TECHNO_COMMERCIAL_APPROVAL: "Techno-Commercial Approval",
    COMMERCIAL_APPROVAL: "Commercial Approval",
    QUOTE_RELEASED: "Quote Released",
    PO_RECEIVED: "PO Received",
    JOB_CREATION: "Job Created",
    EXECUTION: "Execution",
    COMPLETED: "Closed"

};
