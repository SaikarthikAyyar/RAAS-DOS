import { useState, useEffect, useCallback } from "react";

import {
    getFleetUnits,
    getAvailableMachines,
    createFleetUnit,
    updateFleetUnit,
    deleteFleetUnit
} from "../../../services/fleetUnitsService";

import { getHubs } from "../../../services/hubsService";
import { getPersonnel } from "../../../services/personnelService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// CREW MULTI-SELECT
// Same checkbox-list pattern already used for Hub approvers
// (HubsTab.jsx) and Machine's compatible-pump list.
// ====================================

function CrewCheckboxList({ options, selected, onChange }){

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
                    <span className="bm-muted">No personnel available yet.</span>
                ) : options.map(opt=>(

                    <label key={opt.id}>

                        <input
                            type="checkbox"
                            checked={selected.includes(opt.id)}
                            onChange={()=>toggle(opt.id)}
                        />

                        {opt.full_name} ({opt.designation})

                    </label>

                ))
            }

        </div>

    );

}


// ====================================
// ADD / EDIT MODAL
// ====================================

function FleetUnitModal({ editing, machines, hubs, allPersonnel, onClose, onSave }){

    const [fleetCode, setFleetCode] = useState(editing?.fleet_code || "");
    const [fleetName, setFleetName] = useState(editing?.fleet_name || "");
    const [machineId, setMachineId] = useState(editing?.machine_inventory_id || "");
    const [hubId, setHubId] = useState(editing?.hub_id || "");
    const [active, setActive] = useState(editing ? editing.active : true);
    const [crewIds, setCrewIds] = useState(editing?.crew?.map(c=>c.id) || []);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Convenience only - prefills "Home hub" from the picked machine's
    // own Machine Inventory hub, still fully editable (a Fleet Unit can
    // legitimately be assigned a different hub than its machine's own
    // home base). Same "picking one thing prefills another, doesn't
    // lock it" pattern already used for Machine Inventory's own
    // type -> name prefill.
    function handleMachineChange(value){

        setMachineId(value);

        if(!editing && value && !hubId){
            const machine = machines.find(m=>String(m.id)===String(value));
            if(machine?.hub_id){
                setHubId(machine.hub_id);
            }
        }

    }

    async function handleSubmit(){

        if(!fleetCode.trim() || !fleetName.trim()){
            setError("Fleet code and fleet name are required.");
            return;
        }

        if(!machineId){
            setError("Pick a machine for this fleet unit.");
            return;
        }

        setSaving(true);
        setError("");

        try{

            await onSave({
                fleet_code: fleetCode.trim(),
                fleet_name: fleetName.trim(),
                machine_inventory_id: Number(machineId),
                hub_id: hubId ? Number(hubId) : null,
                active,
                crew_personnel_ids: crewIds
            });

        }
        catch(err){
            setError(formatApiError(err, "Unable to save fleet unit."));
        }
        finally{
            setSaving(false);
        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit fleet unit" : "New fleet unit"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Fleet code</label>
                        <input
                            value={fleetCode}
                            onChange={e=>setFleetCode(e.target.value)}
                            disabled={!!editing}
                            placeholder="e.g. FU-028"
                        />
                    </div>

                    <div>
                        <label>Fleet name</label>
                        <input
                            value={fleetName}
                            onChange={e=>setFleetName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Machine</label>
                        <select value={machineId} onChange={e=>handleMachineChange(e.target.value)}>
                            <option value="">— Select a machine —</option>
                            {machines.map(m=>(
                                <option key={m.id} value={m.id}>
                                    {m.machine_code} - {m.machine_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Home hub</label>
                        <select value={hubId} onChange={e=>setHubId(e.target.value)}>
                            <option value="">— No hub —</option>
                            {hubs.map(h=>(
                                <option key={h.id} value={h.id}>{h.hub_name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={active}
                                onChange={e=>setActive(e.target.checked)}
                            />
                            {" "}Active
                        </label>
                    </div>

                    <div style={{gridColumn:"1 / -1"}}>
                        <label>Nominal crew (booking this unit books every one of them together)</label>
                        <CrewCheckboxList
                            options={allPersonnel}
                            selected={crewIds}
                            onChange={setCrewIds}
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

export default function FleetUnitsTab(){

    const [fleetUnits, setFleetUnits] = useState([]);
    const [machines, setMachines] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [allPersonnel, setAllPersonnel] = useState([]);

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
            const data = await getFleetUnits();
            setFleetUnits(data ?? []);
        }
        catch(err){
            console.error(err);
            setError("Unable to load fleet units.");
        }
        finally{
            setLoading(false);
        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    useEffect(()=>{

        getAvailableMachines().then(setMachines).catch(err=>console.error(err));
        getHubs().then(setHubs).catch(err=>console.error(err));
        getPersonnel().then(setAllPersonnel).catch(err=>console.error(err));

    }, []);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this fleet unit" : "Creating this fleet unit");

        if(remark===null){
            return;
        }

        if(editing){
            await updateFleetUnit(editing.id, { ...payload, actor:buildActor(user), remark });
        }
        else{
            await createFleetUnit({ ...payload, actor:buildActor(user), remark });
        }

        setShowModal(false);
        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this fleet unit");

        if(remark===null){
            return;
        }

        try{
            await deleteFleetUnit(id, buildActor(user), remark);
            load();
        }
        catch(err){
            alert(formatApiError(err, "Unable to remove fleet unit."));
        }

    }

    return(

        <div className="bm-card">

            <h3>

                Fleet Units

                {hasTask("bm-tab-fleetunits", "add_fleet_unit") && (

                    <button
                        className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"
                        onClick={()=>{ setEditing(null); setShowModal(true); }}
                    >
                        + Add
                    </button>

                )}

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
                Bundles a real machine with a nominal crew and a home hub into one reusable, bookable unit — booking a Fleet Unit for a job books its machine and every listed crew member together.
            </p>

            {
                loading ? (
                    <p className="bm-muted">Loading fleet units...</p>
                ) : error ? (
                    <p className="bm-muted">{error}</p>
                ) : fleetUnits.length===0 ? (
                    <p className="bm-muted">No fleet units yet — add the first one.</p>
                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Machine</th>
                                <th>Hub</th>
                                <th>Current Location</th>
                                <th>Crew</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {fleetUnits.map(f=>(

                                <tr key={f.id}>
                                    <td>{f.fleet_code}</td>
                                    <td>{f.fleet_name}</td>
                                    <td>{f.machine_code ? `${f.machine_code} - ${f.machine_name}` : "—"}</td>
                                    <td>{f.hub_name || "—"}</td>
                                    <td>{f.current_location || "—"}</td>
                                    <td>{f.crew?.length ? f.crew.map(c=>c.full_name).join(", ") : "—"}</td>
                                    <td>{f.active ? "Active" : "Inactive"}</td>
                                    <td>

                                        {hasTask("bm-tab-fleetunits", "edit_fleet_unit") && (
                                            <button
                                                className="bm-backlink"
                                                onClick={()=>{ setEditing(f); setShowModal(true); }}
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {" "}

                                        {hasTask("bm-tab-fleetunits", "remove_fleet_unit") && (
                                            <button
                                                className="bm-backlink"
                                                onClick={()=>handleRemove(f.id)}
                                            >
                                                Remove
                                            </button>
                                        )}

                                    </td>
                                </tr>

                            ))}

                        </tbody>

                    </table>

                )
            }

            {
                showModal && (
                    <FleetUnitModal
                        editing={editing}
                        machines={machines}
                        hubs={hubs}
                        allPersonnel={allPersonnel}
                        onClose={()=>{ setShowModal(false); setEditing(null); }}
                        onSave={handleSave}
                    />
                )
            }

            {remarkModal}

        </div>

    );

}
