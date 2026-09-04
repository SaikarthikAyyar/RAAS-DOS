// ====================================
// API
// ====================================

import { withDateStamp } from "../utils/exportFilename";

const API = import.meta.env.VITE_API_URL;


// ====================================
// LIST CUSTOMERS
// ====================================

export async function getCustomers(){

    const response = await fetch(

        `${API}/business-master/customers`

    );

    return response.json();

}


// ====================================
// LIST A CUSTOMER'S ASSETS
// For the "Existing asset" dropdown on Customer Request.
// ====================================

export async function getCustomerAssets(

    customerId

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}/assets`

    );

    return response.json();

}


// ====================================
// ASSET DETAIL (single asset)
// For the Enquiry Workspace's Asset Profile card.
// ====================================

export async function getAsset(

    assetId

){

    const response = await fetch(

        `${API}/business-master/assets/${assetId}`

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


// ====================================
// CREATE CUSTOMER
// ====================================

export async function createCustomer(

    payload

){

    const response = await fetch(

        `${API}/business-master/customers`,

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


// ====================================
// REASSIGN ACCOUNT OWNER
// ====================================

export async function updateCustomerOwner(

    customerId,

    payload

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}/owner`,

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


// ====================================
// UPDATE CUSTOMER (full edit)
// ====================================

export async function updateCustomer(

    customerId,

    payload

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}`,

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


// ====================================
// DELETE CUSTOMER
// ====================================

export async function deleteCustomer(

    customerId,

    actor,

    remark

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}`,

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
// UPDATE ASSET (division/plant/department/name)
// ====================================

export async function updateAsset(

    assetId,

    payload

){

    const response = await fetch(

        `${API}/business-master/assets/${assetId}`,

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


// ====================================
// DELETE ASSET
// ====================================

export async function deleteAsset(

    assetId,

    actor,

    remark

){

    const response = await fetch(

        `${API}/business-master/assets/${assetId}`,

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
// DELETE CONTACT
// ====================================

export async function deleteContact(

    customerId,

    contactId,

    actor,

    remark

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}/contacts/${contactId}`,

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
// CUSTOMER DETAIL (360)
// ====================================

export async function getCustomerDetail(

    customerId

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}`

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


// ====================================
// EXPORT CUSTOMER 360 (real styled .xlsx generated server-side via
// openpyxl - see backend/reporting/customer_360_xlsx.py - fetched as a
// blob and triggered as a normal browser download, matching the same
// convention already used for the Fleet Forecast export)
// ====================================

export async function exportCustomer360(customerId, companyName){

    const response = await fetch(
        `${API}/business-master/customers/${customerId}/export`
    );

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to export this customer."}));
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // The backend's Content-Disposition filename isn't readable here -
    // it needs an explicit CORS expose_headers entry the app doesn't
    // set, same reason the Fleet Forecast export never reads it either.
    // Computed client-side instead, matching that same convention.
    const safeName = (companyName || "Customer").replace(/\s/g, "_");

    const link = document.createElement("a");
    link.href = url;
    link.download = withDateStamp(`${safeName}_360_Export.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

}


// ====================================
// ADD CONTACT
// ====================================

export async function addContact(

    customerId,

    payload

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}/contacts`,

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


// ====================================
// SET / UPDATE NEXT FOLLOW-UP
// ====================================

export async function setFollowUp(

    customerId,

    payload

){

    const response = await fetch(

        `${API}/business-master/customers/${customerId}/follow-up`,

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
