-- Phase 38: source/destination coordinates for Mobilisation/Demobilisation
-- route mapping + distance calculation, and a machine's own "last known
-- position" so Business Masters / Fleet & Availability can dynamically
-- reflect it. Additive only, per this project's standing convention.

ALTER TABLE executions ADD COLUMN IF NOT EXISTS source_latitude DOUBLE PRECISION;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS source_longitude DOUBLE PRECISION;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS destination_latitude DOUBLE PRECISION;
ALTER TABLE executions ADD COLUMN IF NOT EXISTS destination_longitude DOUBLE PRECISION;

ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS current_latitude DOUBLE PRECISION;
ALTER TABLE machine_inventory ADD COLUMN IF NOT EXISTS current_longitude DOUBLE PRECISION;
