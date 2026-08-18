// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET APPROVAL BOARD
// ====================================

export async function getApprovalBoard(){

    console.log(

        "\n========== APPROVAL SERVICE =========="

    );

    console.log(

        "Fetching Approval Queue..."

    );

    const response = await fetch(

        `${API}/approval-board`

    );

    const data = await response.json();

    console.log(

        "Approval Queue:",

        data

    );

    console.log(

        "Total Quotes:",

        data.length

    );

    console.log(

        "======================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// APPROVE QUOTE
// ====================================

export async function approveQuote(

    quoteId

){

    console.log(

        "\n========== APPROVE QUOTE =========="

    );

    console.log(

        "Quote:",

        quoteId

    );

    const response = await fetch(

        `${API}/approval-board/approve/${quoteId}`,

        {

            method:"POST"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "===================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// GET APPROVAL BOARD BY QUOTE
// ====================================

export async function getApprovalBoardByQuote(

    quoteId

){

    const response = await fetch(

        `${API}/approval-board/${quoteId}`

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
// COMMERCIAL APPROVAL TAB
// ====================================

export async function getApprovalHistory(

    opsSelectionId

){

    const response = await fetch(

        `${API}/approval-board/history/${opsSelectionId}`

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


export async function recordCommercialApprovalDecision(

    quoteId,

    decision,

    note,

    finalApprovedValue,

    enquiryId,

    actor

){

    const response = await fetch(

        `${API}/approval-board/decision/${quoteId}/${decision}`,

        {

            method:"POST",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({

                note,

                final_approved_value:finalApprovedValue,

                enquiry_id:enquiryId,

                actor:actor ?? null

            })

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}


export async function sendBackCommercialApproval(

    quoteId,

    note,

    enquiryId,

    actor

){

    const response = await fetch(

        `${API}/approval-board/send-back/${quoteId}`,

        {

            method:"POST",

            headers:{"Content-Type":"application/json"},

            body:JSON.stringify({

                note,

                enquiry_id:enquiryId,

                actor:actor ?? null

            })

        }

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}