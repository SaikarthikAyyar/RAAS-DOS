-- Business Masters changes (Phase 15) need a third notification
-- flavor distinct from the existing broadcast (Type A) and targeted
-- (Type B, recipient_user_id) shapes: visible to everyone EXCEPT the
-- acting user, always flagged important, always carrying a remark.
-- All three columns default to values that make every existing row
-- (and every future Type A/B row) behave exactly as it does today.

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_important BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS remark TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS exclude_actor BOOLEAN NOT NULL DEFAULT false;
