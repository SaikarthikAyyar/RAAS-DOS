const API = "https://raas-dos.vercel.app?_vercel_share=IboB6mPIQmlnsm20PUzYTyAy2I1bC0YC";


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
