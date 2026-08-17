-- ====================================
-- HUB APPROVERS
-- Multi-user Ops Review / Techno-Commercial approval standing per
-- hub - replaces the free-text single-name Hub.ops_owner/
-- techno_approver columns (left in place, unused, non-destructively).
-- Being assigned here IS the real per-user approval standing for
-- that hub - not just a display label.
-- ====================================

CREATE TABLE IF NOT EXISTS hub_approvers (
    id SERIAL PRIMARY KEY,
    hub_id INTEGER NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    approval_type VARCHAR(30) NOT NULL,   -- 'ops_review' | 'techno_commercial'
    created_at TIMESTAMP DEFAULT now(),
    UNIQUE(hub_id, user_id, approval_type)
);
