// ====================================
// EXECUTION TRAVEL - READ ONLY
// Phase 1 (Mobilisation) and Phase 3 (Demobilisation) both boil down
// to the same customer-facing story: a machine moving between two
// points. Reused for both, labeled by the caller - purely
// presentational, no inputs, no save actions, no service calls. Pulls
// the exact same execution fields the real (editable) Phase1/3
// components already compute from, so nothing shown here can ever
// drift from what staff see on the working tab.
// ====================================

import "./Execution.css";

import ExecutionRouteMap from "./ExecutionRouteMap";

const TRANSPORT_STATUS_LABELS = {
    WAITING: "Not started",
    IN_TRANSIT: "In transit",
    REACHED: "Reached",
    COMPLETED: "Completed"
};

export default function ExecutionTravelReadOnly({

    execution,

    title

}){

    if(!execution){
        return null;
    }

    const etaMinutesTotal = Number(execution.eta_minutes ?? 0);
    const etaDisplay = `${Math.floor(etaMinutesTotal / 60)}h ${etaMinutesTotal % 60}m`;

    const speed = Number(execution.speed_kmph ?? 0);

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">
                {title}
            </h2>

            <ExecutionRouteMap
                sourceLat={execution.source_latitude}
                sourceLng={execution.source_longitude}
                destinationLat={execution.destination_latitude}
                destinationLng={execution.destination_longitude}
                currentLat={execution.latitude}
                currentLng={execution.longitude}
                distanceKm={execution.distance_to_cover_km}
            />

            <br/>

            <div className="execution-metric-grid">

                <div className="execution-metric">
                    <h5>Speed</h5>
                    <h2>{speed.toFixed(1)} km/h</h2>
                </div>

                <div className="execution-metric">
                    <h5>ETA</h5>
                    <h2>{etaDisplay}</h2>
                </div>

                <div className="execution-metric">
                    <h5>Transportation Status</h5>
                    <h2>{TRANSPORT_STATUS_LABELS[execution.transport_status] || "Not started"}</h2>
                </div>

            </div>

        </div>

    );

}
