-- Machines/Fleet + Pump Master as real, admin-editable Business Masters.
-- Machines migrates backend/data/machine_library.py's existing 9 machines
-- (kept in place, unimported by the live path) merged with the real spec
-- fields the wireframe's bm.machines carries that we didn't have yet
-- (rate, materialConstruction, maxOperatingTemp, hazardRating,
-- maxVerticalLift, craneRequired, vehicle info, hubsAvailable). Pumps is a
-- genuinely new catalog (we previously only had a flat descriptive
-- string per machine, no real pump data at all).
--
-- minimum_width/minimum_height are kept at OUR existing
-- machine_library.py values (not the wireframe's, which differ for 5 of
-- the 9 machines - a separate/later spec revision, not the same number)
-- specifically so the Ops Engine's access-fit scoring stays byte-identical
-- to today's behavior during this phase's pure data-source swap.
--
-- debris_tolerance is re-seeded to the wireframe's simple
-- None/Minor/Moderate/Heavy vocabulary (ours were longer descriptive
-- phrases) so the DEBRIS_RANK comparison used by 18B's scoring can work.
--
-- This table is distinct from the pre-existing machine_inventory table
-- (real physical fleet units for Allocation/Execution scheduling) -
-- this one is the type/spec catalog the Ops Engine scores against.

