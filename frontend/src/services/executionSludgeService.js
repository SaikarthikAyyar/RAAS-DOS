// ====================================
// API
// Real daily sludge-output tracking for Job Execution (Phase 2) -
// Flow Meter / Sample Collection methods. Same plain-fetch pattern as
// executionMediaService.js.
// ====================================

const API = import.meta.env.VITE_API_URL;


async function handle(response, fallback){

    if(!response.ok){
        throw await response.json().catch(()=>({detail:fallback}));
    }

    return response.json();

}


export async function startSludgeDailyLog(executionId, {logDate, method, startTf}){

    const response = await fetch(

        `${API}/execution/${executionId}/sludge-logs`,

        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                log_date: logDate,
                method,
                start_tf: startTf ?? null
            })
        }

    );

    return handle(response, "Unable to start a new day.");

}


export async function getSludgeDailyLogs(executionId){

    const response = await fetch(`${API}/execution/${executionId}/sludge-logs`);

    return handle(response, "Unable to load sludge logs.");

}


export async function getSludgeDailyLog(dailyLogId){

    const response = await fetch(`${API}/execution/sludge-logs/${dailyLogId}`);

    return handle(response, "Unable to load this day's log.");

}


export async function updateSludgeDailyLog(dailyLogId, {endTf, totalSludgePumpMinutes, flaskVolumeMl}){

    const response = await fetch(

        `${API}/execution/sludge-logs/${dailyLogId}`,

        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                end_tf: endTf ?? null,
                total_sludge_pump_minutes: totalSludgePumpMinutes ?? null,
                flask_volume_ml: flaskVolumeMl ?? null
            })
        }

    );

    return handle(response, "Unable to save this day's details.");

}


export async function addSludgeReading(dailyLogId, {tfReading, frReading, settledSludgeVolumeMl, recordedBy}){

    const response = await fetch(

        `${API}/execution/sludge-logs/${dailyLogId}/readings`,

        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                tf_reading: tfReading,
                fr_reading: frReading ?? null,
                settled_sludge_volume_ml: settledSludgeVolumeMl ?? null,
                source: "MANUAL",
                recorded_by: recordedBy ?? null
            })
        }

    );

    return handle(response, "Unable to add this reading.");

}


export async function updateSludgeReading(readingId, {tfReading, frReading, settledSludgeVolumeMl, recordedBy}){

    const response = await fetch(

        `${API}/execution/sludge-readings/${readingId}`,

        {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                tf_reading: tfReading ?? null,
                fr_reading: frReading ?? null,
                settled_sludge_volume_ml: settledSludgeVolumeMl ?? null,
                recorded_by: recordedBy ?? null
            })
        }

    );

    return handle(response, "Unable to update this reading.");

}


export async function deleteSludgeReading(readingId){

    const response = await fetch(

        `${API}/execution/sludge-readings/${readingId}`,

        {method: "DELETE"}

    );

    return handle(response, "Unable to remove this reading.");

}


export async function exportSludgeLog(executionId){

    const response = await fetch(`${API}/execution/${executionId}/sludge-logs/export`);

    if(!response.ok){
        throw await response.json().catch(()=>({detail:"Unable to export the sludge log."}));
    }

    const disposition = response.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="?([^";]+)"?/);
    const filename = match ? match[1] : `Execution_${executionId}_Sludge_Output.xlsx`;

    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

}
