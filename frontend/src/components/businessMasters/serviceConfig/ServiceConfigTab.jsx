import { useState, useEffect, useCallback } from "react";

import {

    getServiceConfigurations,
    createServiceConfiguration,
    updateServiceConfiguration,
    deleteServiceConfiguration

} from "../../../services/serviceConfigService";

import { getMachines } from "../../../services/machinesService";
import { getAccessories } from "../../../services/accessoriesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// SIMPLE CHECKBOX LIST
// Shared shape for the two multi-selects below - same convention
// already used for Fleet Unit crew/machine-bundle pickers.
// ====================================

function CheckboxList({ options, selected, onChange, emptyText, format }){

    function toggle(id){

        if(selected.includes(id)){
            onChange(selected.filter(v=>v!==id));
        }
        else{
            onChange([...selected, id]);
        }

    }

    return(

        <div className="bm-checkbox-list">

            {
                options.length===0 ? (
                    <span className="bm-muted">{emptyText}</span>
                ) : options.map(opt=>(

                    <label key={opt.id}>

                        <input
                            type="checkbox"
                            checked={selected.includes(opt.id)}
                            onChange={()=>toggle(opt.id)}
                        />

                        {format(opt)}

                    </label>

                ))
            }

        </div>

    );

}


// ====================================
// ADD / EDIT MODAL
// ====================================

function ServiceConfigModal({ editing, machines, accessories, onClose, onSave }){

    const [code, setCode] = useState(editing?.code || "");

    const [name, setName] = useState(editing?.name || "");

    const [ratePerDay, setRatePerDay] = useState(editing?.rate_per_day ?? "");

    const [machineIds, setMachineIds] = useState(editing?.machines?.map(m=>m.id) || []);
    const [accessoryIds, setAccessoryIds] = useState(editing?.accessories?.map(a=>a.id) || []);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!code.trim() || !name.trim() || ratePerDay===""){

            setError("Code, name and rate per day are required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                code: code.trim(),
                name: name.trim(),
                rate_per_day: Number(ratePerDay),
                machine_ids: machineIds,
                accessory_ids: accessoryIds

            });

        }

        catch(err){

            setError(formatApiError(err, "Unable to save service configuration."));

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit service configuration" : "New service configuration"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Code</label>

                        <input

                            value={code}

                            onChange={e=>setCode(e.target.value)}

                            disabled={!!editing}

                        />

                    </div>

                    <div>

                        <label>Name</label>

                        <input

                            value={name}

                            onChange={e=>setName(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Rate per day (₹)</label>

                        <input

                            type="number"

                            value={ratePerDay}

                            onChange={e=>setRatePerDay(e.target.value)}

                        />

                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Machines under this configuration</label>
                        <CheckboxList
                            options={machines}
                            selected={machineIds}
                            onChange={setMachineIds}
                            emptyText="No machines in Machine Specs yet."
                            format={m=>`${m.code} - ${m.name}${m.active ? "" : " (inactive)"}`}
                        />
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Accessories under this configuration</label>
                        <CheckboxList
                            options={accessories}
                            selected={accessoryIds}
                            onChange={setAccessoryIds}
                            emptyText="No accessories in the Accessories master yet."
                            format={a=>a.name}
                        />
                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className="bm-btn bm-btn-primary"

                        onClick={handleSubmit}

                        disabled={saving}

                    >

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

export default function ServiceConfigTab(){

    const [configs, setConfigs] = useState([]);
    const [machines, setMachines] = useState([]);
    const [accessories, setAccessories] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editing, setEditing] = useState(null);

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getServiceConfigurations();

            setConfigs(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load service configurations.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    useEffect(()=>{

        getMachines().then(setMachines).catch(err=>console.error(err));
        getAccessories().then(setAccessories).catch(err=>console.error(err));

    }, []);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this service configuration" : "Creating this service configuration");

        if(remark===null){
            return;
        }

        if(editing){

            await updateServiceConfiguration(editing.id, {

                name: payload.name,
                rate_per_day: payload.rate_per_day,
                machine_ids: payload.machine_ids,
                accessory_ids: payload.accessory_ids,
                actor: buildActor(user),
                remark

            });

        }

        else{

            await createServiceConfiguration({ ...payload, actor:buildActor(user), remark });

        }

        setShowModal(false);

        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this service configuration");

        if(remark===null){
            return;
        }

        try{

            await deleteServiceConfiguration(id, buildActor(user), remark);

            load();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove service configuration."));

        }

    }

    return(

        <div className="bm-card">

            <h3>

                Service configurations

                {hasTask("bm-tab-serviceconfig", "add_service_config") && (

                    <button

                        className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                        onClick={()=>{ setEditing(null); setShowModal(true); }}

                    >

                        + Add

                    </button>

                )}

            </h3>

            {

                loading ? (

                    <p className="bm-muted">Loading service configurations...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : configs.length===0 ? (

                    <p className="bm-muted">No service configurations yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Code</th>

                                <th>Name</th>

                                <th>Rate per day (₹)</th>

                                <th>Machines</th>

                                <th>Accessories</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                configs.map(c=>(

                                    <tr key={c.id}>

                                        <td>{c.code}</td>

                                        <td>{c.name}</td>

                                        <td>{Number(c.rate_per_day).toLocaleString()}</td>

                                        <td>
                                            {
                                                c.machines?.length
                                                    ? c.machines.map(m=>m.code).join(", ")
                                                    : "—"
                                            }
                                        </td>

                                        <td>
                                            {
                                                c.accessories?.length
                                                    ? c.accessories.map(a=>a.id ? `${a.name} (#${a.id})` : a.name).join(", ")
                                                    : "—"
                                            }
                                        </td>

                                        <td>

                                            {hasTask("bm-tab-serviceconfig", "edit_service_config") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>{ setEditing(c); setShowModal(true); }}

                                                >

                                                    Edit

                                                </button>

                                            )}

                                            {" "}

                                            {hasTask("bm-tab-serviceconfig", "remove_service_config") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>handleRemove(c.id)}

                                                >

                                                    Remove

                                                </button>

                                            )}

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

                    <ServiceConfigModal

                        editing={editing}

                        machines={machines}

                        accessories={accessories}

                        onClose={()=>{ setShowModal(false); setEditing(null); }}

                        onSave={handleSave}

                    />

                )

            }

            {remarkModal}

        </div>

    );

}
