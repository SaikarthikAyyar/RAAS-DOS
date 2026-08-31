// ====================================
// API
// ====================================

const API = import.meta.env.VITE_API_URL;


export async function getInvoiceDashboardKpi(){

    const response = await fetch(`${API}/invoice-dashboard/kpi`);

    return response.json();

}


export async function getInvoiceDashboardMachines(){

    const response = await fetch(`${API}/invoice-dashboard/machines`);

    return response.json();

}


export async function getRevenueForecast(machineInventoryId, start, end){

    const response = await fetch(
        `${API}/invoice-dashboard/revenue/${machineInventoryId}?start=${start}&end=${end}`
    );

    return response.json();

}


export async function getDeploymentTimeline(machineInventoryId, start, end){

    const response = await fetch(
        `${API}/invoice-dashboard/deployment/${machineInventoryId}?start=${start}&end=${end}`
    );

    return response.json();

}
