// ====================================
// API
// ====================================

import { withDateStamp } from "../utils/exportFilename";

const API = import.meta.env.VITE_API_URL;


export async function getFleetUnits(){

    const response = await fetch(`${API}/fleet-units`);

    return response.json();

}


export async function getAvailableMachines(){

    const response = await fetch(`${API}/fleet-units/support/machines`);

    return response.json();

}


export async function getFleetUnit(id){

    const response = await fetch(`${API}/fleet-units/${id}`);

    return response.json();

}


export async function createFleetUnit(payload){

    const response = await fetch(

        `${API}/fleet-units`,

        {
            method:"POST",
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


export async function updateFleetUnit(id, payload){

    const response = await fetch(

        `${API}/fleet-units/${id}`,

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


export async function deleteFleetUnit(id, actor, remark){

    const response = await fetch(

        `${API}/fleet-units/${id}`,

        {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ actor, remark })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// FLEET SCHEDULE (queue, booking, reschedule/cancel)
// ====================================

export async function getFleetUnitQueue(fleetUnitId){

    const response = await fetch(`${API}/fleet-schedule/fleet-unit/${fleetUnitId}`);

    return response.json();

}


export async function getSchedulesForJob(jobId){

    const response = await fetch(`${API}/fleet-schedule/job/${jobId}`);

    return response.json();

}


export async function bookFleetUnit(payload){

    const response = await fetch(

        `${API}/fleet-schedule`,

        {
            method:"POST",
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


export async function rescheduleFleetSchedule(scheduleId, payload){

    const response = await fetch(

        `${API}/fleet-schedule/${scheduleId}`,

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


// ====================================
// FLEET AVAILABILITY (overview + forecast)
// ====================================

export async function getFleetAvailabilityOverview(){

    const response = await fetch(`${API}/fleet-availability/overview`);

    return response.json();

}


export async function getFleetForecast(weeks=13){

    const response = await fetch(`${API}/fleet-availability/forecast?weeks=${weeks}`);

    return response.json();

}


// Real, styled .xlsx generated server-side (openpyxl) - matches the
// reference spreadsheet's design (blue header, category bands, real
// per-machine monthly Billed Value columns) far more closely than the
// unstyled client-side SheetJS build this app's other exports use.
export async function downloadFleetForecastXlsx(weeks=13){

    const response = await fetch(`${API}/fleet-availability/forecast/export?weeks=${weeks}`);

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to export the forecast."}));
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = withDateStamp("Fleet_3Month_Forecast.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

}


// ====================================
// GEOCODE CHECK
// Lets a site-location field warn the moment a typed value won't
// resolve, instead of only finding out after booking (via the
// destination_geocode_warning on bookFleetUnit above).
// ====================================

export async function checkGeocode(text){

    const response = await fetch(`${API}/geocode/check?text=${encodeURIComponent(text)}`);

    return response.json();

}


export async function cancelFleetSchedule(scheduleId, actor, remark){

    const response = await fetch(

        `${API}/fleet-schedule/${scheduleId}`,

        {
            method:"DELETE",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ actor, remark })
        }

    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// ====================================
// FLEET KIT (pumps + accessories taken along)
// ====================================

// What a fleet unit may carry: the compatible pumps for its machine
// type, the whole accessories master, and the default accessory ids
// (from the job's Deployment Plan when jobId is given, else the machine
// type's standard set).
export async function getFleetUnitKitOptions(fleetUnitId, jobId){

    const query = jobId ? `?job_id=${jobId}` : "";

    const response = await fetch(`${API}/fleet-units/${fleetUnitId}/kit-options${query}`);

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}


// Swap a pump / send an accessory in on an existing booking (queued or
// active). Body: { pump_ids, accessory_ids, actor, remark }.
export async function updateScheduleKit(scheduleId, payload){

    const response = await fetch(

        `${API}/fleet-schedule/${scheduleId}/kit`,

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


// Same options, keyed by machine - for the Fleet Units modal, which
// needs them before the unit exists / when the machine dropdown changes.
export async function getKitOptionsForMachine(machineInventoryId){

    const response = await fetch(
        `${API}/fleet-units/support/kit-options?machine_inventory_id=${machineInventoryId}`
    );

    const data = await response.json();

    if(!response.ok){
        throw data;
    }

    return data;

}
