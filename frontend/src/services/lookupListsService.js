// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getLookupLists(){

    const response = await fetch(`${API}/lookup-lists`);

    return response.json();

}


export async function getLookupList(listKey, conditionalTag){

    const query = conditionalTag ? `?conditional_tag=${encodeURIComponent(conditionalTag)}` : "";

    const response = await fetch(`${API}/lookup-lists/${listKey}${query}`);

    return response.json();

}


export async function addLookupValue(listKey, payload){

    const response = await fetch(

        `${API}/lookup-lists/${listKey}/values`,

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


export async function deleteLookupValue(valueId, actor, remark){

    const response = await fetch(

        `${API}/lookup-lists/values/${valueId}`,

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
