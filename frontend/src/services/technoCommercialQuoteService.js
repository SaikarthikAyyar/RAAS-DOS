// ====================================
// API
// ====================================

const API = "http://127.0.0.1:8000";


// ====================================
// GET OPS SELECTIONS
// ====================================

export async function getQuoteOpsSelections(){

const response =

await fetch(

`${API}/ops-selector/surveys`

);

return response.json();

}


// ====================================
// CREATE QUOTE
// ====================================

export async function saveQuote(

payload

){

const response =

await fetch(

`${API}/quote`,

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

const data =

await response.json();

if(

!response.ok

){

throw data;

}

return data;

}


// ====================================
// GET QUOTE
// ====================================

export async function getQuote(

opsSelectionId

){

const response =

await fetch(

`${API}/quote/by-ops/${opsSelectionId}`

);

return response.json();

}


// ====================================
// GET OPS LIST
// ====================================

export async function getQuoteOps(){

const response=

await fetch(

`${API}/quote/ops`

);

return response.json();

}