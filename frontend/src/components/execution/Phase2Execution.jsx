// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "./Execution.css";

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

        setForm(previous=>({

            ...previous,

            [field]:value

        }));

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

        Math.min(

            (

                totalOutput /

                estimatedVolume

            ) * 100,

            100

        )

        :

        0;

    const executionContribution =

        33 +

        (

            completionPercentage *

            0.33

        );


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

            if(refreshExecution){

                await refreshExecution(

                    execution.id

                );

            }

            else{

                await getExecution(

                    execution.id

                );

            }

            alert(

                "Execution Updated"

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

                Phase 2 - Live Execution

            </h2>

            <div className="execution-metric-grid">

                <div className="execution-metric">

                    <h5>

                        Estimated Volume

                    </h5>

                    <h2>

                        {estimatedVolume.toFixed(2)}

                        {" "}

                        {form.output_unit}

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>

                        Completed Volume

                    </h5>

                    <h2>

                        {totalOutput.toFixed(2)}

                        {" "}

                        {form.output_unit}

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>

                        Remaining Volume

                    </h5>

                    <h2>

                        {remainingVolume.toFixed(2)}

                        {" "}

                        {form.output_unit}

                    </h2>

                </div>

                <div className="execution-metric">

                    <h5>

                        Phase Progress

                    </h5>

                    <h2>

                        {completionPercentage.toFixed(1)}%

                    </h2>

                </div>

            </div>

            <div className="execution-progress">

                <div

                    className="execution-progress-fill"

                    style={{

                        width:`${completionPercentage}%`

                    }}

                />

            </div>

            <p
                style={{
                    marginTop:"12px",
                    fontWeight:"600",
                    color:"#d8ecec"
                }}
            >

                Overall Execution Progress :

                {" "}

                {executionContribution.toFixed(1)}%

            </p>

            <div className="execution-form-grid">

                <div className="execution-form-group">

                    <label>

                        Today's Output

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.today_output}

                        onChange={e=>updateField(

                            "today_output",

                            e.target.value

                        )}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Total Output

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.total_output}

                        onChange={e=>updateField(

                            "total_output",

                            e.target.value

                        )}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Daily Target

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.daily_target}

                        onChange={e=>updateField(

                            "daily_target",

                            e.target.value

                        )}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Output Unit

                    </label>

                    <input

                        className="execution-input"

                        value={form.output_unit}

                        onChange={e=>updateField(

                            "output_unit",

                            e.target.value

                        )}

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

                        onChange={e=>updateField(

                            "current_activity",

                            e.target.value

                        )}

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

                        rows={4}

                        value={form.remarks}

                        onChange={e=>updateField(

                            "remarks",

                            e.target.value

                        )}

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

                            onChange={e=>updateField(

                                "proof_uploaded",

                                e.target.checked

                            )}

                        />

                        Proof Uploaded

                    </label>

                </div>

            </div>

            <div className="execution-actions">

                <button

                    className="execution-btn"

                    onClick={saveProgress}

                >

                    Save Execution Progress

                </button>

            </div>

        </div>

    );

}