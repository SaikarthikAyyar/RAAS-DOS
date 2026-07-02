import {

API

}

from "../config/api";


// ====================================
// CREATE CUSTOMER REQUEST
// ====================================

export async function createCustomerRequest(

payload

){

const response=

await fetch(

`${API}/customer-request`,

{

method:"POST",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(

payload

)

}

);

return response.json();

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