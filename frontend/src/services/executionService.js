const BASE_URL = "http://127.0.0.1:8000";

export async function createExecution(jobId){

    console.log("Creating Execution", jobId);

    const response = await fetch(

        `${BASE_URL}/execution/${jobId}`,

        {

            method:"POST"

        }

    );

    return await response.json();

}

export async function getExecution(executionId){

    console.log("Loading Execution", executionId);

    const response = await fetch(

        `${BASE_URL}/execution/${executionId}/details`

    );

    return await response.json();

}

export async function listExecutions(){

    console.log("Listing Executions");

    const response = await fetch(

        `${BASE_URL}/execution`

    );

    return await response.json();

}

export async function startPhase(executionId){

    console.log("Start Phase", executionId);

    const response = await fetch(

        `${BASE_URL}/execution/${executionId}/start`,

        {

            method:"POST"

        }

    );

    return await response.json();

}

export async function completePhase(executionId){

    console.log("Complete Phase", executionId);

    const response = await fetch(

        `${BASE_URL}/execution/${executionId}/complete`,

        {

            method:"POST"

        }

    );

    return await response.json();

}