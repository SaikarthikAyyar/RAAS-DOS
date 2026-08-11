-- Populates lookup_lists.description with a "Used in: <module> -> <field>"
-- string for every list, matching the wireframe's own LOOKUP_META
-- convention (each card names which form/field the list feeds).
-- Idempotent - safe to re-run.

UPDATE lookup_lists SET description = 'Used in: Customer Request & Sales Survey → Nearest Hub' WHERE list_key = 'nearestHub';
UPDATE lookup_lists SET description = 'Used in: Customer Request & Sales Survey → Urgency' WHERE list_key = 'urgency';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Trigger' WHERE list_key = 'trigger';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Repeat Potential' WHERE list_key = 'repeatPotential';
UPDATE lookup_lists SET description = 'Used in: Customer Request & Sales Survey → Job Type' WHERE list_key = 'jobType';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Material seen at site; Sales Survey → Material Category' WHERE list_key = 'materialCategory';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Sludge Hardness' WHERE list_key = 'sludgeHardness';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Debris Level, Debris / Fibers Present' WHERE list_key = 'debrisLevel';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Hazard Level' WHERE list_key = 'hazardLevel';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → several Yes/No/Unknown fields (Is Material Pumpable, Can Material Flow, Water/Air/Confined Space, Scaffolding, Crane, etc.)' WHERE list_key = 'yesNoUnknown';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Water Visibility' WHERE list_key = 'waterVisibility';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Flowability' WHERE list_key = 'flowability';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Permit Required' WHERE list_key = 'permitRequired';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Access opening type; Sales Survey → Access Type' WHERE list_key = 'accessType';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Tank Type (Geometry section)' WHERE list_key = 'geometryTankType';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Location of Tank' WHERE list_key = 'tankLocation';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Setup Complexity' WHERE list_key = 'setupComplexity';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Equipment placement nearby?; Sales Survey → Equipment Nearby Possible?' WHERE list_key = 'equipmentNearby';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Power Available' WHERE list_key = 'powerAvailable';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → EHS Restriction' WHERE list_key = 'ehsRestriction';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Abrasiveness' WHERE list_key = 'abrasiveness';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → pH / Corrosiveness' WHERE list_key = 'ph';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Power Source for Pump' WHERE list_key = 'pumpPower';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Pump Risk' WHERE list_key = 'pumpRisk';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Dewatering yes/no fields (Visible Free Water, Oily/Emulsified, Filtrate Route, Moisture Guarantee)' WHERE list_key = 'yesNoNA';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Expected Final Form' WHERE list_key = 'finalForm';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Natural Settling Ability' WHERE list_key = 'settling';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Space for Bags / Holding?' WHERE list_key = 'space';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Cake Handling Scope' WHERE list_key = 'cakeHandling';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Current Method' WHERE list_key = 'currentMethod';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Shutdown Window' WHERE list_key = 'shutdown';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Discharge Medium' WHERE list_key = 'dischargeMedium';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Budget Known' WHERE list_key = 'budgetKnown';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Temperature Range' WHERE list_key = 'temperatureRange';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Sample Available' WHERE list_key = 'sampleAvailability';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Access Support' WHERE list_key = 'accessSupport';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Customer Support Equipment' WHERE list_key = 'customerSupport';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Disposal Route' WHERE list_key = 'disposalRoute';
UPDATE lookup_lists SET description = 'Used in: Sales Survey → Disposal Responsibility' WHERE list_key = 'disposalResponsibility';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Lead Source' WHERE list_key = 'leadSource';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Tank Type (New Site & Requirements)' WHERE list_key = 'assetType';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Cleaning Frequency' WHERE list_key = 'cleaningFrequency';
UPDATE lookup_lists SET description = 'Used in: Customer Request → Nature of Job' WHERE list_key = 'natureOfJob';
UPDATE lookup_lists SET description = 'Used in: Business Masters → Customers → Category' WHERE list_key = 'customerCategory';
UPDATE lookup_lists SET description = 'Used in: Business Masters → Customers → Industry' WHERE list_key = 'customerIndustry';
UPDATE lookup_lists SET description = 'Used in: Business Masters → Customers → Region' WHERE list_key = 'customerRegion';
