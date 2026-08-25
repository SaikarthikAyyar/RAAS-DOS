import { useState, useEffect, useCallback } from "react";

import {
    getMachineInventory,
    getMachineTypes,
    createMachineInventory,
    updateMachineInventory,
    deleteMachineInventory
} from "../../../services/machineInventoryService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";


const STATUS_OPTIONS = ["AVAILABLE", "ALLOCATED", "MAINTENANCE", "RETIRED"];


// ====================================
// ADD / EDIT MODAL
// ====================================

function MachineInventoryModal({ editing, machineTypes, onClose, onSave }){

    const [machineTypeId, setMachineTypeId] = useState(editing?.machine_type_id || "");
    const [machineName, setMachineName] = useState(editing?.machine_name || "");
    const [machineCode, setMachineCode] = useState(editing?.machine_code || "");
    const [assetNumber, setAssetNumber] = useState(editing?.asset_number || "");
    const [status, setStatus] = useState(editing?.status || "AVAILABLE");
    const [currentSite, setCurrentSite] = useState(editing?.current_site || "WAREHOUSE");
    const [remarks, setRemarks] = useState(editing?.remarks || "");

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    function handleTypeChange(value){

        setMachineTypeId(value);

        // Convenience only - prefills the display name from the picked
        // type, still fully editable (a real asset's name can differ).
        if(!editing && value){
            const type = machineTypes.find(t=>String(t.id)===String(value));
            if(type && !machineName){
                setMachineName(type.name);
            }
        }

    }

    async function handleSubmit(){

        if(!machineName.trim() || !machineCode.trim() || !assetNumber.trim()){
            setError("Machine name, machine code, and asset number are all required.");
            return;
        }

        setSaving(true);
        setError("");

        try{

            await onSave({
                machine_type_id: machineTypeId ? Number(machineTypeId) : null,
                machine_name: machineName.trim(),
                machine_code: machineCode.trim(),
                asset_number: assetNumber.trim(),
                status,
                current_site: currentSite.trim() || null,
                remarks: remarks.trim() || null
            });

        }
        catch(err){
            setError(formatApiError(err, "Unable to save this machine unit."));
        }
        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit machine unit" : "New machine unit"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Machine type</label>
                        <select value={machineTypeId} onChange={e=>handleTypeChange(e.target.value)}>
                            <option value="">— Unassigned —</option>
                            {machineTypes.filter(t=>t.active).map(t=>(
                                <option key={t.id} value={t.id}>{t.code} - {t.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Status</label>
                        <select value={status} onChange={e=>setStatus(e.target.value)}>
                            {STATUS_OPTIONS.map(s=>(
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Machine name</label>
                        <input value={machineName} onChange={e=>setMachineName(e.target.value)}/>
                    </div>

                    <div>
                        <label>Machine code (unique)</label>
                        <input
                            value={machineCode}
                            onChange={e=>setMachineCode(e.target.value)}
                            placeholder="e.g. SCH-300-PBM-04"
                        />
                    </div>

                    <div>
                        <label>Asset number (unique)</label>
                        <input value={assetNumber} onChange={e=>setAssetNumber(e.target.value)}/>
                    </div>

                    <div>
                        <label>Current site</label>
                        <input value={currentSite} onChange={e=>setCurrentSite(e.target.value)}/>
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Remarks</label>
                        <input value={remarks} onChange={e=>setRemarks(e.target.value)}/>
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

export default function MachineInventoryTab(){

    const [inventory, setInventory] = useState([]);
    const [machineTypes, setMachineTypes] = useState([]);

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
            const [inv, types] = await Promise.all([getMachineInventory(), getMachineTypes()]);
            setInventory(inv ?? []);
            setMachineTypes(types ?? []);
        }
        catch(err){
            console.error(err);
            setError("Unable to load machine inventory.");
        }
        finally{
            setLoading(false);
        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this machine unit" : "Adding this machine unit");

        if(remark===null){
            return;
        }

        if(editing){
            await updateMachineInventory(editing.id, { ...payload, actor:buildActor(user), remark });
        }
        else{
            await createMachineInventory({ ...payload, actor:buildActor(user), remark });
        }

        setShowModal(false);
        setEditing(null);

        load();

    }

    async function handleRemove(row){

        const remark = await promptForRemark("Removing this machine unit");

        if(remark===null){
            return;
        }

        try{
            await deleteMachineInventory(row.id, buildActor(user), remark);
            load();
        }
        catch(err){
            alert(formatApiError(err, "Unable to remove this machine unit."));
        }

    }

    // Group inventory rows under their real machine type, matching the
    // Fleet Units dropdown's own grouping concept - an "Unassigned"
    // bucket holds any row without a clean type match (legacy data).
    const groups = [];
    const byType = new Map();

    for(const row of inventory){

        const key = row.machine_type_id || "unassigned";

        if(!byType.has(key)){

            const typeInfo = row.machine_type_id
                ? { id: row.machine_type_id, label: `${row.machine_type_code || ""} - ${row.machine_type_name || ""}`.trim() }
                : { id: "unassigned", label: "Unassigned type" };

            const group = { ...typeInfo, rows: [] };
            byType.set(key, group);
            groups.push(group);

        }

        byType.get(key).rows.push(row);

    }

    groups.sort((a,b)=> a.id==="unassigned" ? 1 : b.id==="unassigned" ? -1 : a.label.localeCompare(b.label));

    return(

        <div className="bm-card">

            <h3>

                Machine Inventory

                {hasTask("bm-tab-machineinventory", "add_machine_unit") && (

                    <button
                        className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"
                        onClick={()=>{ setEditing(null); setShowModal(true); }}
                    >
                        + Add
                    </button>

                )}

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
                Real physical stock, grouped by machine type - this is what the Fleet Units tab's "Machine" dropdown draws from directly.
            </p>

            {
                loading ? (
                    <p className="bm-muted">Loading machine inventory...</p>
                ) : error ? (
                    <p className="bm-muted">{error}</p>
                ) : inventory.length===0 ? (
                    <p className="bm-muted">No machine inventory yet — add the first unit.</p>
                ) : (

                    groups.map(group=>(

                        <div key={group.id} style={{marginBottom:18}}>

                            <h4 className="bm-muted" style={{marginBottom:6}}>{group.label}</h4>

                            <table>
                                <thead>
                                    <tr>
                                        <th>Machine code</th>
                                        <th>Machine name</th>
                                        <th>Asset number</th>
                                        <th>Status</th>
                                        <th>Current site</th>
                                        <th>Queue</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.rows.map(row=>(
                                        <tr key={row.id}>
                                            <td>{row.machine_code}</td>
                                            <td>{row.machine_name}</td>
                                            <td>{row.asset_number}</td>
                                            <td>{row.status || "-"}</td>
                                            <td>{row.current_site || "-"}</td>
                                            <td>{row.queue_count ?? 0}</td>
                                            <td>

                                                {hasTask("bm-tab-machineinventory", "edit_machine_unit") && (
                                                    <button
                                                        className="bm-backlink"
                                                        onClick={()=>{ setEditing(row); setShowModal(true); }}
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                                {" "}

                                                {hasTask("bm-tab-machineinventory", "remove_machine_unit") && (
                                                    <button
                                                        className="bm-backlink"
                                                        onClick={()=>handleRemove(row)}
                                                    >
                                                        Remove
                                                    </button>
                                                )}

                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>

                    ))

                )
            }

            {
                showModal && (
                    <MachineInventoryModal
                        editing={editing}
                        machineTypes={machineTypes}
                        onClose={()=>{ setShowModal(false); setEditing(null); }}
                        onSave={handleSave}
                    />
                )
            }

            {remarkModal}

        </div>

    );

}
