// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET JOB LIST
// ====================================

// ====================================
// GET APPROVED QUOTES
// ====================================

export async function getApprovedQuotes(){

    console.log(

        "\n========== APPROVED QUOTES =========="

    );

    const response = await fetch(

        `${API}/job-creation/quotes`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// GET SINGLE JOB
// ====================================

export async function getJobCreation(

    quoteId

){

    console.log(

        "\n========== JOB DETAILS =========="

    );

    console.log(

        "Quote:",

        quoteId

    );

    const response = await fetch(

        `${API}/job-creation/${quoteId}`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// SAVE HEADER
// ====================================

export async function saveJobCreation(

    payload

){

    console.log(

        "\n========== SAVE JOB =========="

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/job-creation`,

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

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "==============================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// SAVE MANPOWER
// ====================================

export async function saveManpower(

    payload

){

    console.log(

        "\n========== SAVE MANPOWER =========="

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/job-creation/manpower`,

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