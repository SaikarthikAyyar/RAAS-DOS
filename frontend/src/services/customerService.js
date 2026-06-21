const API = "http://127.0.0.1:8000";


// ====================================
// CREATE CUSTOMER REQUEST
// ====================================

export async function createCustomerRequest(

    payload

){

    const response = await fetch(

        `${API}/customer-request`,

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


    return response.json();

}