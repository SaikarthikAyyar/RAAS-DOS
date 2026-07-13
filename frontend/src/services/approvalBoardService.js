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
