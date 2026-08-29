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

import { useAuth } from "../../contexts/AuthContext";

import ComponentExplainerIcon from "../guide/ComponentExplainerIcon";

import { isBeforePlannedStart } from "../../utils/executionSchedule";


// ====================================
// PHASE 2
// ====================================

export default function Phase2Execution({

    execution,

    refreshExecution

}){

    const { hasTask } = useAuth();

    // Matches the backend's own started-check - progress can only be
    // recorded once this phase has genuinely begun via Start Current
    // Phase.
    const phaseStarted = execution?.phase_2_status !== "PENDING";

    // Pure date check, independent of phaseStarted - see
    // ExecutionControls.jsx / Phase1Mobilisation.jsx for the full
    // reasoning. In normal operation Phase 2 can't be reached before
    // this date anyway (Phase 1 itself can't start before it), but the
    // gate is applied uniformly rather than assumed.
    const beforePlannedStart = isBeforePlannedStart(execution);

    const canUpdateProgress = phaseStarted && !beforePlannedStart && hasTask("enquiry-tab-execution", "update_progress");

    const [

        form,

        setForm

    ] = useState({

        daily_target:0,

        output_unit:"m³",

        current_activity:"",

        remarks:"",

        proof_uploaded:false

    });

    // How much was completed since the LAST save - deliberately never
    // synced from `execution` (that would carry over a stale delta or
    // the cumulative figure into a field meant to always start
    // fresh). The backend adds this onto Total Output rather than
    // replacing it - Total Output is never independently editable,
    // it's just the running sum of every one of these entries.
    const [todayOutputDelta, setTodayOutputDelta] = useState(0);


    // ====================================
    // LOAD FORM
    // ====================================

    useEffect(()=>{

        if(!execution){

            return;

        }

        setForm({

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

            execution?.total_output ?? 0

        );

    const targetIsSet = Boolean(execution?.daily_target);

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

                        Number(todayOutputDelta),

                    // Only ever sent while the target hasn't been set
                    // yet - the backend freezes it after that anyway,
                    // but there's no editable field to send a changed
                    // value from once targetIsSet is true.
                    daily_target:

                        targetIsSet ? undefined : Number(form.daily_target),

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

            // Reset the delta back to 0 - it represented "since the
            // last save", which has now happened; leaving the old
            // value in place would double-count it on the next save.
            setTodayOutputDelta(0);

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

        <div className="execution-card" data-guide-id="phase2-output" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="execution" componentId="phase2-output" floating/>

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
                    marginTop:"10px",
                    fontWeight:"700",
                    fontSize:"12.5px",
                    color:"var(--ink)"
                }}
            >

                Overall Execution Progress :

                {" "}

                {executionContribution.toFixed(1)}%

            </p>

            <div className="execution-form-grid">

                <div className="execution-form-group">

                    <label>

                        Output Completed Since Last Update

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={todayOutputDelta}

                        onChange={e=>setTodayOutputDelta(e.target.value)}

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Total Output (cumulative)

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={totalOutput}

                        disabled

                        readOnly

                    />

                </div>

                <div className="execution-form-group">

                    <label>

                        Daily Target{targetIsSet ? " (fixed)" : ""}

                    </label>

                    <input

                        className="execution-input"

                        type="number"

                        value={form.daily_target}

                        disabled={targetIsSet}

                        readOnly={targetIsSet}

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

                        onClick={saveProgress}

                    >

                        Save Execution Progress

                    </button>

                </div>
            )}

        </div>

    );

}