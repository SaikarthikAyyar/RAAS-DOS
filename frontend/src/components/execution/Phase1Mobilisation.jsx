// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "./Execution.css";

import {
    updateExecutionProgress,
    setExecutionRoute
}
from "../../services/executionService";

import ExecutionRouteMap from "./ExecutionRouteMap";

import { useAuth } from "../../contexts/AuthContext";


// ====================================
// PHASE 1
// ====================================

export default function Phase1Mobilisation({

    execution,

    refreshExecution

}){

    const { hasTask } = useAuth();

    const canUpdateProgress = hasTask("enquiry-tab-execution", "update_progress");
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

        eta_minutes:0,

        distance_travelled_km:0,

        transport_status:"",

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

            eta_minutes:execution.eta_minutes ?? 0,

            distance_travelled_km:execution.distance_travelled_km ?? 0,

            transport_status:execution.transport_status ?? "",

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
    // (source -> destination, no longer hand-typed here), travelled
    // is the one figure still manually entered.
    // ====================================

    const totalDistance = Number(execution?.distance_to_cover_km ?? 0);

    const travelledDistance = Number(form.distance_travelled_km ?? 0);

    const remainingDistance = Math.max(totalDistance - travelledDistance, 0);

    const phaseProgress =
        totalDistance > 0
        ? Math.min(travelledDistance / totalDistance, 1) * 100
        : 0;


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

                    eta_minutes:Number(form.eta_minutes),

                    distance_travelled_km:Number(form.distance_travelled_km),

                    transport_status:form.transport_status,

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
                        onClick={saveRoute}
                        disabled={savingRoute}
                    >
                        {savingRoute ? "Saving Route..." : "Save Route"}
                    </button>
                </div>
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

            <br/>

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

                        ETA (Minutes)

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.eta_minutes}

                        onChange={e=>updateField("eta_minutes",e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Distance Travelled (km)

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.distance_travelled_km}

                        onChange={e=>updateField("distance_travelled_km",e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Transport Status

                    </label>

                    <input

                        className="execution-input"

                        value={form.transport_status}

                        onChange={e=>updateField("transport_status",e.target.value)}

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

    );

}
