-- Extends assets with the remaining Customer Request Section 2 fields
-- (material seen at site, access opening type, equipment-nearby, pain
-- point) so an existing asset carries a complete, reusable profile
-- instead of only division/plant/department/name/asset_type/cleaning_frequency.

ALTER TABLE assets ADD COLUMN IF NOT EXISTS observed_material VARCHAR(100);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS access_opening_type VARCHAR(100);
ALTER TABLE assets ADD COLUMN IF NOT EXISTS can_place_equipment_nearby BOOLEAN;
ALTER TABLE assets ADD COLUMN IF NOT EXISTS pain_point TEXT;
