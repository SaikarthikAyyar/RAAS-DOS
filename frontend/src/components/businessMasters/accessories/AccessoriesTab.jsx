import { useState, useEffect, useCallback } from "react";

import {

    getAccessories,
    createAccessory,
    updateAccessory,
    deleteAccessory

} from "../../../services/accessoriesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// ADD / EDIT MODAL
// ====================================

function AccessoryModal({ editing, onClose, onSave }){

    const [name, setName] = useState(editing?.name || "");

    const [unit, setUnit] = useState(editing?.unit || "per job");

    const [rate, setRate] = useState(editing?.rate ?? "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!name.trim() || rate===""){

            setError("Name and rate are required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                name: name.trim(),
                unit: unit.trim() || "per job",
                rate: Number(rate)

            });

        }

        catch(err){

            setError(err?.detail || "Unable to save accessory.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit accessory" : "New accessory"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Name</label>

                        <input

                            value={name}

                            onChange={e=>setName(e.target.value)}

                            disabled={!!editing}

                        />

                    </div>

                    <div>

                        <label>Unit</label>

                        <input

                            value={unit}

                            onChange={e=>setUnit(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Rate (₹)</label>

                        <input

                            type="number"

                            value={rate}

                            onChange={e=>setRate(e.target.value)}

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

export default function AccessoriesTab(){

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

            const data = await getAccessories();

            setAccessories(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load accessories.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this accessory" : "Creating this accessory");

        if(remark===null){
            return;
        }

        if(editing){

            await updateAccessory(editing.id, {

                unit: payload.unit,
                rate: payload.rate,
                actor: buildActor(user),
                remark

            });

        }

        else{

            await createAccessory({ ...payload, actor:buildActor(user), remark });

        }

        setShowModal(false);

        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this accessory");

        if(remark===null){
            return;
        }

        try{

            await deleteAccessory(id, buildActor(user), remark);

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove accessory.");

        }

    }

    return(

        <div className="bm-card">

            <h3>

                Accessories

                {hasTask("bm-tab-accessories", "add_accessory") && (

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

                    <p className="bm-muted">Loading accessories...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : accessories.length===0 ? (

                    <p className="bm-muted">No accessories yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Unit</th>

                                <th>Rate (₹)</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                accessories.map(a=>(

                                    <tr key={a.id}>

                                        <td>{a.name}</td>

                                        <td>{a.unit}</td>

                                        <td>{Number(a.rate).toLocaleString()}</td>

                                        <td>

                                            {hasTask("bm-tab-accessories", "edit_accessory") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>{ setEditing(a); setShowModal(true); }}

                                                >

                                                    Edit

                                                </button>

                                            )}

                                            {" "}

                                            {hasTask("bm-tab-accessories", "remove_accessory") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>handleRemove(a.id)}

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

                    <AccessoryModal

                        editing={editing}

                        onClose={()=>{ setShowModal(false); setEditing(null); }}

                        onSave={handleSave}

                    />

                )

            }

            {remarkModal}

        </div>

    );

}
