-- A machine type can belong to several Service Configurations.
-- machines.service_configuration stays as the machine's PRIMARY config
-- (what the Ops Engine reads); this join table holds every config it is in.

CREATE TABLE IF NOT EXISTS machine_service_configurations (
    id SERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    service_configuration_id INTEGER NOT NULL REFERENCES service_configurations(id) ON DELETE CASCADE,
    CONSTRAINT uq_machine_service_configuration UNIQUE (machine_id, service_configuration_id)
);

-- Backfill from each ACTIVE machine's primary code (legacy inactive types, e.g. SCH-V3, are left out).
INSERT INTO machine_service_configurations (machine_id, service_configuration_id)
SELECT m.id, sc.id
FROM machines m
JOIN service_configurations sc ON sc.code = m.service_configuration
WHERE m.active
ON CONFLICT DO NOTHING;

-- Requested memberships: SCH 300/500/700 in HEAVY, PIPELINE and CUTTER; Rhino also in PIPELINE.
INSERT INTO machine_service_configurations (machine_id, service_configuration_id)
SELECT m.id, sc.id
FROM machines m, service_configurations sc
WHERE m.code IN ('VARAHA-SCH-300', 'VARAHA-SCH-500', 'VARAHA-SCH-700')
  AND sc.code IN ('SC-HEAVY', 'SC-PIPELINE', 'SC-CUTTER')
ON CONFLICT DO NOTHING;

INSERT INTO machine_service_configurations (machine_id, service_configuration_id)
SELECT m.id, sc.id
FROM machines m, service_configurations sc
WHERE m.code = 'RHINO' AND sc.code = 'SC-PIPELINE'
ON CONFLICT DO NOTHING;

-- Accessories those machines need go under the configs they were just added to.
INSERT INTO service_configuration_accessories (service_configuration_id, accessory_id)
SELECT DISTINCT sc.id, a.id
FROM machines m
JOIN service_configurations sc
  ON (m.code IN ('VARAHA-SCH-300', 'VARAHA-SCH-500', 'VARAHA-SCH-700') AND sc.code IN ('SC-HEAVY', 'SC-PIPELINE', 'SC-CUTTER'))
  OR (m.code = 'RHINO' AND sc.code = 'SC-PIPELINE')
JOIN LATERAL jsonb_array_elements_text(COALESCE(m.accessories, '[]'::jsonb)) AS n(name) ON true
JOIN accessories a ON a.name = n.name
ON CONFLICT DO NOTHING;
