// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET DASHBOARD
// ====================================

export async function getEnquiries({

    status = null,

    search = "",

    page = 1,

    pageSize = 20

} = {}){

    console.log(

        "\n========== ENQUIRY DASHBOARD =========="

    );

    const query = new URLSearchParams();

    if(

        status

    ){

        query.append(

            "status",

            status

        );

    }

    if(

        search

    ){

        query.append(

            "search",

            search

        );

    }

    query.append(

        "page",

        page

    );

    query.append(

        "page_size",

        pageSize

    );

    const response = await fetch(

        `${API}/enquiry-consolidated?${query.toString()}`

    );

    const data = await response.json();

    console.log(

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
// GET ENQUIRY
// ====================================

export async function getEnquiry(

    enquiryId

){

    console.log(

        "\n========== GET ENQUIRY =========="

    );

    console.log(

        "Enquiry:",

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
// ARCHIVE ENQUIRY
// ====================================

export async function archiveEnquiry(

    enquiryId

){

    console.log(

        "\n========== ARCHIVE ENQUIRY =========="

    );

    console.log(

        "Enquiry:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/archive`,

        {

            method:"PUT"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// RESTORE ENQUIRY
// ====================================

export async function restoreEnquiry(

    enquiryId

){

    console.log(

        "\n========== RESTORE ENQUIRY =========="

    );

    console.log(

        "Enquiry:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/restore`,

        {

            method:"PUT"

        }

    );

    const data = await response.json();

    console.log(

        data

    );

    console.log(

        "=====================================\n"

    );

    if(

        !response.ok

    ){

        throw data;

    }

    return data;

}


// ====================================
// MARK LOST
// ====================================

export async function markEnquiryLost(

    enquiryId

){

    console.log(

        "\n========== MARK ENQUIRY LOST =========="

    );

    console.log(

        "Enquiry:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/lost`,

        {

            method:"PUT"

        }

    );

    const data = await response.json();

    console.log(

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
// CLOSE ENQUIRY
// ====================================

export async function closeEnquiry(

    enquiryId

){

    console.log(

        "\n========== CLOSE ENQUIRY =========="

    );

    console.log(

        "Enquiry:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}/close`,

        {

            method:"PUT"

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
// DELETE ENQUIRY
// ====================================

export async function deleteEnquiry(

    enquiryId

){

    console.log(

        "\n========== DELETE ENQUIRY =========="

    );

    console.log(

        "Enquiry:",

        enquiryId

    );

    const response = await fetch(

        `${API}/enquiry-consolidated/${enquiryId}`,

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