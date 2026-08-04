// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET ROLE PERMISSIONS
// Drives the sidebar and the Enquiry Workspace tab strip dynamically
// for the given role, replacing the hardcoded ROLE_MODULES map.
// ====================================

export async function getRolePermissions(

    roleName

){

    const response = await fetch(

        `${API}/roles/${encodeURIComponent(roleName)}/permissions`

    );

    if(!response.ok){

        return { role_name:roleName, nav_modules:[], workspace_tabs:[] };

    }

    return response.json();

}
