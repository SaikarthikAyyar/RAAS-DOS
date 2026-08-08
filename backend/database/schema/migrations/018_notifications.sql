-- Notifications pipeline (Phase 9a). Every database change (create/
-- update/delete) gets one `notifications` row + one `notification_changes`
-- row per changed field. Read state is per-user via `notification_reads`
-- (a row = "this user has seen this notification"; absence = unread
-- for that user) rather than a flat boolean, since read state needs
-- to be independent per user, not shared globally.

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(20) NOT NULL,

    user_id INTEGER REFERENCES users(id),
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,

    enquiry_id INTEGER REFERENCES enquiries(id),
    customer_name VARCHAR(150),

    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_changes (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    field_name VARCHAR(150) NOT NULL,
    previous_value TEXT,
    updated_value TEXT
);

CREATE TABLE IF NOT EXISTS notification_reads (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    read_at TIMESTAMP DEFAULT now(),
    UNIQUE(notification_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_enquiry_id ON notifications(enquiry_id);
CREATE INDEX IF NOT EXISTS idx_notification_changes_notification_id ON notification_changes(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_reads_user_id ON notification_reads(user_id);
