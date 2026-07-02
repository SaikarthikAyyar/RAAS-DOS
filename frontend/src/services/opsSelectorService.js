// ====================================
// API
// ====================================

const API="http://127.0.0.1:8000";


// ====================================
// GET SALES SURVEYS
// ====================================

export async function getOpsSurveys(){

const response=

await fetch(

`${API}/ops-selector/surveys`

);

return response.json();

}


// ====================================
// GET OPS PREVIEW
// ====================================

export async function getOpsPrefill(

salesSurveyId

){

const response=

await fetch(

`${API}/ops-selector/prefill/${salesSurveyId}`

);

return response.json();

}


// ====================================
// SAVE OPS SELECTION
// ====================================

export async function saveOpsSelector(

payload

){

const response=

await fetch(

`${API}/ops-selector`,

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

const data=

await response.json();

if(

!response.ok

){

throw data;

}

return data;

}