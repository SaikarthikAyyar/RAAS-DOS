// ====================================
// API
// ====================================

const API = "http://127.0.0.1:8000";


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