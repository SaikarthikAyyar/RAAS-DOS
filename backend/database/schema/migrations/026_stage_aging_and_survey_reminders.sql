-- ====================================
-- Aging: reset on every stage transition, precise to the second.
-- ====================================

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS stage_entered_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Backfill: best available proxy for "last stage change" on existing rows.
UPDATE enquiries SET stage_entered_at = updated_at;


-- ====================================
-- Survey Reminder: one row per pending/fired/cancelled reminder.
-- threshold_seconds is a plain countdown from created_at - NOT compared
-- against the enquiry's aging value.
-- ====================================

CREATE TABLE IF NOT EXISTS survey_reminders (
    id SERIAL PRIMARY KEY,
    enquiry_id INTEGER NOT NULL REFERENCES enquiries(id),
    set_by_user_id INTEGER NOT NULL REFERENCES users(id),
    set_by_name VARCHAR(150) NOT NULL,
    threshold_seconds INTEGER NOT NULL,
    stage_at_set VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fired_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_survey_reminders_enquiry_id ON survey_reminders(enquiry_id);


-- ====================================
-- Targeted (per-recipient) notifications, additive to the existing
-- broadcast system. NULL = unchanged broadcast behavior.
-- ====================================

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_user_id INTEGER REFERENCES users(id);
