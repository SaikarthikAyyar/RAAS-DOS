-- Demobilisation cost line on quotes (min/max like every other
-- commercial line). Older quotes keep NULL here - they were priced
-- before this line existed and are deliberately not recomputed.
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS demobilisation_cost_min FLOAT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS demobilisation_cost_max FLOAT;
