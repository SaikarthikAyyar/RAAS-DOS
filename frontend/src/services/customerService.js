import { API } from "../config/api";

export async function createCustomerRequest(payload){

 console.log("SERVICE RECEIVED",payload)

 const response=await fetch(
   `${API}/customer-request`,
   {
     method:"POST",

     headers:{
       "Content-Type":"application/json"
     },

     body:JSON.stringify(payload)
   }
 )

  const data = await response.json();

  if (!response.ok) {
      throw data;
  }


 console.log("SERVER RESPONSE",data)

 return data
}







// ====================================
// SEARCH CUSTOMER
// ====================================

export async function searchCustomer(

company_name

){

const response=

await fetch(

`${API}/customer-search?company_name=${encodeURIComponent(company_name)}`

);

if(

response.status===404

){

return null;

}

return response.json();

}


// ====================================
// GET CUSTOMER REQUEST
// ====================================

export async function getCustomerRequest(

    customerId

){

    const response = await fetch(

        `${API}/customer-request/${customerId}`

    );

    const data = await response.json();

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// UPDATE CUSTOMER REQUEST (post-creation edit)
// ====================================

export async function updateCustomerRequest(customerId, payload){

  const response = await fetch(
    `${API}/customer-request/${customerId}`,
    {
      method:"PUT",

      headers:{
        "Content-Type":"application/json"
      },

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
// GET CUSTOMER REQUEST EDIT PREFILL
// ====================================

export async function getCustomerRequestEditPrefill(customerId){

  const response = await fetch(
    `${API}/customer-request/${customerId}/edit-prefill`
  );

  const data = await response.json();

  if(!response.ok){
    throw data;
  }

  return data;
}