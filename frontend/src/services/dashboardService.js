// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET DASHBOARD
// ====================================

export async function getDashboard(

    startCustomerId,

    selectedCustomerId,

    selectedSurveyId

){

    console.log(

        "\n========== DASHBOARD SERVICE =========="

    );

    console.log(

        "Dashboard Request:",

        {

            startCustomerId,

            selectedCustomerId,

            selectedSurveyId

        }

    );

    const params = new URLSearchParams({

        start_customer_id: startCustomerId

    });

    if(

        selectedCustomerId !== null &&

        selectedCustomerId !== undefined

    ){

        params.append(

            "selected_customer_id",

            selectedCustomerId

        );

    }

    if(

        selectedSurveyId !== null &&

        selectedSurveyId !== undefined

    ){

        params.append(

            "selected_sales_survey_id",

            selectedSurveyId

        );

    }

    const response = await fetch(

        `${API}/dashboard?${params.toString()}`

    );


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


// ====================================
// GET CUSTOMER NAVIGATOR
// ====================================

export async function getDashboardCustomerList(){

    console.log(

        "\n========== DASHBOARD NAVIGATOR SERVICE =========="

    );

    const response = await fetch(

        `${API}/dashboard/customer-list`

    );

    const data = await response.json();

    console.log(

        "Customer Navigator:",

        data

    );

    console.log(

        "===============================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}
