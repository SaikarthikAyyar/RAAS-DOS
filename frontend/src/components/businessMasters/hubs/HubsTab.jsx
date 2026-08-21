import { useState, useEffect, useCallback } from "react";

import {
    getHubs,
    createHub,
    updateHub,
    deleteHub
} from "../../../services/hubsService";

import { getUsers } from "../../../services/administrationUsersService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import LookupSelect from "../../shared/LookupSelect";


// ====================================
// MULTI-SELECT CHECKBOX LIST
// Same pattern as MachinesTab.jsx's CheckboxList - a hub can have
// several real Ops Review owners and several Techno-Commercial
// approvers; being listed here IS that user's real approval standing
// for this hub, not just a display label.
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
                    <span className="bm-muted">No users available yet.</span>
                ) : options.map(opt=>(

                    <label key={opt.id}>

                        <input
                            type="checkbox"
                            checked={selected.includes(opt.id)}
                            onChange={()=>toggle(opt.id)}
                        />

                        {opt.name}

                    </label>

                ))
            }

        </div>

    );

}


// ====================================
// ADD / EDIT MODAL
// ====================================

function HubModal({ editing, allUsers, onClose, onSave }){

    const [hubName, setHubName] = useState(editing?.hub_name || "");

    const [region, setRegion] = useState(editing?.region || "");

    const [opsOwnerUserIds, setOpsOwnerUserIds] = useState(editing?.ops_owner_user_ids || []);

    const [quoteCommercialApproverUserIds, setQuoteCommercialApproverUserIds] = useState(editing?.quote_commercial_approver_user_ids || []);

    const [commercialApproverUserIds, setCommercialApproverUserIds] = useState(editing?.commercial_approver_user_ids || []);

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
                ops_owner_user_ids: opsOwnerUserIds,
                quote_commercial_approver_user_ids: quoteCommercialApproverUserIds,
                commercial_approver_user_ids: commercialApproverUserIds

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

                    <LookupSelect
                        listKey="customerRegion"
                        label="Region"
                        value={region}
                        section="hub"
                        field="region"
                        updateSection={(_s, _f, v)=>setRegion(v)}
                    />

                    <div style={{gridColumn:"1 / -1"}}>

                        <label>Ops owners (real approval standing for this hub)</label>

                        <CheckboxList
                            options={allUsers}
                            selected={opsOwnerUserIds}
                            onChange={setOpsOwnerUserIds}
                        />

                    </div>

                    <div style={{gridColumn:"1 / -1"}}>

                        <label>Quote &amp; Commercial approvers (real approval standing for this hub)</label>

                        <CheckboxList
                            options={allUsers}
                            selected={quoteCommercialApproverUserIds}
                            onChange={setQuoteCommercialApproverUserIds}
                        />

                    </div>

                    <div style={{gridColumn:"1 / -1"}}>

                        <label>Commercial Approval approvers (real approval standing for this hub)</label>

                        <CheckboxList
                            options={allUsers}
                            selected={commercialApproverUserIds}
                            onChange={setCommercialApproverUserIds}
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

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const [allUsers, setAllUsers] = useState([]);

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

    useEffect(()=>{

        getUsers()
            .then(setAllUsers)
            .catch(err=>console.error(err));

    }, []);

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

                {hasTask("bm-tab-hubs", "add_hub") && (

                    <button

                        className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                        onClick={()=>{ setEditing(null); setShowModal(true); }}

                    >

                        + Add

                    </button>

                )}

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
Who holds real Ops Review, Quote &amp; Commercial, and Commercial Approval standing for each hub - a hub can have several of each. Feeds the Hub and Owner columns on the Reviews &amp; Approvals module, and gates who can actually approve at each stage.
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

                                <th>Ops owners</th>

                                <th>Quote &amp; Commercial approvers</th>

                                <th>Commercial Approval approvers</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                hubs.map(h=>(

                                    <tr key={h.id}>

                                        <td>{h.hub_name}</td>

                                        <td>{h.region || "—"}</td>

                                        <td>{h.ops_owners?.length ? h.ops_owners.map(o=>o.name).join(", ") : "—"}</td>

                                        <td>{h.quote_commercial_approvers?.length ? h.quote_commercial_approvers.map(o=>o.name).join(", ") : "—"}</td>

                                        <td>{h.commercial_approvers?.length ? h.commercial_approvers.map(o=>o.name).join(", ") : "—"}</td>

                                        <td>

                                            {hasTask("bm-tab-hubs", "edit_hub") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>{ setEditing(h); setShowModal(true); }}

                                                >

                                                    Edit

                                                </button>

                                            )}

                                            {" "}

                                            {hasTask("bm-tab-hubs", "remove_hub") && (

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>handleRemove(h.id)}

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

                    <HubModal

                        editing={editing}

                        allUsers={allUsers}

                        onClose={()=>{ setShowModal(false); setEditing(null); }}

                        onSave={handleSave}

                    />

                )

            }

            {remarkModal}

        </div>

    );

}
