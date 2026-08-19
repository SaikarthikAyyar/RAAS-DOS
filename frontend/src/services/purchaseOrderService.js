// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function listPurchaseOrders(enquiryId){

    const response = await fetch(`${API}/enquiries/${enquiryId}/purchase-orders`);

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


export async function uploadPurchaseOrder(enquiryId, { file, uploadedBy, actor }){

    const formData = new FormData();

    formData.append("file", file);

    if(uploadedBy) formData.append("uploaded_by", uploadedBy);

    if(actor?.user_id) formData.append("actor_user_id", actor.user_id);

    if(actor?.role) formData.append("actor_role", actor.role);

    const response = await fetch(

        `${API}/enquiries/${enquiryId}/purchase-orders`,

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


export async function deletePurchaseOrder(poId, actor){

    const response = await fetch(

        `${API}/purchase-orders/${poId}`,

        {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ actor })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
