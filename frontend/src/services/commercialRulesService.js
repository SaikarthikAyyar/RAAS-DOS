// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getCommercialRules(){

    const response = await fetch(`${API}/commercial-rules`);

    if(response.status === 404){
        return null;
    }

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function updateCommercialRules(payload){

    const response = await fetch(

        `${API}/commercial-rules`,

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


export async function getCustomerCategories(){

    const response = await fetch(`${API}/customer-categories`);

    return response.json();

}


export async function createCustomerCategory(payload){

    const response = await fetch(

        `${API}/customer-categories`,

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


export async function deleteCustomerCategory(id, actor, remark){

    const response = await fetch(

        `${API}/customer-categories/${id}`,

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
