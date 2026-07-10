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

 const data=await response.json()

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
