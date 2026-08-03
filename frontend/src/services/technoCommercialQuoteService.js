// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


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
// SAVE TECHNO-COMMERCIAL APPROVAL DECISION
// ====================================

export async function saveTechnoApproval(

quoteId,

status,

approvedBy,

note

){

const response = await fetch(

`${API}/quote/${quoteId}/techno-approval`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

status,

approved_by:approvedBy,

note

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
// GET OPS LIST
// ====================================

export async function getQuoteOps(){

const response=

await fetch(

`${API}/quote/ops`

);

return response.json();

}


// ====================================
// GET QUOTE PREVIEW
// ====================================

export async function getQuotePreview(

    opsSelectionId

){

    const response =

    await fetch(

        `${API}/quote/preview/${opsSelectionId}`

    );

    return response.json();

}

// ====================================
// CUSTOMER APPROVE QUOTE
// ====================================

export async function approveQuote(

    quoteId

){

    const response =

    await fetch(

        `${API}/quote/${quoteId}/approve`,

        {

            method:"POST"

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
// CUSTOMER REQUEST REVISION
// ====================================

export async function requestQuoteRevision(

    quoteId

){

    const response =

    await fetch(

        `${API}/quote/${quoteId}/revision`,

        {

            method:"POST"

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
// QUOTE & COMMERCIAL TAB
// ====================================

export async function getQuoteHistory(

    opsSelectionId

){

    const response = await fetch(

        `${API}/quote/history/${opsSelectionId}`

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


export async function updateInternalExtra(

    quoteId,

    enabled,

    amount,

    note

){

    const response = await fetch(

        `${API}/quote/${quoteId}/internal-extra`,

        {

            method:"PUT",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({enabled, amount, note})

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


export async function updateValidTill(

    quoteId,

    validTill

){

    const response = await fetch(

        `${API}/quote/${quoteId}/valid-till`,

        {

            method:"PUT",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({valid_till:validTill})

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


export async function releaseQuoteToClient(

    quoteId,

    releasedBy

){

    const response = await fetch(

        `${API}/quote/${quoteId}/release`,

        {

            method:"POST",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({released_by:releasedBy})

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


// ====================================
// FLAG QUOTE REVISION REQUESTED
// (blocks Proceed to Commercial Approval
// until a fresh quote version is saved)
// ====================================

export async function flagQuoteRevisionRequested(

    quoteId,

    requestedBy

){

    const response = await fetch(

        `${API}/quote/${quoteId}/request-revision`,

        {

            method:"POST",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({requested_by:requestedBy})

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}