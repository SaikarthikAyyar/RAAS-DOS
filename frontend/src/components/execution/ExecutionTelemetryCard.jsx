import { useState, useEffect } from "react";

import { getExecutionTelemetry } from "../../services/machineTelemetryService";

import TelemetryPill from "../shared/TelemetryPill";


const REFRESH_MS = 10000;

const PHASE_LABEL = { PHASE_1: "Mobilisation", PHASE_2: "Job Execution", PHASE_3: "Demobilisation" };


// Pull one raw sensor value out of a machine's grouped metrics.
function reading(machine, key){

    for(const group of machine?.metric_groups || []){
        const found = group.metrics.find(m=>m.key === key);
        if(found) return found.value;
    }

    return undefined;

}


function fmt(value, digits = 1, unit = ""){

    return typeof value === "number" ? `${value.toFixed(digits)}${unit}` : "—";

}


// Live sensor state of the machines working this execution (staff views
// only - never shown to customers). The machine's own GPS drives the
// execution's position/distance/ETA in Mobilisation and Demobilisation
// (source = DEVICE); in Job Execution the machine's readings are shown
// for monitoring. Read-only.
export default function ExecutionTelemetryCard({ execution }){

    const [data, setData] = useState(null);

    useEffect(()=>{

        if(!execution?.id) return;

        let cancelled = false;

        async function load(){
            try{
                const result = await getExecutionTelemetry(execution.id);
                if(!cancelled) setData(result);
            }
            catch{
                // keep the last known data on a failed poll
            }
        }

        load();

        const timer = setInterval(load, REFRESH_MS);

        return ()=>{ cancelled = true; clearInterval(timer); };

    }, [execution?.id]);

    if(!execution || !data || data.machines.length === 0){
        return null;
    }

    const primary = data.machines[0];
    const support = data.machines.slice(1);

    const running = data.phase_status === "IN_PROGRESS";
    const transit = data.current_phase === "PHASE_1" || data.current_phase === "PHASE_3";
    const silent = running && !["live", "stale"].includes(data.primary_status);

    const lat = reading(primary, "gps_lat");
    const lng = reading(primary, "gps_lng");
    const speed = reading(primary, "speed");

    return(

        <div className="execution-card" style={{marginTop:12}}>

            <h2 className="execution-section-title">
                Machine Telemetry
                <span style={{fontSize:12, fontWeight:500, marginLeft:10, opacity:.7}}>
                    {PHASE_LABEL[data.current_phase] || data.current_phase}
                </span>
            </h2>

            {silent && (
                <p style={{margin:"0 0 10px", color:"#991b1b", fontWeight:700, fontSize:13}}>
                    No live readings from {primary.machine_name} - {transit
                        ? "position, distance and ETA are not updating from the machine."
                        : "sensor values below are the last known."}
                </p>
            )}

            <div style={{display:"flex", alignItems:"center", gap:12, flexWrap:"wrap", marginBottom:10}}>

                <strong>{primary.machine_name}</strong>

                <TelemetryPill entry={primary} />

                {transit && (
                    <span style={{fontSize:12, opacity:.8}}>
                        {data.device_position_active
                            ? "Position source: machine GPS (live)"
                            : data.position_source === "DEVICE"
                                ? "Position source: machine GPS (last received)"
                                : "Position source: entered by staff"}
                    </span>
                )}

            </div>

            <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10}}>

                {[
                    ["Position", lat !== undefined && lng !== undefined ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : "—"],
                    ["Speed", speed !== undefined ? fmt(speed * 3.6, 1, " km/h") : "—"],
                    ["Motor", reading(primary, "motor_status") ?? "—"],
                    ["Pump flow", fmt(reading(primary, "pump_flow_rate"), 2, " m³/h")],
                    ["Pressure", fmt(reading(primary, "pressure"), 1, " bar")],
                    ["Tilt (pitch / roll)", `${fmt(reading(primary, "imu_pitch"), 1, "°")} / ${fmt(reading(primary, "imu_roll"), 1, "°")}`]
                ].map(([label, value])=>(
                    <div key={label} style={{border:"1px solid var(--line)", borderRadius:8, padding:"8px 10px"}}>
                        <div style={{fontSize:11, textTransform:"uppercase", letterSpacing:".05em", opacity:.65}}>{label}</div>
                        <div style={{fontWeight:800, fontFamily:"monospace"}}>{value}</div>
                    </div>
                ))}

            </div>

            {support.length > 0 && (
                <div style={{marginTop:10, fontSize:12, display:"flex", gap:12, flexWrap:"wrap", alignItems:"center"}}>
                    <span style={{opacity:.7}}>Support machines:</span>
                    {support.map(m=>(
                        <span key={m.id} style={{display:"inline-flex", gap:6, alignItems:"center"}}>
                            {m.machine_name}
                            <TelemetryPill entry={m} showAge={false} />
                        </span>
                    ))}
                </div>
            )}

        </div>

    );

}
