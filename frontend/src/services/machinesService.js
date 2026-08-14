// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getMachines(){

    const response = await fetch(`${API}/machines`);

    return response.json();

}


export async function createMachine(payload){

    const response = await fetch(

        `${API}/machines`,

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


export async function updateMachine(id, payload){

    const response = await fetch(

        `${API}/machines/${id}`,

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


export async function deleteMachine(id, actor, remark){

    const response = await fetch(

        `${API}/machines/${id}`,

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
