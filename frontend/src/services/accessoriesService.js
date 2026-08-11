// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getAccessories(){

    const response = await fetch(`${API}/accessories`);

    return response.json();

}


export async function createAccessory(payload){

    const response = await fetch(

        `${API}/accessories`,

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


export async function updateAccessory(id, payload){

    const response = await fetch(

        `${API}/accessories/${id}`,

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


export async function deleteAccessory(id){

    const response = await fetch(

        `${API}/accessories/${id}`,

        { method:"DELETE" }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
