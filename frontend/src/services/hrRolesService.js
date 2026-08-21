// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getHrRoles(){

    const response = await fetch(`${API}/hr-roles`);

    return response.json();

}


export async function createHrRole(payload){

    const response = await fetch(

        `${API}/hr-roles`,

        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function updateHrRole(id, payload){

    const response = await fetch(

        `${API}/hr-roles/${id}`,

        {
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function deleteHrRole(id, actor, remark){

    const response = await fetch(

        `${API}/hr-roles/${id}`,

        {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ actor, remark })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
