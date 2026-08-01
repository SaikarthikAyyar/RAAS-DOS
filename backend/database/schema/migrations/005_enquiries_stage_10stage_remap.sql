-- ====================================
-- ENQUIRIES: 10-STAGE WORKFLOW REMAP
-- The old single QUOTE stage is now split into 4 stages
-- (TECHNO_COMMERCIAL_APPROVAL, COMMERCIAL_APPROVAL,
-- QUOTE_RELEASED, PO_RECEIVED), matching the RAAS DOS
-- wireframe's 10-stage STAGES array. Every other existing
-- stage value (CUSTOMER_REQUEST, SALES_SURVEY, OPS_REVIEW,
-- JOB_CREATION, EXECUTION, COMPLETED) is unchanged and needs
-- no remap - only rows still at QUOTE need moving, to the
-- first of the 4 new sub-stages.
-- ====================================

UPDATE enquiries
    SET stage = 'TECHNO_COMMERCIAL_APPROVAL'
    WHERE stage = 'QUOTE';
