const API = "https://raas-e6xhsmbgb-raas-dos.vercel.app";


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
