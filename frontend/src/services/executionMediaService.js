// ====================================
// API
// Mirrors customerMediaService.js's shape (Sales Survey's own media
// upload), scoped to an execution instead of a customer request.
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function uploadExecutionMedia(executionId, uploads, uploadedBy){

    const formData = new FormData();

    (uploads.photos || []).forEach(file=>{
        formData.append("photos", file);
    });

    (uploads.videos || []).forEach(file=>{
        formData.append("videos", file);
    });

    if(uploadedBy){
        formData.append("uploaded_by", uploadedBy);
    }

    const response = await fetch(

        `${API}/execution/${executionId}/media`,

        {
            method: "POST",
            body: formData
        }

    );

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to upload media."}));
    }

    return response.json();

}


export async function getExecutionMedia(executionId){

    const response = await fetch(`${API}/execution/${executionId}/media`);

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to load media."}));
    }

    return response.json();

}
