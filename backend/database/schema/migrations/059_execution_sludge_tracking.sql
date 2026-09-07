-- Real daily sludge-output tracking for Job Execution (Phase 2),
-- replacing the bare manual "Output Completed" number with two real
-- field methods (Flow Meter Reading, Sample Collection/Settling),
-- both formula-verified against real client worksheets. A day's
-- calculated sludge output IS that day's contribution to
-- executions.total_output - total_output for a tracked execution is
-- the live-recomputed sum of every daily log's sludge_output_m3, not
-- a one-time incremental add, so correcting any reading at any time
-- always keeps the total honest with no separate reconciliation step.

ALTER TABLE executions ADD COLUMN IF NOT EXISTS progress_tracking_mode VARCHAR(20) NOT NULL DEFAULT 'MANUAL';
-- 'MANUAL' (today's existing bare-number entry, untouched) | 'SLUDGE_LOG'
-- (this feature). Flips to SLUDGE_LOG automatically the moment the
-- first daily log is created for that execution - permanent after
-- that, so a job can never mix manually-typed and calculated output
-- into the same total_output.

CREATE TABLE IF NOT EXISTS execution_sludge_daily_logs (
    id SERIAL PRIMARY KEY,
    execution_id BIGINT NOT NULL REFERENCES executions(id),
    log_date DATE NOT NULL,
    method VARCHAR(20) NOT NULL,                    -- 'FLOW_METER' | 'SETTLING' - chosen fresh per day
    start_tf DOUBLE PRECISION NOT NULL,             -- prefilled from the previous day's end_tf when one exists (TF never resets)
    end_tf DOUBLE PRECISION,                        -- nullable until the day is wrapped up
    total_sludge_pump_minutes DOUBLE PRECISION,     -- FLOW_METER only
    flask_volume_ml DOUBLE PRECISION DEFAULT 1000,  -- SETTLING only
    -- Cached, always-recomputed outputs (never hand-edited directly) -
    -- kept as real columns for a stable audit trail and fast reads,
    -- but recalculated in full any time a reading or the fields above
    -- change:
    avg_fr DOUBLE PRECISION,
    fr_per_minute DOUBLE PRECISION,
    total_sludge_pumping_estimate_m3 DOUBLE PRECISION,  -- FLOW_METER only
    total_tf_m3 DOUBLE PRECISION,
    pct_sludge DOUBLE PRECISION,
    pct_water DOUBLE PRECISION,
    sludge_output_m3 DOUBLE PRECISION,
    water_output_m3 DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(execution_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_execution_sludge_daily_logs_execution_id ON execution_sludge_daily_logs(execution_id);

CREATE TABLE IF NOT EXISTS execution_sludge_readings (
    id SERIAL PRIMARY KEY,
    daily_log_id INTEGER NOT NULL REFERENCES execution_sludge_daily_logs(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tf_reading DOUBLE PRECISION NOT NULL,           -- always required, both methods
    fr_reading DOUBLE PRECISION,                    -- required for FLOW_METER's avg-FR calc; reference-only for SETTLING
    settled_sludge_volume_ml DOUBLE PRECISION,      -- required for SETTLING; unused for FLOW_METER
    source VARCHAR(20) NOT NULL DEFAULT 'MANUAL',   -- 'MANUAL' | 'DEVICE' - the sensor-readiness hook; never gates editability
    recorded_by VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_execution_sludge_readings_daily_log_id ON execution_sludge_readings(daily_log_id);
