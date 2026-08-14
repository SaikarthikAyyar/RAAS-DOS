// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getQuoteTemplates(){

    const response = await fetch(`${API}/quote-templates`);

    return response.json();

}


export function quoteTemplatePreviewUrl(templateId){

    return `${API}/quote-templates/${templateId}/preview`;

}


export async function getQuoteTemplate(templateId){

    const response = await fetch(`${API}/quote-templates/${templateId}`);

    return response.json();

}


export async function createQuoteTemplate(payload){

    const response = await fetch(

        `${API}/quote-templates`,

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


export async function updateQuoteTemplate(templateId, payload){

    const response = await fetch(

        `${API}/quote-templates/${templateId}`,

        {
            method:"PATCH",
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


export async function deleteQuoteTemplate(templateId, actor, remark){

    const response = await fetch(

        `${API}/quote-templates/${templateId}`,

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


// ====================================
// VARIABLES
// ====================================

export async function addQuoteTemplateVariable(templateId, payload){

    const response = await fetch(

        `${API}/quote-templates/${templateId}/variables`,

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


export async function updateQuoteTemplateVariable(templateId, variableId, payload){

    const response = await fetch(

        `${API}/quote-templates/${templateId}/variables/${variableId}`,

        {
            method:"PATCH",
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


export async function deleteQuoteTemplateVariable(templateId, variableId, actor, remark){

    const response = await fetch(

        `${API}/quote-templates/${templateId}/variables/${variableId}`,

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
