// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// Read-only: our backend passes through the Varaha IoT telemetry API.
export async function getMachineTelemetry(){

    const response = await fetch(`${API}/machine-telemetry`);

    if(!response.ok){
        throw await response.json().catch(()=>({}));
    }

    return response.json();

}


// One machine: live values plus recent history for its dashboard.
export async function getMachineTelemetryDetail(unitId){

    const response = await fetch(`${API}/machine-telemetry/${unitId}`);

    if(!response.ok){
        throw await response.json().catch(()=>({}));
    }

    return response.json();

}
