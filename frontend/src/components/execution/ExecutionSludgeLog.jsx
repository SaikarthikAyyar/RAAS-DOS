// ====================================
// EXECUTION SLUDGE LOG
// Real daily sludge-output tracking for Job Execution (Phase 2) - Flow
// Meter Reading Method and Sample Collection (Settling) Method, chosen
// fresh each day. Replaces the old bare "Output Completed" manual
// number once an execution has switched to progress_tracking_mode
// "SLUDGE_LOG" (see Phase2Execution.jsx) - the day's calculated
// sludge output IS that day's contribution to Total Output, always
// live-recomputed, so correcting any reading at any time immediately
// and correctly updates the total with no separate step.
//
// Every reading stays directly editable regardless of its `source`
// (MANUAL today, DEVICE once real machine-sensor integration exists
// later) - there is deliberately no locking based on source anywhere
// in this file.
// ====================================

import { useCallback, useEffect, useState } from "react";

import "./Execution.css";

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";

import { formatApiError } from "../../utils/apiError";

import {
    startSludgeDailyLog,
    getSludgeDailyLogs,
    getSludgeDailyLog,
    updateSludgeDailyLog,
    addSludgeReading,
    updateSludgeReading,
    deleteSludgeReading
} from "../../services/executionSludgeService";


const METHOD_LABELS = {
    FLOW_METER: "Flow Meter",
    SETTLING: "Sample Collection"
};

function todayIso(){
    return new Date().toISOString().slice(0, 10);
}

function round(value, places = 3){
    if(value === null || value === undefined) return "—";
    return Number(value).toFixed(places);
}


