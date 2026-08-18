// ====================================
// API
// ====================================

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
// CUSTOMERS REPORT (3-sheet Excel export - Summary/Assets/Contacts)
// ====================================

export async function getCustomersReport(){

    const response = await fetch(

        `${API}/business-master/customers-report`

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
