// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET ALL ROLES
// ====================================

export async function getRoles(){

    console.log(

        "\n========== ADMINISTRATION ROLES =========="

    );

    const response = await fetch(

        `${API}/administration/roles`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "==========================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// GET SINGLE ROLE
// ====================================

export async function getRole(

    roleId

){

    console.log(

        "\n========== GET ROLE =========="

    );

    console.log(

        "Role ID:",

        roleId

    );

    const response = await fetch(

        `${API}/administration/roles/${roleId}`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "==============================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// CREATE ROLE
// ====================================

export async function createRole(

    payload

){

    console.log(

        "\n========== CREATE ROLE =========="

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/roles`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(

                payload

            )

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// UPDATE ROLE
// ====================================

export async function updateRole(

    roleId,

    payload

){

    console.log(

        "\n========== UPDATE ROLE =========="

    );

    console.log(

        "Role:",

        roleId

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/roles/${roleId}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(

                payload

            )

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// DELETE ROLE
// ====================================

export async function deleteRole(

    roleId

){

    console.log(

        "\n========== DELETE ROLE =========="

    );

    console.log(

        "Role:",

        roleId

    );

    const response = await fetch(

        `${API}/administration/roles/${roleId}`,

        {

            method:"DELETE"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}