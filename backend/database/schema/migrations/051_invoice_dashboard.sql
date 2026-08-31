-- Phase 39A: Invoice Dashboard foundation - reference chain +
-- real financial fields on Invoice + Execution phase timestamps +
-- machine deployment history.

-- ====================================
-- REFERENCE CHAIN
-- ====================================

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS invoice_id INTEGER;

-- Already declared on the ORM models from earlier phases but never
-- confirmed present via a real migration on either DB - this makes
-- both real and starts them being genuinely written to.
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS execution_id INTEGER;
ALTER TABLE personnel ADD COLUMN IF NOT EXISTS current_invoice_id BIGINT;

-- ====================================
-- INVOICE FINANCIAL FIELDS
-- ====================================

ALTER TABLE invoice ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50);
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS invoice_value NUMERIC(14,2);
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS amount_collected NUMERIC(14,2) NOT NULL DEFAULT 0;
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS collection_status VARCHAR(30) NOT NULL DEFAULT 'Pending';
ALTER TABLE invoice ADD COLUMN IF NOT EXISTS collected_date DATE;

-- ====================================
-- EXECUTION PHASE TIMESTAMPS
-- Real per-phase start/complete timestamps - previously only status
-- enums existed, with no way to answer "how long was this machine
-- actually stationed at X" for any job, past or present. Set
-- automatically inside start_execution_phase/complete_execution_phase -
-- zero new user input.
-- ====================================

ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_1_started_at TIMESTAMPTZ;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_1_completed_at TIMESTAMPTZ;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_2_started_at TIMESTAMPTZ;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_2_completed_at TIMESTAMPTZ;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_3_started_at TIMESTAMPTZ;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS phase_3_completed_at TIMESTAMPTZ;

-- ====================================
-- MACHINE DEPLOYMENT HISTORY
-- One row per continuous state segment for a machine - opened/closed
-- automatically at the exact phase-transition moments that already
-- exist (Start/Complete Current Phase), never a separate user action.
-- ====================================

CREATE TABLE IF NOT EXISTS machine_deployment_segments (
    id SERIAL PRIMARY KEY,
    machine_inventory_id BIGINT NOT NULL REFERENCES machine_inventory(id),
    execution_id BIGINT REFERENCES executions(id),
    segment_type VARCHAR(30) NOT NULL,
    start_latitude DOUBLE PRECISION,
    start_longitude DOUBLE PRECISION,
    end_latitude DOUBLE PRECISION,
    end_longitude DOUBLE PRECISION,
    place_name VARCHAR(255),
    purpose_label VARCHAR(255),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deployment_segments_machine ON machine_deployment_segments(machine_inventory_id);
CREATE INDEX IF NOT EXISTS idx_deployment_segments_open ON machine_deployment_segments(machine_inventory_id, ended_at);
