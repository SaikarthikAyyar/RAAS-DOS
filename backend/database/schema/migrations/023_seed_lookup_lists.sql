-- Seed data for lookup_lists / lookup_list_values - transcribes every
-- static option array currently in frontend/src/data/salesSurveyOptions.js
-- and frontend/src/data/customerMasterOptions.js, plus the hardcoded-
-- inline arrays confirmed in Section2_RequirementBasics.jsx,
-- SectionB_JobSludge.jsx, SectionC_Geometry.jsx, SectionD_Safety.jsx,
-- and SectionG_Insights.jsx, 1:1 by value - deduping the two identified
-- duplicate pairs into a single shared list each - while applying the
-- Phase 11 deltas (channel-partner Lead Source options, both Tank Type
-- "Other" flags, replaced Repeat Potential values) in this same pass.
-- Idempotent (ON CONFLICT DO NOTHING) - safe to re-run.
--
-- list_key mapping: JS export name with a trailing "Options"/"s"
-- stripped where unambiguous. See Phase 11 in the cumulative plan file.

-- ====================================
-- SECTION A
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('nearestHub', 'Nearest Hub', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Mumbai / Raigad',0),('Coimbatore',1),('Jamshedpur',2),('Delhi-NCR (North)',3)) AS v(value, ord)
WHERE list_key='nearestHub' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('urgency', 'Urgency', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Immediate',0),('1 Month',1),('2 Months',2),('3 Months',3)) AS v(value, ord)
WHERE list_key='urgency' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('trigger', 'Trigger', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Preventive Maintenance',0),('Breakdown',1),('Statutory / Compliance',2),('Customer Complaint',3),('New Project',4)) AS v(value, ord)
WHERE list_key='trigger' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- Phase 11 delta: replaced wholesale, old AMC-based values never inserted.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('repeatPotential', 'Repeat Potential', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('One time',0),('Semi-Annual',1),('Annual',2)) AS v(value, ord)
WHERE list_key='repeatPotential' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION B
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('jobType', 'Job Type', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Tank / Pit / Sump',0),('Industrial Tank',1),('Clarifier / ETP / STP',2),('Drain / Channel',3),
             ('Pipeline / Conduit',4),('Open Channel / Intake Well',5),('Pond / Lagoon',6),
             ('Bathymetric Survey / Pre-Survey / Post-Survey',7),('Hot Zone / Furnace / Ash',8),
             ('Emergency / Breakdown',9),('Reservoir',10),('Other / To Review',11)) AS v(value, ord)
WHERE list_key='jobType' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('materialCategory', 'Material Category', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Watery slurry',0),('Pumpable sludge',1),('Settled sludge',2),('Sticky sludge',3),
             ('Heavy sludge / scale',4),('Ash / abrasive slurry',5),('Chemical sludge',6),
             ('Dry powder / ash',7),('Pipeline deposits',8),('Mixed random waste',9),('Unknown',10)) AS v(value, ord)
WHERE list_key='materialCategory' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('sludgeHardness', 'Sludge Hardness', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Free flowing',0),('Semi-viscous',1),('Sticky',2),('Hard settled',3),('Abrasive',4),
             ('Corrosive',5),('Fibrous',6),('Oily/emulsified',7),('Unknown',8)) AS v(value, ord)
WHERE list_key='sludgeHardness' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- Dedup: debrisLevels/debrisOptions were byte-identical in JS.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('debrisLevel', 'Debris Level', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('None / negligible',0),('Minor screenable debris',1),('Moderate plastic/fibres',2),
             ('Heavy random debris',3),('Wood / logs / stones / metal',4),('Unknown',5)) AS v(value, ord)
WHERE list_key='debrisLevel' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('hazardLevel', 'Hazard Level', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('None',0),('Chemical / corrosive',1),('Hot material',2),('Confined gas risk',3),
             ('Biomedical / infectious',4),('Explosive / flammable',5),('Unknown',6)) AS v(value, ord)
WHERE list_key='hazardLevel' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('yesNoUnknown', 'Yes / No / Unknown', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes',0),('No',1),('Unknown',2)) AS v(value, ord)
WHERE list_key='yesNoUnknown' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('waterVisibility', 'Water Visibility', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Clear',0),('Slightly Turbid',1),('Moderately Turbid',2),('Highly Turbid',3),('Opaque',4)) AS v(value, ord)
WHERE list_key='waterVisibility' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('flowability', 'Flowability', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Free-flowing',0),('Semi-solid',1),('Solid-compacted',2)) AS v(value, ord)
WHERE list_key='flowability' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- New: previously hardcoded inline in SectionB_JobSludge.jsx.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('permitRequired', 'Permit Required', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes',0),('No',1)) AS v(value, ord)
WHERE list_key='permitRequired' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION C
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('accessType', 'Access Type', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Open top',0),('Manhole',1),('Side entry',2),('Pipeline access',3),
             ('Open pond edge',4),('Restricted access',5),('Not known',6)) AS v(value, ord)
WHERE list_key='accessType' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- Phase 11 delta: new "Other" row with is_other=true (this list has no
-- Other today). Distinct list_key from "assetType" below despite the
-- shared post-rename "Tank Type" display label - two different fields.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('geometryTankType', 'Tank Type (Survey Geometry)', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, v.other, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Cuboidal',false,0),('Cylindrical',false,1),('Other',true,2)) AS v(value, other, ord)
WHERE list_key='geometryTankType' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('tankLocation', 'Location of Tank', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Overhead',0),('Underground',1)) AS v(value, ord)
WHERE list_key='tankLocation' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('setupComplexity', 'Setup Complexity', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Low',0),('Medium',1),('High',2)) AS v(value, ord)
WHERE list_key='setupComplexity' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- Dedup: equipmentNearbyOptions (exported, unused) + Section2's
-- "Equipment placement nearby?" inline array + SectionC's "Equipment
-- Nearby Possible?" inline array all share these exact 4 values.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('equipmentNearby', 'Equipment Nearby', 'shared')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes, within 10 m',0),('Yes, within 20 m',1),('No',2),('Unknown',3)) AS v(value, ord)
WHERE list_key='equipmentNearby' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION D
-- ====================================

-- New: previously hardcoded inline in SectionD_Safety.jsx.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('powerAvailable', 'Power Available', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('230V 1PH',0),('415V 3PH',1),('Generator Required',2),('Hydraulic Powerpack',3),('Unknown',4)) AS v(value, ord)
WHERE list_key='powerAvailable' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- New: previously hardcoded inline in SectionD_Safety.jsx.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('ehsRestriction', 'EHS Restriction', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Low',0),('Medium',1),('High',2),('Critical',3)) AS v(value, ord)
WHERE list_key='ehsRestriction' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION E
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('abrasiveness', 'Abrasiveness', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Low',0),('Medium',1),('High',2)) AS v(value, ord)
WHERE list_key='abrasiveness' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('ph', 'pH / Corrosiveness', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Low / Neutral',0),('Acidic',1),('Alkaline',2)) AS v(value, ord)
WHERE list_key='ph' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('pumpPower', 'Pump Power Source', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Customer 3 Phase',0),('Customer 1 Phase',1),('Generator required',2),
             ('Hydraulic powerpack',3),('Battery / DC',4),('Not known',5)) AS v(value, ord)
WHERE list_key='pumpPower' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('pumpRisk', 'Pump Risk', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('None',0),('Abrasion',1),('Corrosion',2),('Clogging (high solids)',3),('Cavitation (deep suction)',4)) AS v(value, ord)
WHERE list_key='pumpRisk' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION F
-- ====================================

-- Distinct from yesNoUnknown (3 values) - this list has 4.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('yesNoNA', 'Yes / No / Unknown / NA', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes',0),('No',1),('Unknown',2),('NA',3)) AS v(value, ord)
WHERE list_key='yesNoNA' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('finalForm', 'Expected Final Form', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Drainable Sludge',0),('Cake',1),('Dry Solids',2)) AS v(value, ord)
WHERE list_key='finalForm' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('settling', 'Natural Settling Ability', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Poor',0),('Average',1),('Good',2)) AS v(value, ord)
WHERE list_key='settling' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('space', 'Space for Bags / Holding', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Poor',0),('Limited',1),('Good',2)) AS v(value, ord)
WHERE list_key='space' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('cakeHandling', 'Cake Handling Scope', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Customer To Handle',0),('RAAS To Handle',1)) AS v(value, ord)
WHERE list_key='cakeHandling' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- SECTION G
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('currentMethod', 'Current Method', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Manual',0),('Robotic',1),('Never done before',2),('Other',3)) AS v(value, ord)
WHERE list_key='currentMethod' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('shutdown', 'Shutdown Window', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('4 hr/day',0),('8 hr/day',1),('12 hr/day',2),('24 hr/day',3)) AS v(value, ord)
WHERE list_key='shutdown' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('dischargeMedium', 'Discharge Medium', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Drain',0),('ETP',1),('STP',2),('Tanker',3),('Container',4),('Dewatering Bags',5),
             ('Filter Press',6),('Customer Designated Area',7),('Others',8)) AS v(value, ord)
WHERE list_key='dischargeMedium' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- New: previously hardcoded inline in SectionG_Insights.jsx.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('budgetKnown', 'Budget Known', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes',0),('No',1)) AS v(value, ord)
WHERE list_key='budgetKnown' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- TEMPERATURE / SAMPLE / SUPPORT / DISPOSAL
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('temperatureRange', 'Temperature Range', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Ambient',0),('Hot (40°C - 70°C)',1),('Very Hot (>70°C)',2),('Cold (<10°C)',3)) AS v(value, ord)
WHERE list_key='temperatureRange' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('sampleAvailability', 'Sample Available', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Yes',0),('No',1)) AS v(value, ord)
WHERE list_key='sampleAvailability' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('accessSupport', 'Access Support', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('None',0),('Scaffolding',1),('Working Platform',2),('Customer Provided',3)) AS v(value, ord)
WHERE list_key='accessSupport' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('customerSupport', 'Customer Support Equipment', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('None',0),('Crane',1),('Hydra',2),('Forklift',3)) AS v(value, ord)
WHERE list_key='customerSupport' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('disposalRoute', 'Disposal Route', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('ETP',0),('STP',1),('Drain',2),('Tanker',3),('Filter Press',4),
             ('Customer Designated Area',5),('Others',6)) AS v(value, ord)
WHERE list_key='disposalRoute' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('disposalResponsibility', 'Disposal Responsibility', 'sales_survey')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('RAAS',0),('Customer',1)) AS v(value, ord)
WHERE list_key='disposalResponsibility' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- CUSTOMER REQUEST
-- ====================================

-- Phase 11 delta: 4 channel-partner-only rows appended, tagged so
-- they only surface when the caller requests conditional_tag=
-- 'channel_partner' (i.e. the enquiry's customer has industry =
-- "Channel Partner").
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('leadSource', 'Lead Source', 'customer_request')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Existing Customer',0),('Referral',1),('Tender',2),('Website',3),('Email',4),
             ('Phone',5),('Sales Visit',6),('Distributor',7),('Other',8)) AS v(value, ord)
WHERE list_key='leadSource' ON CONFLICT (lookup_list_id, value) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, 'channel_partner', v.ord FROM lookup_lists,
    (VALUES ('Channel Partner - Re Sustainability',100),
             ('Channel Partner - Wa Innovation/Candor',101),
             ('Channel Partner - Sangdi India',102),
             ('Channel Partner - Metex',103)) AS v(value, ord)
WHERE list_key='leadSource' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- Phase 11 delta: the pre-existing "Other" row gets is_other=true
-- (was a plain inert string before). Backs Customer Request Section 2's
-- field, relabeled "Tank Type" (was "Asset Type") - state key asset_type
-- unchanged. Distinct list_key from "geometryTankType" above.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('assetType', 'Tank Type (Customer Request)', 'customer_request')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, v.other, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Tank',false,0),('Pit',false,1),('Sump',false,2),('Clarifier',false,3),('Lagoon',false,4),
             ('Pipeline',false,5),('Reactor',false,6),('Scrubber',false,7),('Other',true,8)) AS v(value, other, ord)
WHERE list_key='assetType' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- New: previously hardcoded inline in Section2_RequirementBasics.jsx.
INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('cleaningFrequency', 'Cleaning Frequency', 'customer_request')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('One Time',0),('Weekly',1),('Monthly',2),('Quarterly',3),('Half Yearly',4),('Yearly',5)) AS v(value, ord)
WHERE list_key='cleaningFrequency' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('natureOfJob', 'Nature of Job', 'customer_request')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Emergency / Urgent',0),('Critical',1),('Important',2),('Low',3)) AS v(value, ord)
WHERE list_key='natureOfJob' ON CONFLICT (lookup_list_id, value) DO NOTHING;

-- ====================================
-- BUSINESS MASTERS (Customer master)
-- ====================================

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('customerCategory', 'Customer Category', 'business_masters')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Key Account / Strategic',0),('Standard Industrial',1),('High Compliance / Hazard',2),
             ('Pilot / Trial',3),('Low Payment Confidence',4)) AS v(value, ord)
WHERE list_key='customerCategory' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('customerIndustry', 'Industry', 'business_masters')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('Steel',0),('Thermal Power',1),('Cement',2),('Chemicals',3),('Oil & Gas',4),
             ('Mining',5),('Gas',6),('Maintenance / Facilities',7),('Channel Partner',8)) AS v(value, ord)
WHERE list_key='customerIndustry' ON CONFLICT (lookup_list_id, value) DO NOTHING;

INSERT INTO lookup_lists (list_key, display_name, module) VALUES
    ('customerRegion', 'Region', 'business_masters')
ON CONFLICT (list_key) DO NOTHING;
INSERT INTO lookup_list_values (lookup_list_id, value, is_other, conditional_tag, sort_order)
SELECT id, v.value, false, NULL::varchar, v.ord FROM lookup_lists,
    (VALUES ('West',0),('East',1),('South',2),('North',3)) AS v(value, ord)
WHERE list_key='customerRegion' ON CONFLICT (lookup_list_id, value) DO NOTHING;
