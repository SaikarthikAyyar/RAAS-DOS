-- Records the moment the Survey tab's "Request Ops Review" button was
-- clicked, separate from enquiry.stage - the SALES_SURVEY -> OPS_REVIEW
-- transition should only actually fire once both this timestamp AND a
-- completed OpsSelection exist (see enquiry_consolidated_service.py::
-- request_ops_review and ops_selector_service.py::create_ops_selection_request).
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS ops_review_requested_at TIMESTAMPTZ;
