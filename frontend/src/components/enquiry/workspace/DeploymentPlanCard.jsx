import { useState, useEffect } from "react";

import { useAuth } from "../../../contexts/AuthContext";

import { buildActor } from "../../../utils/actor";

import {
    saveDeploymentPlan
} from "../../../services/opsSelectorService";

import {
    saveQuote
} from "../../../services/technoCommercialQuoteService";

import {
    getDewateringMethods
} from "../../../services/dewateringMethodsService";

function defaultCrewPlan(manpowerRequired){

    return [{

        role:"Crew",

        qty_min: manpowerRequired ?? 0,

        qty_max: manpowerRequired ?? 0

    }];

}

function defaultAccessoriesPlan(finalMachine, opsScoring){

    const row = opsScoring.find(

        r => r.machine.code===finalMachine || r.machine.name===finalMachine

    );

    const accessories = row?.machine?.accessories ?? [];

    return accessories.map(name=>({ name, needed:"Yes" }));

}

export default function DeploymentPlanCard({

    enquiry,

    opsSelection,

    opsScoring = [],

    finalMachine,

    reload

}){

    const { hasTask, user } = useAuth();

    const [mobDays, setMobDays] = useState(opsSelection.mobilisation_days ?? 0);

    const [setupDays, setSetupDays] = useState(opsSelection.setup_days ?? 0);

    const [execDays, setExecDays] = useState(opsSelection.execution_days ?? 0);

    const [demobDays, setDemobDays] = useState(opsSelection.demob_days ?? 0);

    const [crewPlan, setCrewPlan] = useState(

        opsSelection.crew_plan?.length
            ? opsSelection.crew_plan
            : defaultCrewPlan(opsSelection.manpower_required)

    );

    const [accessoriesPlan, setAccessoriesPlan] = useState(

        opsSelection.accessories_plan?.length
            ? opsSelection.accessories_plan
            : defaultAccessoriesPlan(finalMachine, opsScoring)

    );

    const [dewMin, setDewMin] = useState(opsSelection.dewatering_method_min ?? "");

    const [dewMax, setDewMax] = useState(opsSelection.dewatering_method_max ?? "");

    const [dewateringMethods, setDewateringMethods] = useState([]);

    useEffect(()=>{

        getDewateringMethods()
            .then(setDewateringMethods)
            .catch(err=>console.error(err));

    }, []);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    function updateCrewField(index, field, value){

        setCrewPlan(prev=>

            prev.map((row,i)=>

                i===index ? { ...row, [field]:value } : row

            )

        );

    }

    function addCrewRow(){

        setCrewPlan(prev=>[

            ...prev,

            { role:"", qty_min:0, qty_max:0 }

        ]);

    }

    function removeCrewRow(index){

        setCrewPlan(prev=>prev.filter((_,i)=>i!==index));

    }

    function toggleAccessory(index, value){

        setAccessoriesPlan(prev=>

            prev.map((row,i)=>

                i===index ? { ...row, needed:value } : row

            )

        );

    }

    async function handleSaveAndGenerateQuote(){

        setSaving(true);

        setError("");

        try{

            await saveDeploymentPlan(

                opsSelection.id,

                {

                    mobilisation_days:Number(mobDays)||0,

                    setup_days:Number(setupDays)||0,

                    execution_days:Number(execDays)||0,

                    demob_days:Number(demobDays)||0,

                    crew_plan:crewPlan.map(r=>({

                        role:r.role,

                        qty_min:Number(r.qty_min)||0,

                        qty_max:Number(r.qty_max)||0

                    })),

                    accessories_plan:accessoriesPlan,

                    dewatering_method_min:dewMin || null,

                    dewatering_method_max:dewMax || null,

                    enquiry_id:enquiry?.id,

                    actor:buildActor(user)

                }

            );

            await saveQuote({

                ops_selection_id:opsSelection.id,

                enquiry_id:enquiry?.id,

                created_by:user?.name,

                reason:"Generated from Ops Deployment Plan"

            });

            reload();

        }

        catch(err){

            console.error(err);

            setError(

                err?.detail ||
                "Unable to save deployment plan / generate quote."

            );

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="survey-summary-card ops-deployment-card">

            <h3 className="survey-summary-title">

                Deployment Plan

            </h3>

            <div className="ops-days-grid">

                <label>
                    Mob days
                    <input type="number" value={mobDays} onChange={e=>setMobDays(e.target.value)} />
                </label>

                <label>
                    Setup days
                    <input type="number" value={setupDays} onChange={e=>setSetupDays(e.target.value)} />
                </label>

                <label>
                    Exec days
                    <input type="number" value={execDays} onChange={e=>setExecDays(e.target.value)} />
                </label>

                <label>
                    Demob days
                    <input type="number" value={demobDays} onChange={e=>setDemobDays(e.target.value)} />
                </label>

            </div>

            <h4 className="ops-subheading">Crew (Min-Max)</h4>

            <table className="ops-plan-table">

                <thead>
                    <tr>
                        <th>Role</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>

                    {

                        crewPlan.map((row,index)=>(

                            <tr key={index}>

                                <td>
                                    <input
                                        value={row.role}
                                        onChange={e=>updateCrewField(index,"role",e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        value={row.qty_min}
                                        onChange={e=>updateCrewField(index,"qty_min",e.target.value)}
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        value={row.qty_max}
                                        onChange={e=>updateCrewField(index,"qty_max",e.target.value)}
                                    />
                                </td>

                                <td>
                                    {hasTask("enquiry-tab-ops-review", "remove_crew_role") && (
                                        <button
                                            className="ops-row-remove"
                                            onClick={()=>removeCrewRow(index)}
                                            type="button"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            {hasTask("enquiry-tab-ops-review", "add_crew_role") && (

                <button

                    type="button"

                    className="survey-action-button survey-create-button"

                    onClick={addCrewRow}

                    style={{marginTop:8}}

                >

                    + Add Role

                </button>

            )}

            <h4 className="ops-subheading">Accessories Needed</h4>

            {

                accessoriesPlan.length===0
                    ? <p className="survey-empty">No accessories on file for this machine.</p>
                    : (

                        <table className="ops-plan-table">

                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Needed?</th>
                                </tr>
                            </thead>

                            <tbody>

                                {

                                    accessoriesPlan.map((row,index)=>(

                                        <tr key={row.name}>

                                            <td>{row.name}</td>

                                            <td>

                                                <select

                                                    value={row.needed}

                                                    onChange={e=>toggleAccessory(index,e.target.value)}

                                                >

                                                    <option>Yes</option>
                                                    <option>No</option>

                                                </select>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    )

            }

            <h4 className="ops-subheading">Dewatering Method Range</h4>

            <div className="ops-days-grid" style={{gridTemplateColumns:"1fr 1fr"}}>

                <label>
                    Min-cost candidate
                    <select value={dewMin} onChange={e=>setDewMin(e.target.value)}>
                        <option value="">-</option>
                        {dewateringMethods.map(m=>
                            <option key={m.method_key} value={m.method_key}>{m.method_name}</option>
                        )}
                    </select>
                </label>

                <label>
                    Max-cost candidate
                    <select value={dewMax} onChange={e=>setDewMax(e.target.value)}>
                        <option value="">-</option>
                        {dewateringMethods.map(m=>
                            <option key={m.method_key} value={m.method_key}>{m.method_name}</option>
                        )}
                    </select>
                </label>

            </div>



            {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

            {hasTask("enquiry-tab-ops-review", "save_deployment_plan_generate_quote") && (

                <button

                    className="survey-action-button"

                    onClick={handleSaveAndGenerateQuote}

                    disabled={saving}

                    style={{marginTop:12}}

                >

                    {saving ? "Saving..." : "Save Deployment Plan & Generate Quote"}

                </button>

            )}

        </div>

    );

}
