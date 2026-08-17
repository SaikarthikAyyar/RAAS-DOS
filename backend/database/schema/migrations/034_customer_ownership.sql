-- ====================================
-- CUSTOMER OWNERSHIP / ATTRIBUTION
-- owner_user_id: "Account Owner" - real user, reassignable, defaults
-- to the creating user at creation time.
-- created_by_user_id: permanently unchangeable, set once at creation
-- from the acting user, never accepted directly on any update payload.
-- Old free-text `owner` column stays in place, unused going forward -
-- non-destructive, matches this project's standing convention.
-- ====================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS owner_user_id INTEGER REFERENCES users(id);
ALTER TABLE customers ADD COLUMN IF NOT EXISTS created_by_user_id INTEGER REFERENCES users(id);
