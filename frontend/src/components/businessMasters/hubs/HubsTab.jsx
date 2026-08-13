import { useState, useEffect, useCallback } from "react";

import {
    getHubs,
    createHub,
    updateHub,
    deleteHub
} from "../../../services/hubsService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// ADD / EDIT MODAL
// ====================================

function HubModal({ editing, onClose, onSave }){

    const [hubName, setHubName] = useState(editing?.hub_name || "");

    const [region, setRegion] = useState(editing?.region || "");

    const [opsOwner, setOpsOwner] = useState(editing?.ops_owner || "");

    const [technoApprover, setTechnoApprover] = useState(editing?.techno_approver || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!hubName.trim()){

            setError("Hub name is required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                hub_name: hubName.trim(),
                region: region.trim() || null,
                ops_owner: opsOwner.trim() || null,
                techno_approver: technoApprover.trim() || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to save hub.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit hub" : "New hub"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Hub name</label>

                        <input

                            value={hubName}

                            onChange={e=>setHubName(e.target.value)}

                            disabled={!!editing}

                        />

                    </div>

                    <div>

                        <label>Region</label>

                        <input

                            value={region}

                            onChange={e=>setRegion(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Ops owner</label>

                        <input

                            value={opsOwner}

                            onChange={e=>setOpsOwner(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Techno-Commercial approver</label>

                        <input

                            value={technoApprover}

                            onChange={e=>setTechnoApprover(e.target.value)}

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

export default function HubsTab(){

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

            const data = await getHubs();

            setHubs(data ?? []);

        }

        catch(err){

            console.error(err);
            setError("Unable to load hubs.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this hub" : "Creating this hub");

        if(remark===null){
            return;
        }

        if(editing){

            await updateHub(editing.id, { ...payload, actor:buildActor(user), remark });

        }

        else{

            await createHub({ ...payload, actor:buildActor(user), remark });

        }

        setShowModal(false);
        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this hub");

        if(remark===null){
            return;
        }

        try{

            await deleteHub(id, buildActor(user), remark);

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove hub.");

        }

    }

    return(

        <div className="bm-card">

            <h3>

                Hubs

                <button

                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                    onClick={()=>{ setEditing(null); setShowModal(true); }}

                >

                    + Add

                </button>

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
                Who owns Ops Review and Techno-Commercial Approval for each hub - feeds the Hub and Owner columns on the Reviews &amp; Approvals module.
            </p>

            {

                loading ? (

                    <p className="bm-muted">Loading hubs...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : hubs.length===0 ? (

                    <p className="bm-muted">No hubs yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Hub</th>

                                <th>Region</th>

                                <th>Ops owner</th>

                                <th>Techno-Commercial approver</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                hubs.map(h=>(

                                    <tr key={h.id}>

                                        <td>{h.hub_name}</td>

                                        <td>{h.region || "—"}</td>

                                        <td>{h.ops_owner || "—"}</td>

                                        <td>{h.techno_approver || "—"}</td>

                                        <td>

                                            <button

                                                className="bm-backlink"

                                                onClick={()=>{ setEditing(h); setShowModal(true); }}

                                            >

                                                Edit

                                            </button>

                                            {" "}

                                            <button

                                                className="bm-backlink"

                                                onClick={()=>handleRemove(h.id)}

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

                    <HubModal

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
