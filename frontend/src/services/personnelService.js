// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getPersonnel(){

    const response = await fetch(`${API}/personnel`);

    return response.json();

}


export async function createPersonnel(payload){

    const response = await fetch(

        `${API}/personnel`,

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


export async function updatePersonnel(id, payload){

    const response = await fetch(

        `${API}/personnel/${id}`,

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


export async function deletePersonnel(id, actor, remark){

    const response = await fetch(

        `${API}/personnel/${id}`,

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
// DOCUMENTS
// Real multipart upload - matches the PO-upload convention elsewhere
// in this app (uploadPurchaseOrder in purchaseOrderService.js).
// ====================================

export async function uploadPersonnelDocument(personnelId, file, documentType, validTill, actor, remark){

    const formData = new FormData();

    formData.append("file", file);
    formData.append("document_type", documentType);

    if(validTill){
        formData.append("valid_till", validTill);
    }

    formData.append("actor_user_id", actor.user_id);
    formData.append("actor_name", actor.name);
    formData.append("actor_role", actor.role);
    formData.append("remark", remark);

    const response = await fetch(

        `${API}/personnel/${personnelId}/documents`,

        {
            method:"POST",
            body:formData
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function updatePersonnelDocument(documentId, payload){

    const response = await fetch(

        `${API}/personnel-documents/${documentId}`,

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


export async function deletePersonnelDocument(documentId, actor, remark){

    const response = await fetch(

        `${API}/personnel-documents/${documentId}`,

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
