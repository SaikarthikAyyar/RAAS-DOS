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
// NAV MATRIX (admin-facing, editable)
// ====================================

export async function getNavMatrix(){

    const response = await fetch(

        `${API}/role-permissions/nav-matrix`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}

export async function saveNavMatrix(cells){

    const response = await fetch(

        `${API}/role-permissions/nav-matrix`,

        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ cells })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// TASK MATRIX (Phase 21D, admin-facing, editable, scoped to one role)
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

export async function saveTaskMatrix(roleId, tabs){

    const response = await fetch(

        `${API}/role-permissions/task-matrix/${roleId}`,

        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ tabs })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
