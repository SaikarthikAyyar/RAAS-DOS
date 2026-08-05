// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET ENQUIRY
// ====================================

export async function getEnquiry(

    enquiryId

){

    console.log(

        "\n========== GET ENQUIRY =========="

    );

    console.log(

        "Enquiry ID:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "===============================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// UPDATE MODULE REFERENCE
// ====================================

export async function updateModuleReference(

    enquiryId,

    referenceField,

    referenceId

){

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/module-reference`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                reference_field:referenceField,

                reference_id:referenceId

            })

        }

    );

    return response.json();

}

export async function requestOpsReview(
    enquiryId
){

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/request-ops-review`,

        {
            method:"PUT"
        }

    );

    return response.json();

}

export async function setEnquiryStage(
    enquiryId,
    stage
){

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/stage`,

        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ stage })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}

export async function advanceStageAtLeast(
    enquiryId,
    stage
){

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/stage-at-least`,

        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({ stage })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}