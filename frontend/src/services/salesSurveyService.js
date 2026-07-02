// ====================================
// API
// ====================================

const API = "http://127.0.0.1:8000";


// ====================================
// SALES SURVEY PREFILL
// ====================================

export async function getSalesPrefill(

customerRequestId

){

const response = await fetch(

`${API}/customer-request/${customerRequestId}/sales-prefill`

);


return response.json();

}




// ====================================
// CREATE SALES SURVEY
// ====================================

export async function createSalesSurvey(

payload

){

const response = await fetch(

`${API}/sales-survey`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(

payload

)

}

);


return response.json();

}


// ====================================
// GET SALES SURVEY
// ====================================

export async function getSalesSurvey(

surveyId

){

const response = await fetch(

`${API}/sales-survey/${surveyId}`

);


return response.json();

}

export async function getCustomers(){

const response=

await fetch(

`${API}/customers`

);

return response.json();

}
