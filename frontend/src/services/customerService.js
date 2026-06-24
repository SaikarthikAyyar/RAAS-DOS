import {

API

}

from "../config/api";


export async function createCustomerRequest(

payload

){

console.log("CUSTOMER", customer)

console.log("REQUIREMENT", requirement)

console.log("UPLOADS", uploads)

console.log("FINAL PAYLOAD", payload)

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
