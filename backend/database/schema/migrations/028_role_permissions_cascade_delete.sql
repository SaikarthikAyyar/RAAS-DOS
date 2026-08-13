-- Deleting a role (or, defensively, a module) must clean up its
-- role_permissions rows too - these rows are meaningless without
-- their parent. Without this, deleting a role that has ever been
-- touched by the Navigation Access matrix's Save (which creates a
-- full role x module row set, not just the checked ones) fails with
-- an FK violation, which the frontend sees as an opaque CORS/network
-- error rather than a real error message.

ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_role_id_fkey;
ALTER TABLE role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;

ALTER TABLE role_permissions DROP CONSTRAINT IF EXISTS role_permissions_module_id_fkey;
ALTER TABLE role_permissions
    ADD CONSTRAINT role_permissions_module_id_fkey
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE;
