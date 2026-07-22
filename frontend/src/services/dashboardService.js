// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;

console.log("API =", API);


// ====================================
// GET DASHBOARD
// ====================================

export async function getDashboard(

    role,

    receivedEnquiryId,

    sentEnquiryId

){

    console.log(

        "\n========== DASHBOARD SERVICE =========="

    );

    console.log(

        "Dashboard Request:",

        {

            role,

            receivedEnquiryId,

            sentEnquiryId

        }

    );

    const params = new URLSearchParams({

        role

    });

    if(

        receivedEnquiryId !== null &&

        receivedEnquiryId !== undefined

    ){

        params.append(

            "received_enquiry_id",

            receivedEnquiryId

        );

    }

    if(

        sentEnquiryId !== null &&

        sentEnquiryId !== undefined

    ){

        params.append(

            "sent_enquiry_id",

            sentEnquiryId

        );

    }

    const response = await fetch(

        `${API}/dashboard?${params.toString()}`

    );

    console.log(response.status);

    console.log(response.statusText);



    const data = await response.json();

    console.log(

        "Dashboard Response:",

        data

    );

    console.log(

        "=======================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}