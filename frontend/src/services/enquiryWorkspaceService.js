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