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


// ====================================
// TASK MATRIX (Phase 21D, merged with nav access - Phase 25 -
// admin-facing, editable, scoped to one role). The old standalone
// nav-matrix endpoints/getNavMatrix/saveNavMatrix were removed once
// Navigation Access folded into this same screen - every role's nav
// access + task access now saves in one call.
// ====================================

export async function getTaskMatrix(roleId){

    const response = await fetch(

        `${API}/role-permissions/task-matrix/${roleId}`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}

export async function saveTaskMatrix(roleId, tabs, navModules = []){

    const response = await fetch(

        `${API}/role-permissions/task-matrix/${roleId}`,

        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ tabs, nav_modules:navModules })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
