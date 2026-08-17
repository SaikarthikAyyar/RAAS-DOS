-- Phase 21D: per-role, per-task permission matrix for Business Masters
-- tabs + Enquiry Workspace tabs. module_tasks holds the real catalog of
-- actionable buttons per module (module_id already exists on `modules`);
-- role_task_permissions is the per-role allow/deny for each task.
-- Approve/Reject/Accept/Send-back-style buttons are deliberately never
-- represented here - those are governed by the hub_approvers mechanism
-- (Phase 21C), not this matrix.

CREATE TABLE IF NOT EXISTS module_tasks (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    task_key VARCHAR(100) NOT NULL,
    task_label VARCHAR(255) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE(module_id, task_key)
);

CREATE TABLE IF NOT EXISTS role_task_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    module_task_id INTEGER NOT NULL REFERENCES module_tasks(id) ON DELETE CASCADE,
    allowed BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(role_id, module_task_id)
);
