import { useState, useEffect, useCallback } from "react";

import {
    getMachines,
    createMachine,
    updateMachine,
    deleteMachine
} from "../../../services/machinesService";

import { getPumps } from "../../../services/pumpsService";
import { getServiceConfigurations } from "../../../services/serviceConfigService";
import { getAccessories } from "../../../services/accessoriesService";
import { getHubs } from "../../../services/hubsService";

import { useLookupLists } from "../../../context/LookupListsContext";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


const DEBRIS_OPTIONS = ["None", "Minor", "Moderate", "Heavy"];


// ====================================
// ERROR FORMATTING
// FastAPI's automatic 422 validation errors put an ARRAY of
// {type, loc, msg, ...} objects in `detail`, not a string - rendering
// that directly as JSX crashes React ("Objects are not valid as a
// React child"). This normalizes any shape into a safe string.
// ====================================

function formatApiError(err){

    const detail = err?.detail;

    if(typeof detail === "string") return detail;

    if(Array.isArray(detail)){
        return detail.map(d=>d?.msg || JSON.stringify(d)).join("; ");
    }

    return "Unable to save machine.";

}


// ====================================
// MULTI-SELECT CHECKBOX LIST
// ====================================

function CheckboxList({ options, selected, onChange }){

    function toggle(value){

        if(selected.includes(value)){
            onChange(selected.filter(v=>v!==value));
        }
        else{
            onChange([...selected, value]);
        }

    }

    return(

        <div className="bm-checkbox-list">

            {
                options.length===0 ? (
                    <span className="bm-muted">Nothing available yet.</span>
                ) : options.map(opt=>(

                    <label key={opt.value ?? opt}>

                        <input
                            type="checkbox"
                            checked={selected.includes(opt.value ?? opt)}
                            onChange={()=>toggle(opt.value ?? opt)}
                        />

                        {opt.label ?? opt}

                    </label>

                ))
            }

        </div>

    );

}


// ====================================
// ADD / EDIT MODAL
// ====================================

