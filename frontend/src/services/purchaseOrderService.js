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


export async function uploadPurchaseOrder(enquiryId, { file, poNumber, poValue, uploadedBy }){

    const formData = new FormData();

    formData.append("file", file);

    if(poNumber) formData.append("po_number", poNumber);
    if(poValue!==undefined && poValue!==null && poValue!=="") formData.append("po_value", poValue);
    if(uploadedBy) formData.append("uploaded_by", uploadedBy);

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


export async function deletePurchaseOrder(poId){

    const response = await fetch(

        `${API}/purchase-orders/${poId}`,

        { method:"DELETE" }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
