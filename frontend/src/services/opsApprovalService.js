// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// CREATE OPS APPROVAL
// ====================================

export async function createOpsApproval(

    payload

){

    console.log(

        "\n========== OPS APPROVAL SERVICE =========="

    );

    console.log(

        "Request:",

        payload

    );

    const response = await fetch(

        `${API}/ops-approval`,

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

        "Response:",

        data

    );

    console.log(

        "==========================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}