CREATE TABLE IF NOT EXISTS machines (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    service_configuration VARCHAR(30),
    power_type VARCHAR(100),
    minimum_width NUMERIC,
    minimum_height NUMERIC,
    base_output_per_day NUMERIC,
    base_output_basis VARCHAR(255),
    recommended_max_volume NUMERIC,
    pump_package VARCHAR(150),
    hose_size VARCHAR(100),
    preferred_job_types JSONB DEFAULT '[]',
    preferred_materials JSONB DEFAULT '[]',
    debris_tolerance VARCHAR(30),
    setup_complexity VARCHAR(30),
    crew INTEGER,
    approval_gate VARCHAR(100),
    accessories JSONB DEFAULT '[]',
    description TEXT,
    rate NUMERIC(12,2),
    material_construction VARCHAR(100),
    max_operating_temp NUMERIC,
    hazard_rating VARCHAR(50),
    max_vertical_lift NUMERIC,
    crane_required VARCHAR(10),
    vehicle VARCHAR(150),
    vehicle_payload VARCHAR(150),
    dims VARCHAR(100),
    weight VARCHAR(50),
    hubs_available JSONB DEFAULT '[]',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pumps (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    hp NUMERIC,
    phase VARCHAR(30),
    voltage VARCHAR(30),
    peak_current VARCHAR(30),
    density_range VARCHAR(100),
    flow_rate NUMERIC,
    type VARCHAR(100),
    max_suction_lift NUMERIC,
    max_discharge_head NUMERIC,
    max_solids_size NUMERIC,
    hazard_rating VARCHAR(50),
    power_source VARCHAR(50),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS machine_pump_compatibility (
    id SERIAL PRIMARY KEY,
    machine_id INTEGER NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    pump_id INTEGER NOT NULL REFERENCES pumps(id) ON DELETE CASCADE,
    UNIQUE(machine_id, pump_id)
);

-- ====================================
-- SEED: MACHINES
-- ====================================

INSERT INTO machines (
    code, name, service_configuration, power_type, minimum_width, minimum_height,
    base_output_per_day, base_output_basis, recommended_max_volume, pump_package, hose_size,
    preferred_job_types, preferred_materials, debris_tolerance, setup_complexity,
    crew, approval_gate, accessories, description, rate, material_construction,
    max_operating_temp, hazard_rating, max_vertical_lift, crane_required,
    vehicle, vehicle_payload, dims, weight, hubs_available
) VALUES

('SCE-V1-M2', 'SCE Compact Electric Rover', 'SC-COMPACT', 'Electric', 450, 450,
 42, 'm3 pumpable sludge per 8-hr shift, normal access', 270, '3HP / 2 inch pump', '2 inch',
 '["Tank / Pit / Sump","Drain / Channel","Clarifier / ETP / STP"]',
 '["Watery slurry","Pumpable sludge","Settled sludge"]', 'Minor', 'Low',
 4, 'Ops Review', '["Basic hose kit","Console","Lighting","Suction mouth"]',
 'Compact robotic sludge cleaning for small pits, tanks and drains.', 45000, 'Stainless Steel 304',
 60, 'Standard', 6, 'No',
 'TATA Ace / Bolero Pick-up', '0.75T open pick-up', '1100 x 380 x 367 mm', '180-200 kg', '["Raigad (West)"]'),

('SCH-300-PBM', 'SCH-300 / SCH-PBM Truck Mounted Hydraulic Sludge Machine', 'SC-HEAVY', 'Hydraulic / Truck Mounted', 500, 500,
 60, 'm3 pumpable/settled sludge per 8-hr shift', 750, '10HP / 4 inch pump', '4 inch',
 '["Tank / Pit / Sump","Industrial Tank","Clarifier / ETP / STP"]',
 '["Pumpable sludge","Settled sludge","Heavy sludge / scale"]', 'Moderate', 'Medium',
 6, 'Ops Review', '["Truck-mounted hydraulic package","Powerpack","Winch","4 inch hose kit","Cutter/drum option","Safety kit"]',
 'Truck mounted hydraulic sludge cleaning configuration.', 85000, 'Mild Steel',
 80, 'Standard', 10, 'Yes',
 'TATA LPT Truck', '5T flatbed / crane-assist', '1800 x 650 x 575 mm', '900-1100 kg', '["Coimbatore / Neyveli (South)"]'),

('SCH-V3', 'SCH V3 Hydraulic Crawler', 'SC-CUTTER', 'Hydraulic', 450, 450,
 45, 'm3 sticky/settled sludge per 8-hr shift', 220, '5HP / 4 inch pump', '4 inch',
 '["Industrial Tank","Tank / Pit / Sump"]',
 '["Sticky sludge","Settled sludge","Heavy sludge / scale"]', 'Moderate', 'Medium',
 5, 'Ops Review', '["Hydraulic powerpack","Roller","Cutter","Hose kit","Safety kit"]',
 'Hydraulic crawler for cutter-assisted sludge cleaning.', 65000, 'Mild Steel',
 70, 'Standard', 8, 'No',
 'To confirm', '3T flatbed', '1800 x 380 x 367 mm', '450-550 kg', '["Coimbatore / Neyveli (South)"]'),

('RHINO', 'RHINO Heavy Sludge / Scale Cleaner', 'SC-HEAVY', 'Hydraulic + Electric', 1100, 1500,
 210, 'm3 heavy sludge/scale per 8-hr shift', 1500, '10HP / 4 inch pump', '4 inch',
 '["Clarifier / ETP / STP","Industrial Tank","Tank / Pit / Sump"]',
 '["Heavy sludge / scale","Pumpable sludge","Settled sludge"]', 'Heavy', 'High',
 7, 'Ops + Engineering Review', '["Heavy crawler","Round cutter","10HP pump","Safety kit"]',
 'Heavy duty sludge and scale removal platform.', 85000, 'Stainless Steel 316',
 90, 'ATEX Zone 2', 14, 'Yes',
 'TATA 407 / Ashok Leyland Bada Dost', '7T flatbed + crane', 'L2600 x W900 x H1400 mm', '2 T', '["Jamshedpur (East)"]'),

('VARAHA-700', 'Varaha 700 Heavy Cutter / High Volume', 'SC-HEAVY', 'Hydraulic', 750, 1100,
 90, 'm3 heavy sludge/scale per 8-hr shift', 700, '40HP / 4 inch pump', '4 inch',
 '["Industrial Tank","Hot Zone / Furnace / Ash","Tank / Pit / Sump"]',
 '["Heavy sludge / scale","Ash / abrasive slurry","Settled sludge"]', 'Heavy', 'High',
 7, 'Engineering Review', '["Heavy cutter","High volume pump","Powerpack","Hose kit"]',
 'High volume heavy cutter configuration.', 85000, 'Stainless Steel 316',
 120, 'ATEX Zone 2', 10, 'No',
 'To confirm', '5T flatbed', '1300 x 700 x 1000 mm', '800-1200 kg', '["Jamshedpur (East)"]'),

('VARAHA-500-PBM', 'Varaha 500 Pipeline Cleaning Machine', 'SC-PIPELINE', 'Hydraulic', 500, 500,
 0, 'Meters of pipeline cleared per day, not m3-based', 0, 'Pipeline pump package', 'Pipeline hose',
 '["Pipeline / Conduit"]',
 '["Pipeline deposits","Heavy sludge / scale"]', 'Moderate', 'High',
 5, 'Engineering Review', '["Pipeline cutter","Hydraulic powerpack","Cable","Hose kit"]',
 'Dedicated pipeline cleaning system.', 95000, 'Mild Steel',
 70, 'Standard', NULL, 'No',
 'To confirm', '3T flatbed', '1600 x 440 x 700 mm', 'To confirm', '["Delhi-NCR (North)"]'),

('MATSYA-DIESEL', 'Matsya Diesel Operated Aqua Machine', 'SC-AQUA', 'Diesel', NULL, NULL,
 360, 'm3 watery/ash slurry per 8-hr shift', 3000, 'Aqua pump package', 'Floating hose',
 '["Pond / Lagoon","Open Channel / Intake Well"]',
 '["Watery slurry","Pumpable sludge","Pond silt","Ash / abrasive slurry"]', 'Minor', 'Medium',
 5, 'Engineering Review', '["Floating platform","Pump","Discharge hose","Retrieval kit"]',
 'Diesel operated floating sludge removal platform.', 75000, 'Mild Steel',
 60, 'Standard', 8, 'Yes',
 'Large platform - to confirm', '10T+ low-loader', 'L5900 x W1700 x H1260 mm', '3 T', '["Coimbatore / Neyveli (South)"]'),

('MATSYA-ELECTRIC', 'Matsya Electric Cable Operated Aqua Machine', 'SC-AQUA', 'Electric', NULL, NULL,
 360, 'm3 watery/ash slurry per 8-hr shift', 3000, 'Aqua pump package', 'Floating hose',
 '["Pond / Lagoon","Open Channel / Intake Well"]',
 '["Watery slurry","Pumpable sludge","Pond silt"]', 'Minor', 'Medium',
 5, 'Engineering Review', '["Floating platform","Cable control","Pump","Retrieval kit"]',
 'Electric floating sludge removal platform.', 75000, 'Mild Steel',
 60, 'Standard', 8, 'Yes',
 'To confirm', '10T+ low-loader', 'L5900 x W1700 x H1260 mm', '3 T', '["Coimbatore / Neyveli (South)"]'),

('MATSYA-BATHY', 'Matsya Bathymetric Survey Machine', 'SC-SURVEY', 'Survey', NULL, NULL,
 0, 'Survey-only, not applicable', 0, 'Survey only', NULL,
 '["Bathymetric Survey / Pre-Survey","Pond / Lagoon","Open Channel / Intake Well"]',
 '["Surveying","Waterbody depth mapping","Pond silt assessment"]', 'None', 'Low',
 2, 'Ops + Engineering Review', '["GPS","Depth sensor","Laptop","Retrieval kit"]',
 'Survey only machine.', 40000, 'Stainless Steel 304',
 50, 'Standard', NULL, 'No',
 'TATA Ace / Bolero Pick-up', '0.75T open pick-up', '1180 x 700 x 390 mm', '12.8 kg', '["Coimbatore / Neyveli (South)"]')

ON CONFLICT (code) DO NOTHING;

-- ====================================
-- SEED: PUMPS
-- ====================================

INSERT INTO pumps (
    code, name, hp, phase, voltage, peak_current, density_range, flow_rate,
    type, max_suction_lift, max_discharge_head, max_solids_size, hazard_rating, power_source
) VALUES

('PMP-001', 'Submersible Slurry Pump 5HP', 5, 'Single', '230V', '18A', 'Up to 1.3 SG', 15,
 'Submersible: Onboard Robot', 5, 15, 15, 'Standard', 'Electric'),

('PMP-002', 'Submersible Slurry Pump 10HP', 10, 'Three', '415V', '22A', 'Up to 1.4 SG', 30,
 'Submersible: Onboard Robot', 6, 20, 20, 'Standard', 'Electric'),

('PMP-003', 'External Diaphragm Pump', 7.5, 'Three', '415V', '16A', 'Up to 1.5 SG', 20,
 'Non-Submersible: External', 7, 15, 25, 'ATEX Zone 1', 'Electric'),

('PMP-004', 'External Trash Pump', 15, 'Three', '415V', '28A', 'Up to 1.2 SG', 45,
 'Non-Submersible: External', 8, 20, 50, 'Standard', 'Electric'),

('PMP-005', 'Dry Suction Vacuum Unit', 20, 'Three', '415V', '35A', 'Up to 1.6 SG', 25,
 'Dry Suction', 9, 10, 40, 'Standard', 'Electric'),

('PMP-006', 'Wet Suction Vacuum Unit', 20, 'Three', '415V', '35A', 'Up to 1.3 SG', 35,
 'Wet Suction', 9, 10, 35, 'Standard', 'Electric'),

('PMP-007', 'Cable-operated Submersible 15HP', 15, 'Three', '415V', '26A', 'Up to 1.5 SG', 40,
 'Submersible: Onboard Robot', 6, 25, 30, 'Standard', 'Electric'),

('PMP-008', 'Diesel-driven External Pump', 25, 'N/A (Diesel)', 'N/A', 'N/A', 'Up to 1.6 SG', 50,
 'Non-Submersible: External', 8, 20, 45, 'Standard', 'Diesel')

ON CONFLICT (code) DO NOTHING;

-- ====================================
-- SEED: MACHINE <-> PUMP COMPATIBILITY
-- ====================================

INSERT INTO machine_pump_compatibility (machine_id, pump_id)
SELECT m.id, p.id FROM machines m, pumps p WHERE
    (m.code='SCE-V1-M2' AND p.code IN ('PMP-001','PMP-002')) OR
    (m.code='SCH-300-PBM' AND p.code IN ('PMP-003','PMP-004')) OR
    (m.code='SCH-V3' AND p.code IN ('PMP-003','PMP-007')) OR
    (m.code='RHINO' AND p.code IN ('PMP-004','PMP-007','PMP-005')) OR
    (m.code='VARAHA-700' AND p.code IN ('PMP-004','PMP-007')) OR
    (m.code='VARAHA-500-PBM' AND p.code IN ('PMP-003','PMP-004')) OR
    (m.code='MATSYA-DIESEL' AND p.code IN ('PMP-008')) OR
    (m.code='MATSYA-ELECTRIC' AND p.code IN ('PMP-007','PMP-002'))
ON CONFLICT (machine_id, pump_id) DO NOTHING;
