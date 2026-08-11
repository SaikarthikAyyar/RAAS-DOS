// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getServiceConfigurations(){

    const response = await fetch(`${API}/service-configurations`);

    return response.json();

}


export async function createServiceConfiguration(payload){

    const response = await fetch(

        `${API}/service-configurations`,

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


export async function updateServiceConfiguration(id, payload){

    const response = await fetch(

        `${API}/service-configurations/${id}`,

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


export async function deleteServiceConfiguration(id){

    const response = await fetch(

        `${API}/service-configurations/${id}`,

        { method:"DELETE" }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
