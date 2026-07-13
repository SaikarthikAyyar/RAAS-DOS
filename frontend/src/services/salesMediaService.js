const API = import.meta.env.VITE_API_URL;

export async function getCustomerMedia(customerId){

    const response = await fetch(

        `${API}/customer-request/${customerId}/media`

    );

    return response.json();

}