import { useState, useEffect, useCallback } from "react";

import {

    getHrRoles,
    createHrRole,
    updateHrRole,
    deleteHrRole

} from "../../../services/hrRolesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// ADD / EDIT MODAL
// ====================================

function HrRoleModal({ editing, onClose, onSave }){

    const [role, setRole] = useState(editing?.role || "");

    const [dayRate, setDayRate] = useState(editing?.day_rate ?? "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!role.trim() || dayRate===""){

            setError("Role and day rate are required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                role: role.trim(),
                day_rate: Number(dayRate)

            });

        }

        catch(err){

            setError(err?.detail || "Unable to save HR role.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit HR role" : "New HR role"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Role</label>

                        <input

                            value={role}

                            onChange={e=>setRole(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Day rate (₹)</label>

                        <input

                            type="number"

                            value={dayRate}

                            onChange={e=>setDayRate(e.target.value)}

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

export default function HumanResourcesTab(){

    const [roles, setRoles] = useState([]);

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

            const data = await getHrRoles();

            setRoles(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load HR roles.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this HR role" : "Adding this HR role");

        if(remark===null){
            return;
        }

        if(editing){

            await updateHrRole(editing.id, { ...payload, actor:buildActor(user), remark });

        }

        else{

            await createHrRole({ ...payload, actor:buildActor(user), remark });

        }

        setShowModal(false);

        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this HR role");

        if(remark===null){
            return;
        }

        try{

            await deleteHrRole(id, buildActor(user), remark);

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove HR role.");

        }

    }

    return(

        <div className="bm-card">

            <h3>

                Human resources — day rates

                {hasTask("bm-tab-hr", "add_hr_role") && (

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

                    <p className="bm-muted">Loading HR roles...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : roles.length===0 ? (

                    <p className="bm-muted">No HR roles yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Role</th>

                                <th>Day rate (₹)</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                roles.map(r=>(

                                    <tr key={r.id}>

                                        <td>{r.role}</td>

                                        <td>{Number(r.day_rate).toLocaleString()}</td>

                                        <td>

                                            {hasTask("bm-tab-hr", "edit_hr_role") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>{ setEditing(r); setShowModal(true); }}

                                                >

                                                    Edit

                                                </button>

                                            )}

                                            {" "}

                                            {hasTask("bm-tab-hr", "remove_hr_role") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>handleRemove(r.id)}

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

                    <HrRoleModal

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
