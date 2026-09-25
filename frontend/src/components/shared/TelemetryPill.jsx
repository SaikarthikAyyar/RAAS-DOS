import "./TelemetryPill.css";


const META = {
    live: { label: "Live", cls: "tp-green" },
    stale: { label: "Stale", cls: "tp-amber" },
    offline: { label: "Offline", cls: "tp-red" },
    no_data: { label: "No data", cls: "tp-gray" },
    no_source: { label: "No telemetry", cls: "tp-gray" }
};


export function formatAge(seconds){

    if(seconds === null || seconds === undefined) return "";
    if(seconds < 60) return `${Math.round(seconds)}s ago`;
    if(seconds < 3600) return `${Math.round(seconds / 60)}m ago`;
    if(seconds < 86400) return `${Math.round(seconds / 3600)}h ago`;
    return `${Math.round(seconds / 86400)}d ago`;

}


// One machine's sensor status as a small pill, with "last reading" age
// alongside unless the machine is live. `entry` is a row from
// GET /machine-telemetry (undefined = not reported yet).
export default function TelemetryPill({ entry, title, showAge = true }){

    const state = entry?.telemetry_status || "no_source";
    const meta = META[state] || META.no_source;

    return(

        <span className="tp-wrap" title={title || entry?.machine_code}>

            <span className={`tp-pill ${meta.cls}`}>
                <i className="tp-dot" />
                {meta.label}
            </span>

            {showAge && state !== "live" && entry?.age_seconds != null && (
                <small className="tp-age">{formatAge(entry.age_seconds)}</small>
            )}

        </span>

    );

}


// Status for every machine of a Fleet Unit (PRIMARY first, as returned).
export function FleetTelemetryCell({ machines, byId }){

    if(!machines || machines.length === 0){
        return <span className="tp-age">—</span>;
    }

    return(

        <span className="tp-stack">
            {machines.map(m=>(
                <TelemetryPill
                    key={m.id}
                    entry={byId[m.id]}
                    title={`${m.machine_code}${m.role === "SUPPORT" ? " (support)" : ""}`}
                    showAge={m.role !== "SUPPORT"}
                />
            ))}
        </span>

    );

}
