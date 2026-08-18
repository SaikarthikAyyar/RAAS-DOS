-- Real, pre-existing data bug found while investigating why Ops Review's
-- Approve button stayed permanently blocked ("This enquiry's hub could not
-- be determined - approval standing cannot be verified.") for real
-- enquiries. Migration 030_hubs.sql's own comment states hub_name should
-- match the values in the nearestHub lookup list - but the 4 seeded rows
-- used a different, longer region-suffixed format for 3 of the 4 hubs:
--
--   hubs.hub_name              nearestHub lookup list value (real, live)
--   'Raigad (West)'          vs 'Mumbai / Raigad'
--   'Jamshedpur (East)'      vs 'Jamshedpur'
--   'Coimbatore / Neyveli (South)' vs 'Coimbatore'
--   'Delhi-NCR (North)'      vs 'Delhi-NCR (North)'   (already matched)
--
-- Every real Sales Survey's nearest_hub column already holds the SHORT
-- lookup-list form (confirmed via direct query - changing those historical
-- rows would be far more invasive than renaming 4 Hub master rows), so the
-- Hub master is what gets corrected here, not survey data.
--
-- This exact-string join is used in three real places, all silently broken
-- for 3 of 4 hubs before this fix:
--   1. hub_approval_service.resolve_enquiry_hub() - every real approval
--      gate (Ops Review / Quote & Commercial / Commercial Approval)
--      couldn't resolve a hub for most enquiries, permanently blocking
--      every decision button with "hub could not be determined".
--   2. reviews_service._hub_for_enquiry() - the Reviews & Approvals
--      module's Hub/Owner columns went blank for the same 3 hubs.
--   3. ops_engine.score_hub_fit() compares Sales Survey nearest_hub
--      against each Machine's hubs_available list (seeded in migration
--      032_machines_pumps.sql using the same long-form strings) - the
--      Hub Fit scoring bonus (+10 vs +5) has never actually fired for
--      real survey data on 3 of 4 hubs. Fixed in the same migration since
--      it's the identical root cause.

UPDATE hubs SET hub_name = 'Mumbai / Raigad' WHERE hub_name = 'Raigad (West)';
UPDATE hubs SET hub_name = 'Jamshedpur' WHERE hub_name = 'Jamshedpur (East)';
UPDATE hubs SET hub_name = 'Coimbatore' WHERE hub_name = 'Coimbatore / Neyveli (South)';
-- 'Delhi-NCR (North)' already matches - no change needed.

UPDATE machines
SET hubs_available = REPLACE(hubs_available::text, '"Raigad (West)"', '"Mumbai / Raigad"')::jsonb
WHERE hubs_available::text LIKE '%Raigad (West)%';

UPDATE machines
SET hubs_available = REPLACE(hubs_available::text, '"Jamshedpur (East)"', '"Jamshedpur"')::jsonb
WHERE hubs_available::text LIKE '%Jamshedpur (East)%';

UPDATE machines
SET hubs_available = REPLACE(hubs_available::text, '"Coimbatore / Neyveli (South)"', '"Coimbatore"')::jsonb
WHERE hubs_available::text LIKE '%Coimbatore / Neyveli (South)%';
