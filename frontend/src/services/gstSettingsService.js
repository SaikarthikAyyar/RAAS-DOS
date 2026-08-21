// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getGstSettings(){

    const response = await fetch(`${API}/gst-settings`);

    return response.json();

}


export async function updateGstSettings(payload){

    const response = await fetch(

        `${API}/gst-settings`,

        {
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(payload)
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
