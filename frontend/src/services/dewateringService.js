// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET DEWATERING ASSESSMENT BY OPS SELECTION
// ====================================

export async function getDewateringByOpsSelection(

opsSelectionId

){

const response = await fetch(

`${API}/dewatering/by-ops-selection/${opsSelectionId}`

);

if(

response.status === 404

){

return null;

}

const data = await response.json();

if(

!response.ok

){

throw data;

}

return data;

}
