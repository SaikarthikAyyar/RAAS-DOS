-- Sample Collection (Settling) method: flask volume can vary sample to
-- sample (different flask sizes may genuinely be used through the day),
-- so it's now captured per-reading instead of once for the whole day.
-- execution_sludge_daily_logs.flask_volume_ml is left in place, unused
-- by new readings going forward - non-destructive, matches this
-- project's established convention for superseded columns.

ALTER TABLE execution_sludge_readings ADD COLUMN IF NOT EXISTS flask_volume_ml DOUBLE PRECISION;

-- Surfaces exactly why a day's split couldn't be computed (an estimate
-- smaller than Total(TF), a settled sample bigger than its own flask,
-- etc.) instead of silently emitting a nonsensical percentage - a real
-- column, not a transient value, so it survives being re-fetched on a
-- plain GET rather than only existing right after a recompute.
ALTER TABLE execution_sludge_daily_logs ADD COLUMN IF NOT EXISTS invalid_reason TEXT;

-- Backfill: any existing Settling-method reading with no flask volume
-- of its own inherits its day's old single flask_volume_ml value, so
-- pre-existing test data doesn't silently look "incomplete" the
-- moment this ships.
UPDATE execution_sludge_readings r
SET flask_volume_ml = d.flask_volume_ml
FROM execution_sludge_daily_logs d
WHERE d.id = r.daily_log_id
  AND d.method = 'SETTLING'
  AND r.flask_volume_ml IS NULL
  AND d.flask_volume_ml IS NOT NULL;
