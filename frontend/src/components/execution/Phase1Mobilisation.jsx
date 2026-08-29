// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "./Execution.css";

import {
    updateExecutionProgress,
    setExecutionRoute,
    geocodeExecutionCoordinates
}
from "../../services/executionService";

import ExecutionRouteMap from "./ExecutionRouteMap";

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";

import { isBeforePlannedStart } from "../../utils/executionSchedule";

// Derived server-side from distance travelled vs. total (see
// backend's update_execution_progress) - display labels only, the
// underlying value is never typed by hand.
const TRANSPORT_STATUS_LABELS = {
    WAITING: "Not started",
    IN_TRANSIT: "In transit",
    REACHED: "Reached"
};


// ====================================
// PHASE 1
// ====================================

export default function Phase1Mobilisation({

    execution,

    refreshExecution

}){

    const { hasTask } = useAuth();

    // Matches the backend's own started-check - route can still be set
    // before the phase starts (it's a setup step Start Current Phase
    // itself depends on to compute distance), but progress can only be
    // recorded once the phase has genuinely begun.
    const phaseStarted = execution?.phase_1_status !== "PENDING";

    // Pure date check, independent of phaseStarted - no progress can be
    // recorded before this job's own scheduled start date, no matter
    // what state the execution is otherwise in. Get Coordinates and
    // Save Route are deliberately excluded from this gate (canSetRoute
    // below) so the map/route can still be prepared ahead of time.
    const beforePlannedStart = isBeforePlannedStart(execution);

    const canUpdateProgress = phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "update_progress");
    const canSetRoute = hasTask("enquiry-tab-execution", "set_execution_route");

    const [
        form,
        setForm
    ] = useState({

        latitude:0,

        longitude:0,

        speed_kmph:0,

        heading:0,

        altitude:0,

        accuracy_meters:0,

        current_activity:"",

        remarks:""

    });

    const [route, setRoute] = useState({

        source_latitude:"",
        source_longitude:"",
        destination_latitude:"",
        destination_longitude:""

    });

    const [savingRoute, setSavingRoute] = useState(false);
    const [geocoding, setGeocoding] = useState(false);
    const [geocodeWarnings, setGeocodeWarnings] = useState(null);


    // ====================================
    // LOAD
    // ====================================

    useEffect(()=>{

        if(!execution){

            return;

        }

        setForm({

            latitude:execution.latitude ?? 0,

            longitude:execution.longitude ?? 0,

            speed_kmph:execution.speed_kmph ?? 0,

            heading:execution.heading ?? 0,

            altitude:execution.altitude ?? 0,

            accuracy_meters:execution.accuracy_meters ?? 0,

            current_activity:execution.current_activity ?? "",

            remarks:execution.remarks ?? ""

        });

        setRoute({

            source_latitude:execution.source_latitude ?? "",
            source_longitude:execution.source_longitude ?? "",
            destination_latitude:execution.destination_latitude ?? "",
            destination_longitude:execution.destination_longitude ?? ""

        });

    },[execution]);


    // ====================================
    // UPDATE FIELD
    // ====================================

    function updateField(field,value){

        setForm(previous=>({

            ...previous,

            [field]:value

        }));

    }

    function updateRouteField(field, value){

        setRoute(previous=>({ ...previous, [field]:value }));

    }


    // ====================================
    // CALCULATIONS
    // Mirrors exactly what the backend's own update_execution_progress
    // formula computes, so what's shown here never drifts from what
    // actually gets saved - total is the derived route distance
    // (source -> destination, no longer hand-typed here). travelled is
    // read straight from the persisted execution row (the real,
    // accumulated total), never from the delta input below.
    // ====================================

    const totalDistance = Number(execution?.distance_to_cover_km ?? 0);

    const travelledDistance = Number(execution?.distance_travelled_km ?? 0);

    const remainingDistance = Math.max(totalDistance - travelledDistance, 0);

    const phaseProgress =
        totalDistance > 0
        ? Math.min(travelledDistance / totalDistance, 1) * 100
        : 0;

    // ETA is stored in minutes (matches the DB column/every other
    // consumer of it, e.g. the invoice sync) - only the display here
    // is reformatted to hours + minutes, nothing about the stored unit
    // changes.
    const etaMinutesTotal = Number(execution?.eta_minutes ?? 0);
    const etaDisplay = `${Math.floor(etaMinutesTotal / 60)}h ${etaMinutesTotal % 60}m`;


    // ====================================
    // SAVE ROUTE
    // ====================================

    async function saveRoute(){

        setSavingRoute(true);

        try{

            await setExecutionRoute(execution.id, {

                source_latitude: route.source_latitude === "" ? null : Number(route.source_latitude),
                source_longitude: route.source_longitude === "" ? null : Number(route.source_longitude),
                destination_latitude: route.destination_latitude === "" ? null : Number(route.destination_latitude),
                destination_longitude: route.destination_longitude === "" ? null : Number(route.destination_longitude)

            });

            if(refreshExecution){
                await refreshExecution(execution.id);
            }

        }
        catch(error){

            console.error(error);
            alert("Unable to save the route.");

        }
        finally{

            setSavingRoute(false);

        }

    }


    // ====================================
    // GET COORDINATES
    // Re-searches this job's own hub name (source) and site location
    // (destination) text via the backend's geocode lookup and fills
    // in whatever's found - safe to click any number of times, e.g.
    // if the job's site location text was corrected after the phase
    // was already started once.
    // ====================================

    async function handleGetCoordinates(){

        setGeocoding(true);
        setGeocodeWarnings(null);

        try{

            const result = await geocodeExecutionCoordinates(execution.id);

            setGeocodeWarnings(result.geocode_warnings ?? null);

            if(refreshExecution){
                await refreshExecution(execution.id);
            }

        }
        catch(error){

            console.error(error);
            alert("Unable to search for coordinates.");

        }
        finally{

            setGeocoding(false);

        }

    }


    // ====================================
    // SAVE
    // ====================================

    async function saveMobilisation(){

        try{

            await updateExecutionProgress(

                execution.id,

                {

                    latitude:Number(form.latitude),

                    longitude:Number(form.longitude),

                    speed_kmph:Number(form.speed_kmph),

                    heading:Number(form.heading),

                    altitude:Number(form.altitude),

                    accuracy_meters:Number(form.accuracy_meters),

                    current_activity:form.current_activity,

                    remarks:form.remarks

                }

            );

            if(refreshExecution){

                await refreshExecution(

                    execution.id

                );

            }

            alert(

                "Mobilisation Updated"

            );

        }

        catch(error){

            console.error(error);

            alert(

                "Update Failed"

            );

        }

    }


    // ====================================
    // UI
    // ====================================

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">

                Phase 1 - Mobilisation

            </h2>

            <div className="execution-metric-grid">

                <div className="execution-metric">

                    <h5>Total Distance</h5>

                    <h2>

                        {totalDistance.toFixed(2)} km

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>Distance Travelled</h5>

                    <h2>

                        {travelledDistance.toFixed(2)} km

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>Distance Remaining</h5>

                    <h2>

                        {remainingDistance.toFixed(2)} km

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>Phase Progress</h5>

                    <h2>

                        {phaseProgress.toFixed(1)}%

                    </h2>

                </div>

            </div>

            <div className="execution-progress">

                <div

                    className="execution-progress-fill"

                    style={{

                        width:`${phaseProgress}%`

                    }}

                />

            </div>

            <br/>

            <div data-guide-id="phase1-route" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase1-route" floating/>

            <h5 style={{margin:"0 0 10px"}}>Source &amp; Destination</h5>

            <div className="execution-form-grid">

                <div className="execution-form-group">
                    <label>Source Latitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={route.source_latitude}
                        onChange={e=>updateRouteField("source_latitude", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>Source Longitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={route.source_longitude}
                        onChange={e=>updateRouteField("source_longitude", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>Destination Latitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={route.destination_latitude}
                        onChange={e=>updateRouteField("destination_latitude", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>Destination Longitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={route.destination_longitude}
                        onChange={e=>updateRouteField("destination_longitude", e.target.value)}
                    />
                </div>

            </div>

            {canSetRoute && (
                <div className="execution-actions">
                    <button
                        className="execution-btn"
                        onClick={handleGetCoordinates}
                        disabled={geocoding}
                        title="Search coordinates for this job's hub (source) and site location (destination) text"
                    >
                        {geocoding ? "Searching..." : "Get Coordinates"}
                    </button>
                    <button
                        className="execution-btn"
                        onClick={saveRoute}
                        disabled={savingRoute}
                    >
                        {savingRoute ? "Saving Route..." : "Save Route"}
                    </button>
                </div>
            )}

            {geocodeWarnings && (geocodeWarnings.source || geocodeWarnings.destination) && (
                <p style={{color:"var(--orange)", fontSize:13, marginTop:6}}>
                    {geocodeWarnings.source && <>⚠ Source: {geocodeWarnings.source}<br/></>}
                    {geocodeWarnings.destination && <>⚠ Destination: {geocodeWarnings.destination}</>}
                </p>
            )}

            <ExecutionRouteMap
                sourceLat={execution?.source_latitude}
                sourceLng={execution?.source_longitude}
                destinationLat={execution?.destination_latitude}
                destinationLng={execution?.destination_longitude}
                currentLat={execution?.latitude}
                currentLng={execution?.longitude}
                distanceKm={execution?.distance_to_cover_km}
            />

            </div>

            <br/>

            <div data-guide-id="phase1-position" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase1-position" floating/>

            <h5 style={{margin:"0 0 10px"}}>Last Known Position</h5>

            <div className="execution-form-grid">

                <div className="execution-form-group">

                    <label>

                        Latitude

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.latitude}

                        onChange={e=>updateField("latitude",e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Longitude

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.longitude}

                        onChange={e=>updateField("longitude",e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Speed (km/h)

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.speed_kmph}

                        onChange={e=>updateField("speed_kmph",e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        ETA (calculated)

                    </label>

                    <input

                        className="execution-input"

                        type="text"

                        value={etaDisplay}

                        disabled

                        readOnly

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Transport Status (calculated)

                    </label>

                    <input

                        className="execution-input"

                        value={TRANSPORT_STATUS_LABELS[execution?.transport_status] || "Not started"}

                        disabled

                        readOnly

                    />

                </div>

                <div
                    className="execution-form-group"
                    style={{gridColumn:"1 / -1"}}
                >

                    <label>

                        Current Activity

                    </label>

                    <textarea

                        className="execution-textarea"

                        rows={3}

                        value={form.current_activity}

                        onChange={e=>updateField("current_activity",e.target.value)}

                    />

                </div>

                <div
                    className="execution-form-group"
                    style={{gridColumn:"1 / -1"}}
                >

                    <label>

                        Remarks

                    </label>

                    <textarea

                        className="execution-textarea"

                        rows={3}

                        value={form.remarks}

                        onChange={e=>updateField("remarks",e.target.value)}

                    />

                </div>

            </div>

            {beforePlannedStart && (
                <p className="execution-map-empty" style={{textAlign:"left", padding:0, marginBottom:8}}>
                    This job isn't scheduled to start until {execution.planned_start} - no updates can be recorded before then.
                </p>
            )}

            {!beforePlannedStart && !phaseStarted && (
                <p className="execution-map-empty" style={{textAlign:"left", padding:0, marginBottom:8}}>
                    Start Current Phase (in Execution Controls below) before recording progress here.
                </p>
            )}

            {canUpdateProgress && (
                <div className="execution-actions">

                    <button

                        className="execution-btn"

                        onClick={saveMobilisation}

                    >

                        Save Mobilisation

                    </button>

                </div>
            )}

            </div>

        </div>

    );

}
