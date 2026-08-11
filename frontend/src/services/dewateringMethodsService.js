// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getDewateringMethods(){

    const response = await fetch(`${API}/dewatering-methods`);

    return response.json();

}


export async function createDewateringMethod(payload){

    const response = await fetch(

        `${API}/dewatering-methods`,

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


export async function updateDewateringMethod(id, payload){

    const response = await fetch(

        `${API}/dewatering-methods/${id}`,

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


export async function deleteDewateringMethod(id){

    const response = await fetch(

        `${API}/dewatering-methods/${id}`,

        { method:"DELETE" }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
