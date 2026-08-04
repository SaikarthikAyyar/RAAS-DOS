-- Distinguishes nav-level modules ('nav') from Enquiry Workspace tab
-- entries ('workspace_tab') inside the same modules/role_permissions
-- tables, so one dynamic permission mechanism drives both the
-- sidebar and the workspace tab strip. Part of the Sales Executive
-- role / dynamic-permissions initiative (2026-08-04).

ALTER TABLE modules ADD COLUMN IF NOT EXISTS module_type VARCHAR(30) DEFAULT 'nav';
