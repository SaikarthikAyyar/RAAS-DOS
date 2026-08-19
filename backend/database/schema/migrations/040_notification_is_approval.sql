-- Phase 27: a new, more specific notification highlight than
-- is_important - approval GATE DECISIONS (Ops Review, Quote &
-- Commercial, Commercial Approval - Approve/Reject/Sent back) and the
-- new "Request Approval" ping both set this true. Unlike every other
-- notification type (broadcast, or Business Masters' is_important),
-- these are also targeted - one row per real hub-approver for that
-- gate (recipient_user_id set per row), not everyone.
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_approval BOOLEAN NOT NULL DEFAULT false;
