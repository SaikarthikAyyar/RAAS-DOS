// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// EXPORT CURRENT TAB (generic - every DB column for whichever
// tab's backing table(s), regardless of whether the frontend
// currently displays all of them)
// ====================================

export async function exportTab(

    tabKey

){

    const response = await fetch(

        `${API}/business-master/export/${tabKey}`

    );

    const data = await response.json();

    if(!response.ok){

        throw data;

    }

    return data;

}
