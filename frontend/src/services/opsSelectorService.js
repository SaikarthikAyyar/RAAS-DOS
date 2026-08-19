// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


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
// GET OPS SELECTION
// ====================================

export async function getOpsSelection(

opsSelectorId

){

const response=

await fetch(

`${API}/ops-selector/${opsSelectorId}`

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
// GET MACHINE SCORING TABLE
// ====================================

export async function getOpsScoring(

opsSelectorId

){

const response=

await fetch(

`${API}/ops-selector/${opsSelectorId}/scoring`

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
// SAVE DEPLOYMENT PLAN
// ====================================

export async function saveDeploymentPlan(

opsSelectorId,

payload

){

const response = await fetch(

`${API}/ops-selector/${opsSelectorId}/deployment-plan`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify(payload)

}

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
// SAVE HUMAN OVERRIDE
// ====================================

export async function saveOpsOverride(

opsSelectorId,

overrideMachine,

overrideReason,

enquiryId,

actor

){

const response = await fetch(

`${API}/ops-selector/${opsSelectorId}/override`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

override_machine:overrideMachine,

override_reason:overrideReason,

enquiry_id:enquiryId,

actor

})

}

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
// SAVE OPS REVIEW DECISION
// ====================================

export async function saveOpsReviewDecision(

opsSelectorId,

status,

reviewNote,

enquiryId,

actor

){

const response = await fetch(

`${API}/ops-selector/${opsSelectorId}/review`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status,

review_note:reviewNote,

enquiry_id:enquiryId ?? null,

actor:actor ?? null

})

}

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
