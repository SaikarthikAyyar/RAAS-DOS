// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "./Execution.css";

import {
    updateExecutionProgress
}
from "../../services/executionService";


// ====================================
// PHASE 1
// ====================================

export default function Phase1Mobilisation({

    execution,

    refreshExecution

}){

    const [

        initialDistance,

        setInitialDistance

    ] = useState(null);

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

        distance_to_cover_km:0,

        transport_status:"",

        current_activity:"",

        remarks:""

    });


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

            distance_to_cover_km:execution.distance_to_cover_km ?? 0,

            transport_status:execution.transport_status ?? "",

            current_activity:execution.current_activity ?? "",

            remarks:execution.remarks ?? ""

        });

        if(initialDistance === null){

            setInitialDistance(

                execution.distance_to_cover_km ?? 0

            );

        }

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


    // ====================================
    // CALCULATIONS
    // ====================================

    const totalDistance =

        Number(initialDistance ?? 0);

    const remainingDistance =

        Number(form.distance_to_cover_km ?? 0);

    const travelledDistance =

        Math.max(

            totalDistance -

            remainingDistance,

            0

        );

    const phaseProgress =

        totalDistance > 0

        ?

        (travelledDistance / totalDistance) * 100

        :

        0;


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

                    distance_to_cover_km:Number(form.distance_to_cover_km),

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

                        Distance To Cover (km)

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.distance_to_cover_km}

                        onChange={e=>updateField("distance_to_cover_km",e.target.value)}

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

            <div className="execution-map">

                Live GPS Map

                <br/>

                (Google Maps Integration)

            </div>

            <div className="execution-actions">

                <button

                    className="execution-btn"

                    onClick={saveMobilisation}

                >

                    Save Mobilisation

                </button>

            </div>

        </div>

    );

}