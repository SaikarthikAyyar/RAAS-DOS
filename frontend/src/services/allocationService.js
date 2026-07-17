// ====================================
// LOAD ALLOCATION
// ====================================

export async function loadAllocation(jobId){

    console.log("Loading Allocation", jobId);

    const response = await fetch(

        `http://127.0.0.1:8000/allocation/${jobId}`

    );

    return await response.json();

}


// ====================================
// SAVE ALLOCATION
// ====================================

export async function saveAllocation(

    jobId,

    payload

){

    console.log("Saving Allocation", payload);

    const response = await fetch(

        `http://127.0.0.1:8000/allocation/${jobId}`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify(payload)

        }

    );

    return await response.json();

}