function MachineModal({ editing, pumps, serviceConfigs, accessoriesMaster, hubs, onClose, onSave }){

    const { getOptions } = useLookupLists();

    const jobTypeOptions = getOptions("jobType");
    const materialOptions = getOptions("materialCategory");

    const [code, setCode] = useState(editing?.code || "");
    const [name, setName] = useState(editing?.name || "");
    const [serviceConfiguration, setServiceConfiguration] = useState(editing?.service_configuration || "");
    const [powerType, setPowerType] = useState(editing?.power_type || "");
    const [active, setActive] = useState(editing ? editing.active : true);

    const [minimumWidth, setMinimumWidth] = useState(editing?.minimum_width ?? "");
    const [minimumHeight, setMinimumHeight] = useState(editing?.minimum_height ?? "");
    const [baseOutputPerDay, setBaseOutputPerDay] = useState(editing?.base_output_per_day ?? "");
    const [baseOutputBasis, setBaseOutputBasis] = useState(editing?.base_output_basis || "");
    const [recommendedMaxVolume, setRecommendedMaxVolume] = useState(editing?.recommended_max_volume ?? "");
    const [crew, setCrew] = useState(editing?.crew ?? "");
    const [setupComplexity, setSetupComplexity] = useState(editing?.setup_complexity || "");
    const [approvalGate, setApprovalGate] = useState(editing?.approval_gate || "");

    const [pumpPackage, setPumpPackage] = useState(editing?.pump_package || "");
    const [hoseSize, setHoseSize] = useState(editing?.hose_size || "");
    const [compatiblePumpIds, setCompatiblePumpIds] = useState(
        editing
            ? pumps.filter(p=>editing.compatible_pump_codes?.includes(p.code)).map(p=>p.id)
            : []
    );

    const [preferredJobTypes, setPreferredJobTypes] = useState(editing?.preferred_job_types || []);
    const [preferredMaterials, setPreferredMaterials] = useState(editing?.preferred_materials || []);
    const [debrisTolerance, setDebrisTolerance] = useState(editing?.debris_tolerance || "");

    const [accessories, setAccessories] = useState(editing?.accessories || []);

    const [rate, setRate] = useState(editing?.rate ?? "");
    const [materialConstruction, setMaterialConstruction] = useState(editing?.material_construction || "");
    const [maxOperatingTemp, setMaxOperatingTemp] = useState(editing?.max_operating_temp ?? "");
    const [hazardRating, setHazardRating] = useState(editing?.hazard_rating || "");
    const [maxVerticalLift, setMaxVerticalLift] = useState(editing?.max_vertical_lift ?? "");
    const [craneRequired, setCraneRequired] = useState(editing?.crane_required || "No");
    const [vehicle, setVehicle] = useState(editing?.vehicle || "");
    const [vehiclePayload, setVehiclePayload] = useState(editing?.vehicle_payload || "");
    const [dims, setDims] = useState(editing?.dims || "");
    const [weight, setWeight] = useState(editing?.weight || "");

    const [hubsAvailable, setHubsAvailable] = useState(editing?.hubs_available || []);

    const [description, setDescription] = useState(editing?.description || "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function numOrNull(v){
        if(v==="" || v===null || v===undefined) return null;
        const n = Number(v);
        return Number.isNaN(n) ? null : n;
    }

    async function handleSubmit(){

        if(!code.trim() || !name.trim()){
            setError("Code and name are required.");
            return;
        }

        setSaving(true);
        setError("");

        try{

            await onSave({
                code: code.trim(),
                name: name.trim(),
                service_configuration: serviceConfiguration || null,
                power_type: powerType.trim() || null,
                active,
                minimum_width: numOrNull(minimumWidth),
                minimum_height: numOrNull(minimumHeight),
                base_output_per_day: numOrNull(baseOutputPerDay),
                base_output_basis: baseOutputBasis.trim() || null,
                recommended_max_volume: numOrNull(recommendedMaxVolume),
                crew: numOrNull(crew),
                setup_complexity: setupComplexity.trim() || null,
                approval_gate: approvalGate.trim() || null,
                pump_package: pumpPackage.trim() || null,
                hose_size: hoseSize.trim() || null,
                compatible_pump_ids: compatiblePumpIds,
                preferred_job_types: preferredJobTypes,
                preferred_materials: preferredMaterials,
                debris_tolerance: debrisTolerance || null,
                accessories,
                rate: numOrNull(rate),
                material_construction: materialConstruction.trim() || null,
                max_operating_temp: numOrNull(maxOperatingTemp),
                hazard_rating: hazardRating.trim() || null,
                max_vertical_lift: numOrNull(maxVerticalLift),
                crane_required: craneRequired,
                vehicle: vehicle.trim() || null,
                vehicle_payload: vehiclePayload.trim() || null,
                dims: dims.trim() || null,
                weight: weight.trim() || null,
                hubs_available: hubsAvailable,
                description: description.trim() || null
            });

        }

        catch(err){
            setError(formatApiError(err));
        }

        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box bm-modal-box-wide" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit machine" : "New machine"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <h4>Basic</h4>

                    <div>
                        <label>Code</label>
                        <input value={code} onChange={e=>setCode(e.target.value)} disabled={!!editing} />
                    </div>

                    <div>
                        <label>Name</label>
                        <input value={name} onChange={e=>setName(e.target.value)} />
                    </div>

                    <div>
                        <label>Service configuration</label>
                        <select value={serviceConfiguration} onChange={e=>setServiceConfiguration(e.target.value)}>
                            <option value="">—</option>
                            {serviceConfigs.map(sc=>(
                                <option key={sc.code} value={sc.code}>{sc.code} - {sc.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Power type</label>
                        <input value={powerType} onChange={e=>setPowerType(e.target.value)} />
                    </div>

                    <div>
                        <label>Active</label>
                        <select value={active ? "yes" : "no"} onChange={e=>setActive(e.target.value==="yes")}>
                            <option value="yes">Active</option>
                            <option value="no">Inactive</option>
                        </select>
                    </div>

                    <h4>Access &amp; Capacity</h4>

                    <div>
                        <label>Minimum width (mm)</label>
                        <input type="number" value={minimumWidth} onChange={e=>setMinimumWidth(e.target.value)} />
                    </div>

                    <div>
                        <label>Minimum height (mm)</label>
                        <input type="number" value={minimumHeight} onChange={e=>setMinimumHeight(e.target.value)} />
                    </div>

                    <div>
                        <label>Base output per day</label>
                        <input type="number" value={baseOutputPerDay} onChange={e=>setBaseOutputPerDay(e.target.value)} />
                    </div>

                    <div>
                        <label>Base output basis</label>
                        <input value={baseOutputBasis} onChange={e=>setBaseOutputBasis(e.target.value)} />
                    </div>

                    <div>
                        <label>Recommended max volume (m3)</label>
                        <input type="number" value={recommendedMaxVolume} onChange={e=>setRecommendedMaxVolume(e.target.value)} />
                    </div>

                    <div>
                        <label>Crew size</label>
                        <input type="number" value={crew} onChange={e=>setCrew(e.target.value)} />
                    </div>

                    <div>
                        <label>Setup complexity</label>
                        <select value={setupComplexity} onChange={e=>setSetupComplexity(e.target.value)}>
                            <option value="">—</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label>Approval gate</label>
                        <input value={approvalGate} onChange={e=>setApprovalGate(e.target.value)} />
                    </div>

                    <h4>Pump &amp; Hose</h4>

                    <div>
                        <label>Pump package (description)</label>
                        <input value={pumpPackage} onChange={e=>setPumpPackage(e.target.value)} />
                    </div>

                    <div>
                        <label>Hose size</label>
                        <input value={hoseSize} onChange={e=>setHoseSize(e.target.value)} />
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Compatible pumps (Pump Master)</label>
                        <CheckboxList
                            options={pumps.map(p=>({ value:p.id, label:`${p.code} - ${p.name}` }))}
                            selected={compatiblePumpIds}
                            onChange={setCompatiblePumpIds}
                        />
                    </div>

                    <h4>Preferred Fit</h4>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Preferred job types</label>
                        <CheckboxList options={jobTypeOptions} selected={preferredJobTypes} onChange={setPreferredJobTypes} />
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Preferred materials</label>
                        <CheckboxList options={materialOptions} selected={preferredMaterials} onChange={setPreferredMaterials} />
                    </div>

                    <div>
                        <label>Debris tolerance</label>
                        <select value={debrisTolerance} onChange={e=>setDebrisTolerance(e.target.value)}>
                            <option value="">—</option>
                            {DEBRIS_OPTIONS.map(d=><option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Accessories (default checklist on Deployment Plan)</label>
                        <CheckboxList
                            options={accessoriesMaster.map(a=>a.name)}
                            selected={accessories}
                            onChange={setAccessories}
                        />
                    </div>

                    <h4>Spec</h4>

                    <div>
                        <label>Rate (per day)</label>
                        <input type="number" value={rate} onChange={e=>setRate(e.target.value)} />
                    </div>

                    <div>
                        <label>Material construction</label>
                        <input value={materialConstruction} onChange={e=>setMaterialConstruction(e.target.value)} />
                    </div>

                    <div>
                        <label>Max operating temp (°C)</label>
                        <input type="number" value={maxOperatingTemp} onChange={e=>setMaxOperatingTemp(e.target.value)} />
                    </div>

                    <div>
                        <label>Hazard rating</label>
                        <input value={hazardRating} onChange={e=>setHazardRating(e.target.value)} placeholder="e.g. Standard, ATEX Zone 2" />
                    </div>

                    <div>
                        <label>Max vertical lift (m)</label>
                        <input type="number" value={maxVerticalLift} onChange={e=>setMaxVerticalLift(e.target.value)} />
                    </div>

                    <div>
                        <label>Crane required</label>
                        <select value={craneRequired} onChange={e=>setCraneRequired(e.target.value)}>
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>

                    <div>
                        <label>Vehicle</label>
                        <input value={vehicle} onChange={e=>setVehicle(e.target.value)} />
                    </div>

                    <div>
                        <label>Vehicle payload</label>
                        <input value={vehiclePayload} onChange={e=>setVehiclePayload(e.target.value)} />
                    </div>

                    <div>
                        <label>Dimensions</label>
                        <input value={dims} onChange={e=>setDims(e.target.value)} />
                    </div>

                    <div>
                        <label>Weight</label>
                        <input value={weight} onChange={e=>setWeight(e.target.value)} />
                    </div>

                    <h4>Hubs &amp; Description</h4>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Available at hubs</label>
                        <CheckboxList
                            options={hubs.map(h=>h.hub_name)}
                            selected={hubsAvailable}
                            onChange={setHubsAvailable}
                        />
                    </div>

                    <div className="bm-formgrid single" style={{gridColumn:"1 / -1"}}>
                        <div>
                            <label>Description</label>
                            <textarea value={description} onChange={e=>setDescription(e.target.value)} />
                        </div>
                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleSubmit} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );

}


// ====================================
// TAB
// ====================================

export default function MachinesTab(){

    const [machines, setMachines] = useState([]);
    const [pumps, setPumps] = useState([]);
    const [serviceConfigs, setServiceConfigs] = useState([]);
    const [accessoriesMaster, setAccessoriesMaster] = useState([]);
    const [hubs, setHubs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const { user } = useAuth();
    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const load = useCallback(async()=>{

        setLoading(true);
        setError("");

        try{

            const [machinesData, pumpsData, configsData, accData, hubsData] = await Promise.all([
                getMachines(),
                getPumps(),
                getServiceConfigurations(),
                getAccessories(),
                getHubs()
            ]);

            setMachines(machinesData ?? []);
            setPumps(pumpsData ?? []);
            setServiceConfigs(configsData ?? []);
            setAccessoriesMaster(accData ?? []);
            setHubs(hubsData ?? []);

        }

        catch(err){
            console.error(err);
            setError("Unable to load machines.");
        }

        finally{
            setLoading(false);
        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this machine" : "Creating this machine");

        if(remark===null){
            return;
        }

        if(editing){
            await updateMachine(editing.id, { ...payload, actor:buildActor(user), remark });
        }
        else{
            await createMachine({ ...payload, actor:buildActor(user), remark });
        }

        setShowModal(false);
        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this machine");

        if(remark===null){
            return;
        }

        try{
            await deleteMachine(id, buildActor(user), remark);
            load();
        }
        catch(err){
            alert(formatApiError(err));
        }

    }

    return(

        <div className="bm-card">

            <h3>

                Machines / Fleet

                <button
                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"
                    onClick={()=>{ setEditing(null); setShowModal(true); }}
                >
                    + Add
                </button>

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
                The type/spec catalog the Ops Engine scores against when recommending a machine — distinct from real fleet units tracked in Allocation.
            </p>

            {

                loading ? (

                    <p className="bm-muted">Loading machines...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : machines.length===0 ? (

                    <p className="bm-muted">No machines yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Service Config</th>
                                <th>Rate</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {

                                machines.map(m=>(

                                    <tr key={m.id}>

                                        <td>{m.code}</td>
                                        <td>{m.name}</td>
                                        <td>{m.service_configuration || "—"}</td>
                                        <td>{m.rate!=null ? `Rs ${Number(m.rate).toLocaleString()}` : "—"}</td>
                                        <td>
                                            <span className={`bm-pill ${m.active ? "bm-pill-green" : "bm-pill-red"}`}>
                                                {m.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className="bm-backlink"
                                                onClick={()=>{ setEditing(m); setShowModal(true); }}
                                            >
                                                Edit
                                            </button>

                                            {" "}

                                            <button
                                                className="bm-backlink"
                                                onClick={()=>handleRemove(m.id)}
                                            >
                                                Remove
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

            {

                showModal && (

                    <MachineModal
                        editing={editing}
                        pumps={pumps}
                        serviceConfigs={serviceConfigs}
                        accessoriesMaster={accessoriesMaster}
                        hubs={hubs}
                        onClose={()=>{ setShowModal(false); setEditing(null); }}
                        onSave={handleSave}
                    />

                )

            }

            {remarkModal}

        </div>

    );

}
