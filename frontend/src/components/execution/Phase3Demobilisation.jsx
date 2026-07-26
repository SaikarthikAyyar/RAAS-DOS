// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import {

    updateExecutionProgress

}

from "../../services/executionService";


// ====================================
// PHASE 3
// DEMOBILISATION
// ====================================

export default function Phase3Demobilisation({

    execution,

    refreshExecution

}){

    const [

        form,

        setForm

    ] = useState({

        current_activity:"",

        transport_status:"",

        remarks:"",

        latitude:0,

        longitude:0,

        speed_kmph:0,

        eta_minutes:0,

        distance_remaining_km:0,

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

            current_activity:

                execution.current_activity ?? "",

            transport_status:

                execution.transport_status ?? "",

            remarks:

                execution.remarks ?? "",

            latitude:

                execution.latitude ?? 0,

            longitude:

                execution.longitude ?? 0,

            speed_kmph:

                execution.speed_kmph ?? 0,

            eta_minutes:

                execution.eta_minutes ?? 0,

            distance_remaining_km:

                execution.distance_remaining_km ?? 0,

            proof_uploaded:

                execution.proof_uploaded ?? false

        });

    },[execution]);


    // ====================================
    // UPDATE FIELD
    // ====================================

    function updateField(

        field,

        value

    ){

        setForm(

            previous=>({

                ...previous,

                [field]:

                    value

            })

        );

    }


    // ====================================
    // SAVE
    // ====================================

    async function saveDemobilisation(){

        try{

            await updateExecutionProgress(

                execution.id,

                {

                    latitude:

                        Number(form.latitude),

                    longitude:

                        Number(form.longitude),

                    speed_kmph:

                        Number(form.speed_kmph),

                    eta_minutes:

                        Number(form.eta_minutes),

                    distance_remaining_km:

                        Number(form.distance_remaining_km),

                    transport_status:

                        form.transport_status,

                    current_activity:

                        form.current_activity,

                    remarks:

                        form.remarks,

                    proof_uploaded:

                        form.proof_uploaded

                }

            );

            alert(

                "Demobilisation Updated"

            );

            if(

                refreshExecution

            ){

                refreshExecution(

                    execution.id

                );

            }

        }

        catch(error){

            console.error(

                error

            );

            alert(

                "Update Failed"

            );

        }

    }


    // ====================================
    // UI
    // ====================================

    return(

        <div
            style={{

                marginTop:"20px",

                padding:"20px",

                border:"1px solid #444",

                borderRadius:"8px",

                background:"#1f1f1f",

                color:"#ffffff"

            }}
        >

            <h2>

                Phase 3 - Demobilisation

            </h2>

            <hr/>

            <h3>

                Return Journey

            </h3>

            <p>

                Latitude :

                {" "}

                {form.latitude}

            </p>

            <p>

                Longitude :

                {" "}

                {form.longitude}

            </p>

            <p>

                Speed :

                {" "}

                {form.speed_kmph}

                km/h

            </p>

            <p>

                ETA :

                {" "}

                {form.eta_minutes}

                minutes

            </p>

            <p>

                Distance Remaining :

                {" "}

                {form.distance_remaining_km}

                km

            </p>

            <hr/>

            <label>

                Transport Status

            </label>

            <br/>

            <input

                value={form.transport_status}

                onChange={

                    e=>updateField(

                        "transport_status",

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <label>

                Current Activity

            </label>

            <br/>

            <textarea

                rows={3}

                value={form.current_activity}

                onChange={

                    e=>updateField(

                        "current_activity",

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <label>

                Remarks

            </label>

            <br/>

            <textarea

                rows={4}

                value={form.remarks}

                onChange={

                    e=>updateField(

                        "remarks",

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <label>

                <input

                    type="checkbox"

                    checked={form.proof_uploaded}

                    onChange={

                        e=>updateField(

                            "proof_uploaded",

                            e.target.checked

                        )

                    }

                />

                Proof Uploaded

            </label>

            <br/><br/>

            <div
                style={{

                    height:"250px",

                    border:"1px dashed #666",

                    display:"flex",

                    justifyContent:"center",

                    alignItems:"center",

                    color:"#888"

                }}
            >

                Live Return GPS Map

            </div>

            <br/>

            <button

                onClick={

                    saveDemobilisation

                }

            >

                Save Demobilisation

            </button>

        </div>

    );

}