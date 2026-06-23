const API = "http://127.0.0.1:8000";

export async function getCustomerMedia(customerId){

    const response = await fetch(

        `${API}/customer-request/${customerId}/media`

    );

    return response.json();

}