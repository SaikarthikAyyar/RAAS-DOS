// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import {

    updateExecutionProgress,

    getExecution

}

from "../../services/executionService";


// ====================================
// PHASE 2
// ====================================

export default function Phase2Execution({

    execution,

    refreshExecution

}){

    const [

        form,

        setForm

    ] = useState({

        today_output:0,

        total_output:0,

        daily_target:0,

        output_unit:"m³",

        current_activity:"",

        remarks:"",

        proof_uploaded:false

    });


    // ====================================
    // LOAD FORM
    // ====================================

    useEffect(()=>{

        if(!execution){

            return;

        }

        setForm({

            today_output:

                execution.today_output ?? 0,

            total_output:

                execution.total_output ?? 0,

            daily_target:

                execution.daily_target ?? 0,

            output_unit:

                execution.output_unit ?? "m³",

            current_activity:

                execution.current_activity ?? "",

            remarks:

                execution.remarks ?? "",

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
    // CALCULATIONS
    // ====================================

    const estimatedVolume =

        Number(

            execution?.estimated_volume ?? 0

        );

    const totalOutput =

        Number(

            form.total_output

        );

    const remainingVolume =

        Math.max(

            estimatedVolume -

            totalOutput,

            0

        );

    const completionPercentage =

        estimatedVolume > 0

        ?

        (

            totalOutput /

            estimatedVolume

        ) * 100

        :

        0;


    // ====================================
    // SAVE
    // ====================================

    async function saveProgress(){

        try{

            await updateExecutionProgress(

                execution.id,

                {

                    today_output:

                        Number(form.today_output),

                    total_output:

                        Number(form.total_output),

                    daily_target:

                        Number(form.daily_target),

                    output_unit:

                        form.output_unit,

                    current_activity:

                        form.current_activity,

                    remarks:

                        form.remarks,

                    proof_uploaded:

                        form.proof_uploaded

                }

            );

            alert(

                "Execution Updated"

            );

            if(

                refreshExecution

            ){

                refreshExecution(

                    execution.id

                );

            }

            else{

                await getExecution(

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

                Phase 2 - Live Execution

            </h2>

            <hr/>

            <h3>

                Production Summary

            </h3>

            <p>

                Estimated Volume :

                {" "}

                <strong>

                    {estimatedVolume}

                    {" "}

                    {form.output_unit}

                </strong>

            </p>

            <p>

                Remaining Volume :

                {" "}

                <strong>

                    {remainingVolume}

                    {" "}

                    {form.output_unit}

                </strong>

            </p>

            <p>

                Completion :

                {" "}

                <strong>

                    {completionPercentage.toFixed(1)}%

                </strong>

            </p>

            <div
                style={{
                    width:"100%",
                    height:"18px",
                    background:"#555",
                    borderRadius:"4px",
                    overflow:"hidden"
                }}
            >

                <div
                    style={{
                        width:`${completionPercentage}%`,
                        height:"100%",
                        background:"#4caf50"
                    }}
                />

            </div>

            <hr/>

            <h3>

                Daily Production

            </h3>

            <label>

                Today's Output

            </label>

            <br/>

            <input

                type="number"

                value={form.today_output}

                onChange={

                    e=>updateField(

                        "today_output",

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <label>

                Total Output

            </label>

            <br/>

            <input

                type="number"

                value={form.total_output}

                onChange={

                    e=>updateField(

                        "total_output",

                        e.target.value

                    )

                }

            />

            <br/><br/>

            <label>

                Daily Target

            </label>

            <br/>

            <input

                type="number"

                value={form.daily_target}

                onChange={

                    e=>updateField(

                        "daily_target",

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

                {" "}

                Proof Uploaded

            </label>

            <br/><br/>

            <button

                onClick={

                    saveProgress

                }

            >

                Save Execution Progress

            </button>

        </div>

    );

}