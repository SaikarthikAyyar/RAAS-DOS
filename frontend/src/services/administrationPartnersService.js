// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET ALL PARTNERS
// ====================================

export async function getPartners(){

    console.log(

        "\n========== ADMINISTRATION PARTNERS =========="

    );

    const response = await fetch(

        `${API}/administration/partners`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=============================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// GET SINGLE PARTNER
// ====================================

export async function getPartner(

    partnerId

){

    console.log(

        "\n========== GET PARTNER =========="

    );

    console.log(

        "Partner ID:",

        partnerId

    );

    const response = await fetch(

        `${API}/administration/partners/${partnerId}`

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// CREATE PARTNER
// ====================================

export async function createPartner(

    payload

){

    console.log(

        "\n========== CREATE PARTNER =========="

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/partners`,

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

        data

    );

    console.log(

        "====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// UPDATE PARTNER
// ====================================

export async function updatePartner(

    partnerId,

    payload

){

    console.log(

        "\n========== UPDATE PARTNER =========="

    );

    console.log(

        "Partner:",

        partnerId

    );

    console.log(

        payload

    );

    const response = await fetch(

        `${API}/administration/partners/${partnerId}`,

        {

            method:"PUT",

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

        data

    );

    console.log(

        "====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// TOGGLE PARTNER STATUS
// ====================================

export async function togglePartnerStatus(

    partnerId

){

    console.log(

        "\n========== TOGGLE PARTNER =========="

    );

    console.log(

        "Partner:",

        partnerId

    );

    const response = await fetch(

        `${API}/administration/partners/${partnerId}/toggle`,

        {

            method:"PATCH"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// DELETE PARTNER
// ====================================

export async function deletePartner(

    partnerId

){

    console.log(

        "\n========== DELETE PARTNER =========="

    );

    console.log(

        "Partner:",

        partnerId

    );

    const response = await fetch(

        `${API}/administration/partners/${partnerId}`,

        {

            method:"DELETE"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}