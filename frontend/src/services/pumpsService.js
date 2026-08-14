// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getPumps(){

    const response = await fetch(`${API}/pumps`);

    return response.json();

}


export async function createPump(payload){

    const response = await fetch(

        `${API}/pumps`,

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


export async function updatePump(id, payload){

    const response = await fetch(

        `${API}/pumps/${id}`,

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


export async function deletePump(id, actor, remark){

    const response = await fetch(

        `${API}/pumps/${id}`,

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
