-- Sales Survey Section C: new computed Sludge Volume field, stored
-- alongside the existing Estimated Volume the same way (a real,
-- persisted snapshot, not just a live UI display) - equal to
-- Sludge Height (geometry.drop_to_floor) x Length/Dia x Width, the
-- specific portion of Estimated Volume that's actually sludge.
ALTER TABLE sales_surveys ADD COLUMN IF NOT EXISTS sludge_volume DOUBLE PRECISION;
