// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// CREATE EXECUTION
// ====================================

export async function createExecution(jobId){

    console.log(

        "Creating Execution",

        jobId

    );

    const response = await fetch(

        `${API}/execution/${jobId}`,

        {

            method:"POST"

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
// GET EXECUTION
// ====================================

export async function getExecution(executionId){

    console.log(

        "Loading Execution",

        executionId

    );

    const response = await fetch(

        `${API}/execution/${executionId}/details`

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
// LIST EXECUTIONS
// ====================================

export async function listExecutions(){

    console.log(

        "Listing Executions"

    );

    const response = await fetch(

        `${API}/execution`

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
// START PHASE
// ====================================

export async function startPhase(executionId){

    console.log(

        "Start Phase",

        executionId

    );

    const response = await fetch(

        `${API}/execution/${executionId}/start`,

        {

            method:"POST"

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
// COMPLETE PHASE
// ====================================

export async function completePhase(executionId){

    console.log(

        "Complete Phase",

        executionId

    );

    const response = await fetch(

        `${API}/execution/${executionId}/complete`,

        {

            method:"POST"

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