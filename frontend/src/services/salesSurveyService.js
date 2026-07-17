// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


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

// ====================================
// GET SURVEYS FOR CUSTOMER
// ====================================

export async function getCustomerSurveys(

customerRequestId

){

console.log(

"[SalesSurvey Service] Loading surveys for customer:",

customerRequestId

);

const response = await fetch(

`${API}/sales-surveys/customer/${customerRequestId}`

);

const data = await response.json();

console.log(

"[SalesSurvey Service] Surveys:",

data

);

return data;

}


// ====================================
// GET CUSTOMER SURVEY
// ====================================

export async function getCustomerSurvey(

customerRequestId,

surveyId

){

console.log(

"[SalesSurvey Service] Loading Survey:",

surveyId

);

const response = await fetch(

`${API}/sales-surveys/customer/${customerRequestId}/${surveyId}`

);

const data = await response.json();

console.log(

"[SalesSurvey Service] Survey Loaded:",

data

);

return data;

}