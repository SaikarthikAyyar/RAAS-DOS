// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getOpsReviewQueue(){

    const response = await fetch(`${API}/reviews/ops-review`);

    return response.json();

}


export async function getTechnoQueue(){

    const response = await fetch(`${API}/reviews/techno-commercial`);

    return response.json();

}


export async function getQuoteCommercialQueue(){

    const response = await fetch(`${API}/reviews/quote-commercial`);

    return response.json();

}


export async function getCommercialQueue(){

    const response = await fetch(`${API}/reviews/commercial-approval`);

    return response.json();

}
