-- Machine sensor telemetry received over MQTT (RAAS-DOS subscribes to the
-- broker directly). The broker keeps nothing (QoS 0, not retained), so
-- what job execution needs is persisted here:
--   * machine_inventory: the machine's last known reading (survives a
--     backend restart, lets Inventory / Fleet Units / Execution show
--     "last seen" and last values while a machine is offline);
--   * machine_telemetry_log: a sampled trail (about one row / 30 s)
--     kept only while the machine is on a job, tied to that execution.
ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS telemetry_bot_id VARCHAR(64);
ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS last_telemetry_at TIMESTAMPTZ;
ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS last_telemetry JSONB;

CREATE TABLE IF NOT EXISTS machine_telemetry_log (
    id BIGSERIAL PRIMARY KEY,
    machine_inventory_id BIGINT NOT NULL REFERENCES machine_inventory(id) ON DELETE CASCADE,
    execution_id BIGINT REFERENCES executions(id) ON DELETE SET NULL,
    bot_id VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_machine_telemetry_log_machine_time
    ON machine_telemetry_log(machine_inventory_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_machine_telemetry_log_execution
    ON machine_telemetry_log(execution_id, recorded_at DESC);
