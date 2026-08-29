// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "./Execution.css";

import {
    updateExecutionProgress
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
    REACHED: "Reached",
    COMPLETED: "Completed"
};


// ====================================
// PHASE 3
// ====================================

export default function Phase3Demobilisation({

    execution,

    refreshExecution

}){

    const { hasTask } = useAuth();

    // Matches the backend's own started-check - progress can only be
    // recorded once this phase has genuinely begun via Start Current
    // Phase.
    const phaseStarted = execution?.phase_3_status !== "PENDING";

    // Pure date check, independent of phaseStarted - see
    // ExecutionControls.jsx / Phase1Mobilisation.jsx for the full
    // reasoning.
    const beforePlannedStart = isBeforePlannedStart(execution);

    const canUpdateProgress = phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "update_progress");

    const [
        form,
        setForm
    ] = useState({

        current_activity:"",

        remarks:"",

        latitude:0,

        longitude:0,

        speed_kmph:0,

        proof_uploaded:false

    });


    // ====================================
    // LOAD
    // ====================================

    useEffect(()=>{

        if(!execution){

            return;

        }

        setForm({

            current_activity: execution.current_activity ?? "",

            remarks: execution.remarks ?? "",

            latitude: execution.latitude ?? 0,

            longitude: execution.longitude ?? 0,

            speed_kmph: execution.speed_kmph ?? 0,

            proof_uploaded: execution.proof_uploaded ?? false

        });

    },[execution]);


    // ====================================
    // UPDATE FIELD
    // ====================================

    function updateField(field, value){

        setForm(previous=>({ ...previous, [field]:value }));

    }


    // ====================================
    // CALCULATIONS
    // Same reasoning as Phase 1 - mirrors the backend's own formula
    // exactly instead of a separate client-side approximation. The
    // return leg reuses the same source/destination pair Phase 1 set
    // (a great-circle distance is symmetric either direction).
    // ====================================

    const totalDistance = Number(execution?.distance_to_cover_km ?? 0);

    const travelledDistance = Number(execution?.distance_travelled_km ?? 0);

    const remainingDistance = Math.max(totalDistance - travelledDistance, 0);

    const phaseProgress =
        totalDistance > 0
        ? Math.min(travelledDistance / totalDistance, 1) * 100
        : 0;

    const executionContribution = 66 + (phaseProgress * 0.34);

    // ETA is stored in minutes (matches the DB column/every other
    // consumer of it, e.g. the invoice sync) - only the display here
    // is reformatted to hours + minutes, nothing about the stored unit
    // changes.
    const etaMinutesTotal = Number(execution?.eta_minutes ?? 0);
    const etaDisplay = `${Math.floor(etaMinutesTotal / 60)}h ${etaMinutesTotal % 60}m`;


    // ====================================
    // SAVE
    // ====================================

    async function saveDemobilisation(){

        try{

            await updateExecutionProgress(

                execution.id,

                {

                    latitude: Number(form.latitude),

                    longitude: Number(form.longitude),

                    speed_kmph: Number(form.speed_kmph),

                    current_activity: form.current_activity,

                    remarks: form.remarks,

                    proof_uploaded: form.proof_uploaded

                }

            );

            if(refreshExecution){

                await refreshExecution(execution.id);

            }

            alert("Demobilisation Updated");

        }

        catch(error){

            console.error(error);

            alert("Update Failed");

        }

    }


    // ====================================
    // UI
    // ====================================

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">

                Phase 3 - Demobilisation

            </h2>

            <div className="execution-metric-grid">

                <div className="execution-metric">
                    <h5>Total Distance</h5>
                    <h2>{totalDistance.toFixed(2)} km</h2>
                </div>

                <div className="execution-metric">
                    <h5>Distance Travelled</h5>
                    <h2>{travelledDistance.toFixed(2)} km</h2>
                </div>

                <div className="execution-metric">
                    <h5>Distance Remaining</h5>
                    <h2>{remainingDistance.toFixed(2)} km</h2>
                </div>

                <div className="execution-metric">
                    <h5>Phase Progress</h5>
                    <h2>{phaseProgress.toFixed(1)}%</h2>
                </div>

            </div>

            <div className="execution-progress">

                <div
                    className="execution-progress-fill"
                    style={{ width:`${phaseProgress}%` }}
                />

            </div>

            <p
                style={{
                    marginTop:"10px",
                    fontWeight:"700",
                    fontSize:"12.5px",
                    color:"var(--ink)"
                }}
            >

                Overall Execution Progress : {executionContribution.toFixed(1)}%

            </p>

            <br/>

            <div data-guide-id="phase3-route" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase3-route" floating/>

            <h5 style={{margin:"0 0 10px"}}>Return Route</h5>

            {/*
                The two physical endpoints of the job (hub <-> site)
                were already fixed via Phase 1's "Save Route" - they
                don't change for the return leg, so this is read-only
                rather than a second editable form writing into the
                same shared source_latitude/longitude columns (that
                previously invited re-entering the SAME two points
                here, with no real purpose).

                Direction is swapped for display: this leg physically
                starts at the site (Phase 1's "destination") and ends
                back at the hub (Phase 1's "source") - showing them in
                Phase 1's original orientation here would have the
                blue "Source" pin sitting at the hub and the orange
                "Destination" pin at the site while the machine is
                actually travelling the opposite way.
            */}

            <p className="execution-map-empty" style={{textAlign:"left", padding:0, marginBottom:10}}>
                Returning from {execution?.site_location || "the site"}
                {" "}({execution?.destination_latitude}, {execution?.destination_longitude})
                {" "}back to source ({execution?.source_latitude}, {execution?.source_longitude}).
            </p>

            <ExecutionRouteMap
                sourceLat={execution?.destination_latitude}
                sourceLng={execution?.destination_longitude}
                destinationLat={execution?.source_latitude}
                destinationLng={execution?.source_longitude}
                currentLat={execution?.latitude}
                currentLng={execution?.longitude}
                distanceKm={execution?.distance_to_cover_km}
            />

            </div>

            <br/>

            <div data-guide-id="phase3-position" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase3-position" floating/>

            <h5 style={{margin:"0 0 10px"}}>Last Known Position</h5>

            <div className="execution-form-grid">

                <div className="execution-form-group">
                    <label>Latitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={form.latitude}
                        onChange={e=>updateField("latitude", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>Longitude</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={form.longitude}
                        onChange={e=>updateField("longitude", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>Speed (km/h)</label>
                    <input
                        className="execution-input"
                        type="number"
                        value={form.speed_kmph}
                        onChange={e=>updateField("speed_kmph", e.target.value)}
                    />
                </div>

                <div className="execution-form-group">
                    <label>ETA (calculated)</label>
                    <input
                        className="execution-input"
                        type="text"
                        value={etaDisplay}
                        disabled
                        readOnly
                    />
                </div>

                <div className="execution-form-group">
                    <label>Transport Status (calculated)</label>
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
                    <label>Current Activity</label>
                    <textarea
                        className="execution-textarea"
                        rows={3}
                        value={form.current_activity}
                        onChange={e=>updateField("current_activity", e.target.value)}
                    />
                </div>

                <div
                    className="execution-form-group"
                    style={{gridColumn:"1 / -1"}}
                >
                    <label>Remarks</label>
                    <textarea
                        className="execution-textarea"
                        rows={4}
                        value={form.remarks}
                        onChange={e=>updateField("remarks", e.target.value)}
                    />
                </div>

                <div
                    className="execution-form-group"
                    style={{gridColumn:"1 / -1"}}
                >
                    <label
                        style={{
                            display:"flex",
                            alignItems:"center",
                            gap:"12px"
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={form.proof_uploaded}
                            onChange={e=>updateField("proof_uploaded", e.target.checked)}
                        />
                        Proof Uploaded
                    </label>
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
                        onClick={saveDemobilisation}
                    >
                        Save Demobilisation
                    </button>
                </div>
            )}

            </div>

        </div>

    );

}