export default function ExecutionSludgeLog({

    executionId,

    readOnly = false,

    onChange

}){

    const { user } = useAuth();

    // Matches ExecutionMediaGallery.jsx's convention - the parent
    // (Phase2Execution.jsx) decides readOnly via hasTask(), this
    // component just obeys the prop rather than re-checking the task
    // itself.
    const canRecord = !readOnly;

    const [logs, setLogs] = useState([]);
    const [selectedLogId, setSelectedLogId] = useState(null);
    const [selectedLog, setSelectedLog] = useState(null);

    const [showStartForm, setShowStartForm] = useState(false);
    const [startForm, setStartForm] = useState({
        logDate: todayIso(),
        method: "FLOW_METER",
        startTf: ""
    });

    const [dayForm, setDayForm] = useState({endTf: "", pumpMinutes: "", flaskVolumeMl: ""});
    const [readingForm, setReadingForm] = useState({tfReading: "", frReading: "", settledMl: ""});
    const [editingReadingId, setEditingReadingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);


    // ====================================
    // LOAD
    // ====================================

    const loadLogs = useCallback(async(preferredId)=>{

        try{

            const response = await getSludgeDailyLogs(executionId);
            setLogs(response);

            const target = preferredId ?? (response[0]?.id ?? null);
            setSelectedLogId(target);

        }
        catch(err){
            setError(formatApiError(err, "Unable to load sludge logs."));
        }

    }, [executionId]);

    useEffect(()=>{
        if(executionId){
            void loadLogs();
        }
    }, [executionId, loadLogs]);

    const loadSelectedLog = useCallback(async()=>{

        if(!selectedLogId){
            setSelectedLog(null);
            return;
        }

        try{
            const detail = await getSludgeDailyLog(selectedLogId);
            setSelectedLog(detail);
            setDayForm({
                endTf: detail.end_tf ?? "",
                pumpMinutes: detail.total_sludge_pump_minutes ?? "",
                flaskVolumeMl: detail.flask_volume_ml ?? ""
            });
        }
        catch(err){
            setError(formatApiError(err, "Unable to load this day's log."));
        }

    }, [selectedLogId]);

    useEffect(()=>{
        void loadSelectedLog();
    }, [loadSelectedLog]);


    // ====================================
    // START NEW DAY
    // ====================================

    async function handleStartDay(){

        setSaving(true);
        setError("");

        try{

            const created = await startSludgeDailyLog(executionId, {
                logDate: startForm.logDate,
                method: startForm.method,
                startTf: startForm.startTf === "" ? null : Number(startForm.startTf)
            });

            setShowStartForm(false);
            setStartForm({logDate: todayIso(), method: "FLOW_METER", startTf: ""});

            await loadLogs(created.id);

            onChange?.();

        }
        catch(err){
            setError(formatApiError(err, "Unable to start a new day."));
        }
        finally{
            setSaving(false);
        }

    }


    // ====================================
    // SAVE DAY-LEVEL FIELDS
    // ====================================

    async function handleSaveDay(){

        setSaving(true);
        setError("");

        try{

            await updateSludgeDailyLog(selectedLogId, {
                endTf: dayForm.endTf === "" ? null : Number(dayForm.endTf),
                totalSludgePumpMinutes: dayForm.pumpMinutes === "" ? null : Number(dayForm.pumpMinutes),
                flaskVolumeMl: dayForm.flaskVolumeMl === "" ? null : Number(dayForm.flaskVolumeMl)
            });

            await loadLogs(selectedLogId);
            await loadSelectedLog();

            onChange?.();

        }
        catch(err){
            setError(formatApiError(err, "Unable to save this day's details."));
        }
        finally{
            setSaving(false);
        }

    }


    // ====================================
    // READINGS
    // ====================================

    async function handleAddReading(){

        setSaving(true);
        setError("");

        try{

            await addSludgeReading(selectedLogId, {
                tfReading: Number(readingForm.tfReading),
                frReading: readingForm.frReading === "" ? null : Number(readingForm.frReading),
                settledSludgeVolumeMl: readingForm.settledMl === "" ? null : Number(readingForm.settledMl),
                recordedBy: user?.name
            });

            setReadingForm({tfReading: "", frReading: "", settledMl: ""});

            await loadLogs(selectedLogId);
            await loadSelectedLog();

            onChange?.();

        }
        catch(err){
            setError(formatApiError(err, "Unable to add this reading."));
        }
        finally{
            setSaving(false);
        }

    }

    function startEditReading(reading){
        setEditingReadingId(reading.id);
        setEditForm({
            tfReading: reading.tf_reading ?? "",
            frReading: reading.fr_reading ?? "",
            settledMl: reading.settled_sludge_volume_ml ?? ""
        });
    }

    async function handleSaveReadingEdit(readingId){

        setSaving(true);
        setError("");

        try{

            await updateSludgeReading(readingId, {
                tfReading: editForm.tfReading === "" ? null : Number(editForm.tfReading),
                frReading: editForm.frReading === "" ? null : Number(editForm.frReading),
                settledSludgeVolumeMl: editForm.settledMl === "" ? null : Number(editForm.settledMl)
            });

            setEditingReadingId(null);

            await loadLogs(selectedLogId);
            await loadSelectedLog();

            onChange?.();

        }
        catch(err){
            setError(formatApiError(err, "Unable to update this reading."));
        }
        finally{
            setSaving(false);
        }

    }

    async function handleDeleteReading(readingId){

        if(!window.confirm("Remove this reading? Total Output will recompute immediately.")){
            return;
        }

        setSaving(true);
        setError("");

        try{

            await deleteSludgeReading(readingId);

            await loadLogs(selectedLogId);
            await loadSelectedLog();

            onChange?.();

        }
        catch(err){
            setError(formatApiError(err, "Unable to remove this reading."));
        }
        finally{
            setSaving(false);
        }

    }


    // ====================================
    // UI
    // ====================================

    const method = selectedLog?.method;

    return(

        <div className="execution-card" data-guide-id="phase2-sludge-log" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase2-sludge-log" floating/>

            <h2 className="execution-section-title">
                Daily Sludge Output
            </h2>

            {error && (
                <p className="execution-map-empty" style={{textAlign:"left", padding:0, marginBottom:10, color:"var(--orange)"}}>
                    {error}
                </p>
            )}

            <div className="sludge-log-day-list">

                {logs.length === 0 && (
                    <p className="execution-map-empty" style={{textAlign:"left", padding:0}}>
                        No days recorded yet.
                    </p>
                )}

                {logs.map(log=>(

                    <button
                        key={log.id}
                        type="button"
                        className={selectedLogId === log.id ? "sludge-log-day-row active" : "sludge-log-day-row"}
                        onClick={()=>setSelectedLogId(log.id)}
                    >
                        <span>{log.log_date}</span>
                        <span>{METHOD_LABELS[log.method] || log.method}</span>
                        <span className={log.status === "COMPLETE" ? "sludge-log-status-pill complete" : "sludge-log-status-pill pending"}>
                            {log.status === "COMPLETE" ? `${round(log.sludge_output_m3, 2)} m³` : "Pending"}
                        </span>
                    </button>

                ))}

            </div>

            {canRecord && !showStartForm && (
                <div className="execution-actions">
                    <button className="execution-btn" onClick={()=>setShowStartForm(true)}>
                        + Start New Day
                    </button>
                </div>
            )}

            {canRecord && showStartForm && (

                <div className="execution-form-grid" style={{marginTop:12}}>

                    <div className="execution-form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            className="execution-input"
                            value={startForm.logDate}
                            onChange={e=>setStartForm(p=>({...p, logDate: e.target.value}))}
                        />
                    </div>

                    <div className="execution-form-group">
                        <label>Method</label>
                        <select
                            className="execution-select"
                            value={startForm.method}
                            onChange={e=>setStartForm(p=>({...p, method: e.target.value}))}
                        >
                            <option value="FLOW_METER">Flow Meter Reading</option>
                            <option value="SETTLING">Sample Collection (Settling)</option>
                        </select>
                    </div>

                    <div className="execution-form-group">
                        <label>
                            Start TF (m³){logs.length > 0 ? " - leave blank to continue from the previous day" : ""}
                        </label>
                        <input
                            type="number"
                            className="execution-input"
                            value={startForm.startTf}
                            onChange={e=>setStartForm(p=>({...p, startTf: e.target.value}))}
                        />
                    </div>

                    <div className="execution-actions" style={{gridColumn:"1 / -1"}}>
                        <button className="execution-btn" disabled={saving} onClick={handleStartDay}>
                            Start Day
                        </button>
                        <button
                            className="execution-btn"
                            style={{background:"white", color:"var(--ink)"}}
                            onClick={()=>setShowStartForm(false)}
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            )}

            {selectedLog && (

                <div style={{marginTop:16, borderTop:"1px solid var(--line)", paddingTop:14}}>

                    <h3 style={{fontSize:"13px", fontWeight:800, marginBottom:10}}>
                        {selectedLog.log_date} · {METHOD_LABELS[method] || method}
                    </h3>

                    <div className="execution-form-grid">

                        <div className="execution-form-group">
                            <label>Start TF (m³)</label>
                            <input className="execution-input" value={selectedLog.start_tf} readOnly disabled/>
                        </div>

                        <div className="execution-form-group">
                            <label>End TF (m³)</label>
                            <input
                                type="number"
                                className="execution-input"
                                value={dayForm.endTf}
                                readOnly={!canRecord}
                                disabled={!canRecord}
                                onChange={e=>setDayForm(p=>({...p, endTf: e.target.value}))}
                            />
                        </div>

                        {method === "FLOW_METER" && (
                            <div className="execution-form-group">
                                <label>Total Sludge Pump Time (minutes)</label>
                                <input
                                    type="number"
                                    className="execution-input"
                                    value={dayForm.pumpMinutes}
                                    readOnly={!canRecord}
                                    disabled={!canRecord}
                                    onChange={e=>setDayForm(p=>({...p, pumpMinutes: e.target.value}))}
                                />
                            </div>
                        )}

                        {method === "SETTLING" && (
                            <div className="execution-form-group">
                                <label>Flask Volume (ml)</label>
                                <input
                                    type="number"
                                    className="execution-input"
                                    value={dayForm.flaskVolumeMl}
                                    readOnly={!canRecord}
                                    disabled={!canRecord}
                                    onChange={e=>setDayForm(p=>({...p, flaskVolumeMl: e.target.value}))}
                                />
                            </div>
                        )}

                    </div>

                    {canRecord && (
                        <div className="execution-actions">
                            <button className="execution-btn" disabled={saving} onClick={handleSaveDay}>
                                Save Day Details
                            </button>
                        </div>
                    )}

                    <div className="sludge-log-breakdown">

                        {method === "FLOW_METER" && (
                            <>
                                <div><span>Avg FR</span><strong>{round(selectedLog.avg_fr, 2)} m³/hr</strong></div>
                                <div><span>Estimated Volume</span><strong>{round(selectedLog.total_sludge_pumping_estimate_m3, 2)} m³</strong></div>
                            </>
                        )}

                        <div><span>Total TF (ground truth)</span><strong>{round(selectedLog.total_tf_m3, 2)} m³</strong></div>
                        <div><span>% Sludge / % Water</span><strong>{round(selectedLog.pct_sludge, 1)}% / {round(selectedLog.pct_water, 1)}%</strong></div>
                        <div><span>Sludge Output</span><strong>{round(selectedLog.sludge_output_m3, 3)} m³</strong></div>
                        <div><span>Water Output</span><strong>{round(selectedLog.water_output_m3, 3)} m³</strong></div>

                    </div>

                    {selectedLog.sludge_output_m3 === null && (
                        <p className="execution-map-empty" style={{textAlign:"left", padding:0, marginTop:8}}>
                            Add readings and set End TF{method === "FLOW_METER" ? " and pump time" : ""} to see the computed output.
                        </p>
                    )}

                    <h4 style={{fontSize:"12px", fontWeight:800, marginTop:16, marginBottom:8}}>
                        Readings
                    </h4>

                    <div style={{overflowX:"auto"}}>

                        <table className="sludge-log-readings-table">

                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>TF</th>
                                    {method === "FLOW_METER" && <th>FR</th>}
                                    {method === "SETTLING" && <th>Settled Sludge (ml)</th>}
                                    <th>Source</th>
                                    <th>By</th>
                                    {canRecord && <th></th>}
                                </tr>
                            </thead>

                            <tbody>

                                {(selectedLog.readings || []).map(reading=>(

                                    editingReadingId === reading.id ? (

                                        <tr key={reading.id}>
                                            <td>{new Date(reading.recorded_at).toLocaleString()}</td>
                                            <td>
                                                <input
                                                    type="number" className="execution-input"
                                                    value={editForm.tfReading}
                                                    onChange={e=>setEditForm(p=>({...p, tfReading: e.target.value}))}
                                                />
                                            </td>
                                            {method === "FLOW_METER" && (
                                                <td>
                                                    <input
                                                        type="number" className="execution-input"
                                                        value={editForm.frReading}
                                                        onChange={e=>setEditForm(p=>({...p, frReading: e.target.value}))}
                                                    />
                                                </td>
                                            )}
                                            {method === "SETTLING" && (
                                                <td>
                                                    <input
                                                        type="number" className="execution-input"
                                                        value={editForm.settledMl}
                                                        onChange={e=>setEditForm(p=>({...p, settledMl: e.target.value}))}
                                                    />
                                                </td>
                                            )}
                                            <td>{reading.source}</td>
                                            <td>{reading.recorded_by || "—"}</td>
                                            {canRecord && (
                                                <td style={{whiteSpace:"nowrap"}}>
                                                    <button className="execution-btn" disabled={saving} onClick={()=>handleSaveReadingEdit(reading.id)}>Save</button>
                                                    {" "}
                                                    <button
                                                        className="execution-btn"
                                                        style={{background:"white", color:"var(--ink)"}}
                                                        onClick={()=>setEditingReadingId(null)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </td>
                                            )}
                                        </tr>

                                    ) : (

                                        <tr key={reading.id}>
                                            <td>{new Date(reading.recorded_at).toLocaleString()}</td>
                                            <td>{round(reading.tf_reading, 3)}</td>
                                            {method === "FLOW_METER" && <td>{round(reading.fr_reading, 2)}</td>}
                                            {method === "SETTLING" && <td>{round(reading.settled_sludge_volume_ml, 0)}</td>}
                                            <td>{reading.source}</td>
                                            <td>{reading.recorded_by || "—"}</td>
                                            {canRecord && (
                                                <td style={{whiteSpace:"nowrap"}}>
                                                    <button className="execution-btn" style={{background:"white", color:"var(--ink)"}} onClick={()=>startEditReading(reading)}>Edit</button>
                                                    {" "}
                                                    <button className="execution-btn" style={{background:"white", color:"var(--orange)"}} onClick={()=>handleDeleteReading(reading.id)}>Remove</button>
                                                </td>
                                            )}
                                        </tr>

                                    )

                                ))}

                                {(selectedLog.readings || []).length === 0 && (
                                    <tr>
                                        <td colSpan={5}>No readings yet.</td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                    {canRecord && (

                        <div className="execution-form-grid" style={{marginTop:10}}>

                            <div className="execution-form-group">
                                <label>TF Reading (m³)</label>
                                <input
                                    type="number" className="execution-input"
                                    value={readingForm.tfReading}
                                    onChange={e=>setReadingForm(p=>({...p, tfReading: e.target.value}))}
                                />
                            </div>

                            {method === "FLOW_METER" && (
                                <div className="execution-form-group">
                                    <label>FR Reading (m³/hr)</label>
                                    <input
                                        type="number" className="execution-input"
                                        value={readingForm.frReading}
                                        onChange={e=>setReadingForm(p=>({...p, frReading: e.target.value}))}
                                    />
                                </div>
                            )}

                            {method === "SETTLING" && (
                                <>
                                    <div className="execution-form-group">
                                        <label>Settled Sludge Volume (ml)</label>
                                        <input
                                            type="number" className="execution-input"
                                            value={readingForm.settledMl}
                                            onChange={e=>setReadingForm(p=>({...p, settledMl: e.target.value}))}
                                        />
                                    </div>
                                    <div className="execution-form-group">
                                        <label>FR Reading (m³/hr, optional/reference)</label>
                                        <input
                                            type="number" className="execution-input"
                                            value={readingForm.frReading}
                                            onChange={e=>setReadingForm(p=>({...p, frReading: e.target.value}))}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="execution-actions" style={{gridColumn:"1 / -1"}}>
                                <button
                                    className="execution-btn"
                                    disabled={saving || readingForm.tfReading === ""}
                                    onClick={handleAddReading}
                                >
                                    + Add Reading
                                </button>
                            </div>

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}
