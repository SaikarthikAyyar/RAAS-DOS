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

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

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

// ====================================
// HAS-CHANGES DETECTION (Phase 27)
// The Save Deployment Plan & Generate Quote button should only be
// enabled when there's a real, unsaved change to the ops selection -
// from the Ops Selector module re-running, a Machine Override save,
// or an edit made right here in the Deployment Plan form (days/crew/
// accessories/dewatering range).
//
// Machine-derived fields (final machine, service configuration, pump
// package) are compared against the QUOTE's own persisted snapshot -
// not local state - because that snapshot is a real, independent
// signal of "what was actually used to generate the currently-existing
// quote," set once at generation time and never silently rewritten by
// an override save or an Ops Selector re-run. Comparing against local
// state instead would break across a full remount (e.g. navigating to
// /ops-selector and back), where local state and any local baseline
// would reset together and wrongly look unchanged.
//
// Deployment-plan-proper fields (days/crew/accessories/dewatering)
// have no equivalent on the Quote row, so they're compared directly
// against the OpsSelection's own persisted values instead - correct
// because saveDeploymentPlan and saveQuote below are always called
// together in one action, so "differs from what's on OpsSelection"
// and "differs from what's on the Quote" agree for these fields.
// ====================================

function normalizeCrewPlan(plan){

    return (plan ?? []).map(row=>({

        role: row.role || "",
        qty_min: Number(row.qty_min) || 0,
        qty_max: Number(row.qty_max) || 0

    }));

}

function normalizeAccessoriesPlan(plan){

    return (plan ?? []).map(row=>({ name: row.name, needed: row.needed }));

}

function computeHasChanges({

    quote,
    opsSelection,
    finalMachine,
    opsScoring,
    mobDays,
    setupDays,
    execDays,
    demobDays,
    crewPlan,
    accessoriesPlan,
    dewMin,
    dewMax

}){

    // No quote yet at all - the very first save is always a real,
    // meaningful action (there's nothing to compare against).
    if(!quote?.id){
        return true;
    }

    if(finalMachine !== quote.recommended_machine){
        return true;
    }

    if((opsSelection.service_configuration ?? null) !== (quote.service_configuration ?? null)){
        return true;
    }

    if((opsSelection.pump_hose_package ?? null) !== (quote.pump_hose_package ?? null)){
        return true;
    }

    if((Number(mobDays) || 0) !== (opsSelection.mobilisation_days ?? 0)){
        return true;
    }

    if((Number(setupDays) || 0) !== (opsSelection.setup_days ?? 0)){
        return true;
    }

    if((Number(execDays) || 0) !== (opsSelection.execution_days ?? 0)){
        return true;
    }

    if((Number(demobDays) || 0) !== (opsSelection.demob_days ?? 0)){
        return true;
    }

    const savedCrewPlan = opsSelection.crew_plan?.length
        ? opsSelection.crew_plan
        : defaultCrewPlan(opsSelection.manpower_required);

    if(JSON.stringify(normalizeCrewPlan(crewPlan)) !== JSON.stringify(normalizeCrewPlan(savedCrewPlan))){
        return true;
    }

    const savedAccessoriesPlan = opsSelection.accessories_plan?.length
        ? opsSelection.accessories_plan
        : defaultAccessoriesPlan(finalMachine, opsScoring);

    if(JSON.stringify(normalizeAccessoriesPlan(accessoriesPlan)) !== JSON.stringify(normalizeAccessoriesPlan(savedAccessoriesPlan))){
        return true;
    }

    if((dewMin || null) !== (opsSelection.dewatering_method_min ?? null)){
        return true;
    }

    if((dewMax || null) !== (opsSelection.dewatering_method_max ?? null)){
        return true;
    }

    return false;

}

export default function DeploymentPlanCard({

    enquiry,

    opsSelection,

    opsScoring = [],

    finalMachine,

    quote,

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

    // Save Deployment Plan & Generate Quote is only enabled when there's
    // a real, unsaved change - from the Ops Selector re-running, a
    // Machine Override save, or an edit made in this form. Recomputed
    // every render (cheap - a handful of scalar/array comparisons), so
    // it reflects both local edits and freshly-reloaded props.
    const hasChanges = computeHasChanges({

        quote,
        opsSelection,
        finalMachine,
        opsScoring,
        mobDays,
        setupDays,
        execDays,
        demobDays,
        crewPlan,
        accessoriesPlan,
        dewMin,
        dewMax

    });

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

        <div className="survey-summary-card ops-deployment-card" data-guide-id="ops-review-deployment-plan" style={{position:"relative"}}>

            <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-deployment-plan" floating/>

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

                                <td data-guide-id="ops-review-remove-crew-role">
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

                <span data-guide-id="ops-review-add-crew-role" style={{display:"inline-flex", alignItems:"center", marginTop:8}}>

                <button

                    type="button"

                    className="survey-action-button survey-create-button"

                    onClick={addCrewRow}

                >

                    + Add Role

                </button>

                <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-add-crew-role"/>

                </span>

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

                <span data-guide-id="ops-review-save-plan" style={{display:"inline-flex", alignItems:"center", marginTop:12}}>

                <button

                    className="survey-action-button"

                    onClick={handleSaveAndGenerateQuote}

                    disabled={saving || !hasChanges}

                    title={!hasChanges ? "No changes to save - edit the machine, crew, accessories, or dewatering range first." : undefined}

                >

                    {saving ? "Saving..." : "Save Deployment Plan & Generate Quote"}

                </button>

                <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-save-plan"/>

                </span>

            )}

        </div>

    );

}
