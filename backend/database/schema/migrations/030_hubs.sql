-- Hubs Business Master: hub name, region, and who owns Ops Review /
-- Techno-Commercial Approval for that hub. hub_name should match the
-- values in the existing nearestHubs lookup list. Feeds the "Hub"/
-- "Owner" columns on the new Reviews & Approvals module (Phase 16).

CREATE TABLE IF NOT EXISTS hubs (
    id SERIAL PRIMARY KEY,
    hub_name VARCHAR(150) UNIQUE NOT NULL,
    region VARCHAR(50),
    ops_owner VARCHAR(150),
    techno_approver VARCHAR(150),
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

INSERT INTO hubs (hub_name, region) VALUES
    ('Raigad (West)', 'West'),
    ('Jamshedpur (East)', 'East'),
    ('Coimbatore / Neyveli (South)', 'South'),
    ('Delhi-NCR (North)', 'North')
ON CONFLICT (hub_name) DO NOTHING;
