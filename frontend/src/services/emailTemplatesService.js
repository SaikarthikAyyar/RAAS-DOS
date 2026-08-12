// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getEmailTemplates(){

    const response = await fetch(`${API}/email-templates`);

    return response.json();

}


export async function getEmailTemplate(templateId){

    const response = await fetch(`${API}/email-templates/${templateId}`);

    return response.json();

}


export async function createEmailTemplate(payload){

    const response = await fetch(

        `${API}/email-templates`,

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


export async function updateEmailTemplate(templateId, payload){

    const response = await fetch(

        `${API}/email-templates/${templateId}`,

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


export async function deleteEmailTemplate(templateId){

    const response = await fetch(

        `${API}/email-templates/${templateId}`,

        { method:"DELETE" }

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

export async function addTemplateVariable(templateId, payload){

    const response = await fetch(

        `${API}/email-templates/${templateId}/variables`,

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


export async function updateTemplateVariable(templateId, variableId, payload){

    const response = await fetch(

        `${API}/email-templates/${templateId}/variables/${variableId}`,

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


export async function deleteTemplateVariable(templateId, variableId){

    const response = await fetch(

        `${API}/email-templates/${templateId}/variables/${variableId}`,

        { method:"DELETE" }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// RENDER / SEND
// ====================================

export async function renderEmailTemplate(templateId, variableValues){

    const response = await fetch(

        `${API}/email-templates/${templateId}/render`,

        {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ variable_values: variableValues })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function sendEmailTemplate(templateId, payload){

    const response = await fetch(

        `${API}/email-templates/${templateId}/send`,

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
