// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


// ====================================
// GET DASHBOARD OVERVIEW
// Admin's real business-overview dashboard - a separate endpoint from
// getDashboard() (dashboardService.js), which backs the other 4 roles'
// single-enquiry-drill-down dashboards and is untouched by this.
// ====================================

export async function getDashboardOverview(){

    const response = await fetch(

        `${API}/dashboard/overview`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// GET PIPELINE SNAPSHOT
// Full active pipeline (every open enquiry, not just the 8 shown in
// the Recent Cases table) - backs the "Export pipeline snapshot" button.
// ====================================

export async function getPipelineSnapshot(){

    const response = await fetch(

        `${API}/dashboard/pipeline-snapshot`

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
