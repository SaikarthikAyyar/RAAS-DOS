import { useEffect, useState } from "react";

import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    getInvoiceDashboardMachines,
    getDeploymentTimeline
} from "../../services/invoiceDashboardService";

import PeriodRangePicker, { PRESETS } from "./PeriodRangePicker";


// ====================================
// MARKER ICONS
// Same plain CSS divIcon convention as ExecutionRouteMap.jsx (sidesteps
// the Leaflet + bundler broken-marker-icon issue), color-coded by
// segment type so what a pin means is legible at a glance.
// ====================================

function dotIcon(color, dashed){
    return L.divIcon({
        className: "",
        html: `<span style="display:block;width:16px;height:16px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 0 1px ${color}${dashed ? ";opacity:.55" : ""}"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
}

const SEGMENT_COLORS = {
    MOBILISATION_TRANSIT: "#3b82f6",
    ON_SITE: "#16a34a",
    DEMOBILISATION_TRANSIT: "#a855f7",
    AVAILABLE: "#94a3b8"
};

const SEGMENT_LABELS = {
    MOBILISATION_TRANSIT: "Mobilisation (in transit)",
    ON_SITE: "On site",
    DEMOBILISATION_TRANSIT: "Demobilisation (in transit)",
    AVAILABLE: "Available"
};

const PLANNED_ICON = dotIcon("#f58220", true);
const LIVE_ICON = dotIcon("#dc2626");


function AutoFit({ points }){

    const map = useMap();

    useEffect(()=>{

        if(points.length===0) return;

        if(points.length===1){
            map.setView(points[0], 10);
            return;
        }

        map.fitBounds(points, { padding:[32,32] });

    }, [map, JSON.stringify(points)]);

    return null;

}


function formatDuration(startedAt, endedAt){

    const start = new Date(startedAt);
    const end = endedAt ? new Date(endedAt) : new Date();

    const ms = end - start;

    if(ms < 0) return "-";

    const hours = Math.floor(ms / 3600000);
    const days = Math.floor(hours / 24);

    if(days >= 1){
        return `${days}d ${hours % 24}h${endedAt ? "" : " (ongoing)"}`;
    }

    return `${hours}h${endedAt ? "" : " (ongoing)"}`;

}


function inr(value){
    if(value===null || value===undefined) return "-";
    return "Rs " + Math.round(value).toLocaleString("en-IN");
}


// Distinguishes a real, PO-backed figure from a pre-PO quote estimate
// - never conflated (Expected Invoice Revenue on the KPI card is
// strictly PO-backed; this label is what makes the difference visible
// wherever a job's value shows up instead).
function jobValueLabel(entry){
    if(!entry || entry.source === "none" || !entry.value) return "No PO or quote value on record";
    if(entry.source === "po") return `${inr(entry.value)} (PO-backed)`;
    return `${inr(entry.value)} (quote estimate - no PO yet)`;
}


function formatDateOnly(value){
    if(!value) return "-";
    return String(value).slice(0, 10);
}


// ====================================
// DEPLOYMENT TAB
// Two layers, clearly distinguished (Phase 39): solid pins = real,
// already-happened history; dashed/lighter pins = a planned future
// booking synthesized live from FleetSchedule, never stored. A red
// pin marks the machine's current live position when it's mid-transit.
// ====================================

export default function DeploymentTab(){

    const [machines, setMachines] = useState([]);
    const [loadingMachines, setLoadingMachines] = useState(true);

    const [selectedMachineId, setSelectedMachineId] = useState(null);
    const [timeline, setTimeline] = useState(null);
    const [loadingTimeline, setLoadingTimeline] = useState(false);

    // Default spans both directions (recent past + near future) since
    // deployment history is naturally two-sided, unlike any single one
    // of the 5 quick-select presets alone - still freely overridable
    // via PeriodRangePicker.
    const last3 = PRESETS.find(p=>p.key==="last_3_months").range();
    const next3 = PRESETS.find(p=>p.key==="next_3_months").range();
    const [rangeStart, setRangeStart] = useState(last3[0]);
    const [rangeEnd, setRangeEnd] = useState(next3[1]);

    useEffect(()=>{

        (async ()=>{
            setLoadingMachines(true);
            const data = await getInvoiceDashboardMachines();
            setMachines(data);
            setLoadingMachines(false);
        })();

    }, []);

    useEffect(()=>{

        if(!selectedMachineId || !rangeStart || !rangeEnd) return;

        (async ()=>{
            setLoadingTimeline(true);
            const data = await getDeploymentTimeline(selectedMachineId, rangeStart, rangeEnd);
            setTimeline(data);
            setLoadingTimeline(false);
        })();

    }, [selectedMachineId, rangeStart, rangeEnd]);

    const selectedMachine = machines.find(m=>m.id===selectedMachineId);

    const actualWithCoords = (timeline?.actual || []).filter(s=>s.start_latitude!=null || s.end_latitude!=null);
    const plannedWithCoords = (timeline?.planned || []).filter(s=>s.latitude!=null);

    const currentPositionHasCoords = timeline?.current_position?.latitude!=null && timeline?.current_position?.longitude!=null;

    const points = [
        ...actualWithCoords.flatMap(s=>[
            s.start_latitude!=null ? [s.start_latitude, s.start_longitude] : null,
            s.end_latitude!=null ? [s.end_latitude, s.end_longitude] : null
        ]),
        ...plannedWithCoords.map(s=>[s.latitude, s.longitude]),
        currentPositionHasCoords ? [timeline.current_position.latitude, timeline.current_position.longitude] : null
    ].filter(Boolean);

    return(

        <>

            <div className="bm-card" style={{marginBottom:14}}>

                <h3>All machines</h3>

                {loadingMachines ? (
                    <p className="bm-muted">Loading...</p>
                ) : (

                    <div style={{maxHeight:280, overflowY:"auto", border:"1px solid #eee", borderRadius:8}}>

                        <table style={{marginBottom:0}}>
                            <thead style={{position:"sticky", top:0, background:"#fff", zIndex:1}}>
                                <tr>
                                    <th>Machine</th>
                                    <th>Hub</th>
                                    <th>Current Location</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {machines.map(m=>(
                                    <tr key={m.id}>
                                        <td>{m.machine_code} - {m.machine_name}</td>
                                        <td>{m.hub_name || "-"}</td>
                                        <td>{m.current_location || "-"}</td>
                                        <td>{m.status}</td>
                                        <td>
                                            <span
                                                className="bm-backlink"
                                                style={{cursor:"pointer"}}
                                                onClick={()=>setSelectedMachineId(m.id)}
                                            >
                                                View Deployment
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>

                )}

            </div>

            {selectedMachine && (

                <div className="bm-card">

                    <h3>
                        Deployment - {selectedMachine.machine_code} ({selectedMachine.machine_name})
                    </h3>

                    <div style={{marginBottom:14}}>
                        <PeriodRangePicker
                            start={rangeStart}
                            end={rangeEnd}
                            onChange={(s, e)=>{ setRangeStart(s); setRangeEnd(e); }}
                        />
                    </div>

                    {loadingTimeline || !timeline ? (
                        <p className="bm-muted">Loading...</p>
                    ) : (

                        <>

                            <p className="bm-muted" style={{marginTop:0}}>
                                Deployments falling under {rangeStart} to {rangeEnd}
                            </p>

                            {points.length > 0 ? (
                                <div style={{height:420, borderRadius:8, overflow:"hidden", border:"1px solid #eee", marginBottom:14, isolation:"isolate"}}>

                                    <MapContainer center={points[0]} zoom={10} scrollWheelZoom style={{height:"100%", width:"100%"}}>

                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        {actualWithCoords.map((s, i)=>{

                                            const isTransit = s.segment_type.includes("TRANSIT");
                                            const start = s.start_latitude!=null ? [s.start_latitude, s.start_longitude] : null;
                                            const end = s.end_latitude!=null ? [s.end_latitude, s.end_longitude] : null;
                                            const pinPos = end || start;

                                            return (
                                                <span key={`actual-${i}`}>
                                                    {isTransit && start && end && (
                                                        <Polyline
                                                            positions={[start, end]}
                                                            pathOptions={{ color: SEGMENT_COLORS[s.segment_type], weight: 3, dashArray: "6 6" }}
                                                        />
                                                    )}
                                                    {pinPos && (
                                                        <Marker position={pinPos} icon={dotIcon(SEGMENT_COLORS[s.segment_type])}>
                                                            <Tooltip direction="top">
                                                                <div>
                                                                    <b>{s.place_name || "Unknown location"}</b><br/>
                                                                    {SEGMENT_LABELS[s.segment_type]}<br/>
                                                                    Duration: {formatDuration(s.started_at, s.ended_at)}<br/>
                                                                    Purpose: {s.purpose_label || "-"}<br/>
                                                                    Job value: {jobValueLabel(s)}
                                                                </div>
                                                            </Tooltip>
                                                        </Marker>
                                                    )}
                                                </span>
                                            );

                                        })}

                                        {plannedWithCoords.map((s, i)=>(
                                            <Marker key={`planned-${i}`} position={[s.latitude, s.longitude]} icon={PLANNED_ICON}>
                                                <Tooltip direction="top">
                                                    <div>
                                                        <b>{s.place_name}</b> (Planned)<br/>
                                                        {formatDateOnly(s.started_at)} to {formatDateOnly(s.ended_at)}<br/>
                                                        Purpose: {s.purpose_label || "-"}<br/>
                                                        Job value: {jobValueLabel(s)}
                                                    </div>
                                                </Tooltip>
                                            </Marker>
                                        ))}

                                        {timeline.current_position && currentPositionHasCoords && (
                                            <Marker
                                                position={[timeline.current_position.latitude, timeline.current_position.longitude]}
                                                icon={LIVE_ICON}
                                            >
                                                <Tooltip direction="top">
                                                    <div>
                                                        <b>Current position</b><br/>
                                                        {SEGMENT_LABELS[timeline.current_position.segment_type] || timeline.current_position.segment_type}<br/>
                                                        {timeline.current_position.started_at
                                                            ? <>Duration: {formatDuration(timeline.current_position.started_at, null)}<br/></>
                                                            : null
                                                        }
                                                        Purpose: {timeline.current_position.purpose_label || "-"}<br/>
                                                        Job: {(timeline.current_position.job_start || timeline.current_position.job_end)
                                                            ? `${formatDateOnly(timeline.current_position.job_start)} to ${formatDateOnly(timeline.current_position.job_end)}`
                                                            : "No current job on record"
                                                        }<br/>
                                                        Job value: {jobValueLabel(timeline.current_position)}
                                                    </div>
                                                </Tooltip>
                                            </Marker>
                                        )}

                                        <AutoFit points={points}/>

                                    </MapContainer>

                                </div>

                            ) : (
                                <p className="bm-muted">No geocoded positions yet for this machine's history - showing the timeline below instead.</p>
                            )}

                            <table>
                                <thead>
                                    <tr>
                                        <th>State</th>
                                        <th>Place</th>
                                        <th>Duration</th>
                                        <th>Purpose</th>
                                        <th>Job Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(timeline.actual || []).map((s, i)=>(
                                        <tr key={`a-${i}`}>
                                            <td>{SEGMENT_LABELS[s.segment_type] || s.segment_type}</td>
                                            <td>{s.place_name || "-"}</td>
                                            <td>{formatDuration(s.started_at, s.ended_at)}</td>
                                            <td>{s.purpose_label || "-"}</td>
                                            <td>{jobValueLabel(s)}</td>
                                        </tr>
                                    ))}
                                    {(timeline.planned || []).map((s, i)=>(
                                        <tr key={`p-${i}`} style={{opacity:.7}}>
                                            <td>Planned</td>
                                            <td>{s.place_name || "-"}</td>
                                            <td>{formatDateOnly(s.started_at)} to {formatDateOnly(s.ended_at)}</td>
                                            <td>{s.purpose_label || "-"}</td>
                                            <td>{jobValueLabel(s)}</td>
                                        </tr>
                                    ))}
                                    {timeline.current_position && (
                                        <tr style={{background:"#fef2f2"}}>
                                            <td>Current position ({SEGMENT_LABELS[timeline.current_position.segment_type] || timeline.current_position.segment_type})</td>
                                            <td>{currentPositionHasCoords ? `${timeline.current_position.latitude.toFixed(4)}, ${timeline.current_position.longitude.toFixed(4)}` : "No position on record"}</td>
                                            <td>{timeline.current_position.started_at ? formatDuration(timeline.current_position.started_at, null) : "-"}</td>
                                            <td>
                                                {timeline.current_position.purpose_label || "-"}
                                                <br/>
                                                <span style={{fontSize:11, color:"var(--muted)"}}>
                                                    Job: {(timeline.current_position.job_start || timeline.current_position.job_end)
                                                        ? `${formatDateOnly(timeline.current_position.job_start)} to ${formatDateOnly(timeline.current_position.job_end)}`
                                                        : "No current job on record"
                                                    }
                                                </span>
                                            </td>
                                            <td>{jobValueLabel(timeline.current_position)}</td>
                                        </tr>
                                    )}
                                    {(!timeline.actual || timeline.actual.length===0) && (!timeline.planned || timeline.planned.length===0) && !timeline.current_position && (
                                        <tr><td colSpan={5} className="bm-muted">No deployment history yet for this machine.</td></tr>
                                    )}
                                </tbody>
                            </table>

                        </>

                    )}

                </div>

            )}

        </>

    );

}
