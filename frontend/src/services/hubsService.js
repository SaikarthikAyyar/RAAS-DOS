// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getHubs(){

    const response = await fetch(`${API}/hubs`);

    return response.json();

}


export async function createHub(payload){

    const response = await fetch(

        `${API}/hubs`,

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


export async function updateHub(id, payload){

    const response = await fetch(

        `${API}/hubs/${id}`,

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


export async function deleteHub(id, actor, remark){

    const response = await fetch(

        `${API}/hubs/${id}`,

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
