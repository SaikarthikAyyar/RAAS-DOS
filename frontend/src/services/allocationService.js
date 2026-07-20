// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// LOAD ALLOCATION
// ====================================

export async function loadAllocation(jobId){

    console.log(

        "Loading Allocation",

        jobId

    );

    const response = await fetch(

        `${API}/allocation/${jobId}`

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
// SAVE ALLOCATION
// ====================================

export async function saveAllocation(

    jobId,

    payload

){

    console.log(

        "Saving Allocation",

        payload

    );

    const response = await fetch(

        `${API}/allocation/${jobId}`,

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

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}