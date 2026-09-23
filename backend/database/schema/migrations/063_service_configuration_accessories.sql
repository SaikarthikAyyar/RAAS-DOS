-- Direct, admin-editable link between a Service Configuration and the
-- Accessories that fall under it - independent of any specific
-- machine's own accessories list (that stays exactly as it is, still
-- used for kit-picking elsewhere). Backfilled once below from the
-- union of accessories already carried by machines currently assigned
-- to each Service Configuration, so the Business Masters "Accessories"
-- column shows exactly what it showed before this became editable.

CREATE TABLE IF NOT EXISTS service_configuration_accessories (
    id SERIAL PRIMARY KEY,
    service_configuration_id INTEGER NOT NULL REFERENCES service_configurations(id) ON DELETE CASCADE,
    accessory_id INTEGER NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
    CONSTRAINT uq_service_configuration_accessory UNIQUE (service_configuration_id, accessory_id)
);

CREATE INDEX IF NOT EXISTS idx_service_configuration_accessories_config
    ON service_configuration_accessories(service_configuration_id);

INSERT INTO service_configuration_accessories (service_configuration_id, accessory_id)
SELECT DISTINCT sc.id, a.id
FROM service_configurations sc
JOIN machines m ON m.service_configuration = sc.code
JOIN accessories a ON a.name IN (
    SELECT jsonb_array_elements_text(m.accessories)
)
ON CONFLICT (service_configuration_id, accessory_id) DO NOTHING;
