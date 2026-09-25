import { useState, useEffect, useCallback } from "react";

import { getMachineTelemetry, getMachineTelemetryDetail } from "../../../services/machineTelemetryService";

import { formatApiError } from "../../../utils/apiError";

import MachineDashboard from "./MachineDashboard";

import SchGpsDashboard from "./SchGpsDashboard";

import "./MachineStatistics.css";


// How often the selected machine re-reads its live state from our
// backend (the list of machines refreshes on the same beat).
const REFRESH_MS = 5000;

const DOT = {
    live: "#16a34a",
    stale: "#d97706",
    offline: "#dc2626",
    no_data: "#9ca3af",
    no_source: "#d1d5db"
};


// Same rule the Varaha dashboard uses: SCH machines get the GPS truck
// dashboard, everything else gets the actuator/health dashboard.
function isSchMachine(detail){

    return detail.family === "SCH" || /(^|-)SCH-/.test(detail.machine_type_code || "");

}


export default function MachineStatisticsTab(){

    const [machines, setMachines] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState("");
    const [mqtt, setMqtt] = useState(null);

    const loadList = useCallback(async()=>{

        try{
            const data = await getMachineTelemetry();
            setMachines(data.machines);
            setMqtt(data.mqtt || null);
            setError(data.error || "");
            setSelectedId(current=>current ?? data.machines[0]?.id ?? null);
        }
        catch(err){
            setError(formatApiError(err, "Unable to load machine statistics."));
        }

    }, []);

    useEffect(()=>{

        loadList();

        const timer = setInterval(loadList, REFRESH_MS);

        return ()=>clearInterval(timer);

    }, [loadList]);

    useEffect(()=>{

        if(selectedId === null) return;

        let cancelled = false;

        async function loadDetail(){

            try{
                const data = await getMachineTelemetryDetail(selectedId);
                if(!cancelled) setDetail(data);
            }
            catch(err){
                if(!cancelled) setError(formatApiError(err, "Unable to load this machine's telemetry."));
            }

        }

        loadDetail();

        const timer = setInterval(loadDetail, REFRESH_MS);

        return ()=>{ cancelled = true; clearInterval(timer); };

    }, [selectedId]);

    function selectMachine(id){

        if(id === selectedId) return;

        setDetail(null);
        setSelectedId(id);

    }

    if(!machines && !error){
        return <div className="bm-card"><p className="bm-muted">Loading machine statistics...</p></div>;
    }

    return(

        <div className="ms-tab">

            <div className="bm-card ms-intro">

                <h3>Machine Statistics</h3>

                <p className="bm-muted">
                    Read-only. Live sensor data for each machine in Machine Inventory, shown the way the Varaha IoT dashboard shows it. Readings arrive straight from the machines over MQTT; the last known reading is kept so it stays visible while a machine is offline.
                </p>

                {mqtt && (
                    <p className="bm-muted" style={{fontSize:12}}>
                        {mqtt.configured
                            ? <>Live feed ({mqtt.mode === "api" ? "interim relay of the Varaha dashboard API - direct broker feed not connected yet" : "MQTT"}): {mqtt.connected ? "connected" : "connecting"} to {mqtt.host} · {mqtt.bots_seen} machine(s) reporting · {mqtt.packets_received.toLocaleString()} packets received{mqtt.last_error ? ` · ${mqtt.last_error}` : ""}</>
                            : "Live feed: not configured (MQTT_HOST is not set) - showing last known readings only."}
                    </p>
                )}

                {error && <p className="bm-muted">{error}</p>}

                <div className="bm-tabs ms-machine-tabs">

                    {(machines || []).map(m=>(

                        <button
                            key={m.id}
                            className={m.id === selectedId ? "active" : ""}
                            onClick={()=>selectMachine(m.id)}
                            title={`${m.machine_name} — ${m.machine_code}`}
                        >
                            <i className="ms-tab-dot" style={{ background: DOT[m.telemetry_status] || DOT.no_source }} />
                            {m.machine_name}
                        </button>

                    ))}

                </div>

            </div>

            {detail && detail.id === selectedId ? (

                <>
                    <div className="ms-machine-title">
                        <strong>{detail.machine_name}</strong>
                        <span>{detail.machine_code} · {detail.inventory_status}{detail.current_site ? ` · ${detail.current_site}` : ""}</span>
                        {!detail.bot_id && <em>No readings have been received from this machine yet — they will appear as soon as it starts reporting.</em>}
                        {detail.bot_id && !detail.last_seen && <em>Reporting as {detail.bot_id}, but no readings have been received yet.</em>}
                    </div>

                    {isSchMachine(detail) ? <SchGpsDashboard detail={detail} /> : <MachineDashboard detail={detail} />}
                </>

            ) : selectedId !== null ? (

                <div className="bm-card"><p className="bm-muted">Loading machine telemetry...</p></div>

            ) : null}

        </div>

    );

}
