import { API } from "../config/api";


// ====================================
// GET CUSTOMER IDS
// ====================================



// ====================================
// GET CUSTOMER LIVE ORDER
// ====================================

export async function getCustomerLiveOrder(

    customerRequestId

){

    const response = await fetch(

        `${API}/customer/live-order?customer_request_id=${customerRequestId}`

    );

    return await response.json();

}

export async function getCustomerExecutionIds(){

    const response = await fetch(

        `${API}/customer/live-order/customers`

    );

    return await response.json();

}