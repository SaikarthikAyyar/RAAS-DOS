// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getMachineInventory(){

    const response = await fetch(`${API}/machine-inventory`);

    return response.json();

}


export async function getMachineTypes(){

    const response = await fetch(`${API}/machines`);

    return response.json();

}


export async function createMachineInventory(payload){

    const response = await fetch(

        `${API}/machine-inventory`,

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


export async function updateMachineInventory(id, payload){

    const response = await fetch(

        `${API}/machine-inventory/${id}`,

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


export async function deleteMachineInventory(id, actor, remark){

    const response = await fetch(

        `${API}/machine-inventory/${id}`,

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
