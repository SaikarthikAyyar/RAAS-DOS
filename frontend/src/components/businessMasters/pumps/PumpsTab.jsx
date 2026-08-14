import { useState, useEffect, useCallback } from "react";

import {
    getPumps,
    createPump,
    updatePump,
    deletePump
} from "../../../services/pumpsService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


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

    return "Unable to save pump.";

}


// ====================================
// ADD / EDIT MODAL
// ====================================

function PumpModal({ editing, onClose, onSave }){

    const [code, setCode] = useState(editing?.code || "");
    const [name, setName] = useState(editing?.name || "");
    const [hp, setHp] = useState(editing?.hp ?? "");
    const [phase, setPhase] = useState(editing?.phase || "");
    const [voltage, setVoltage] = useState(editing?.voltage || "");
    const [peakCurrent, setPeakCurrent] = useState(editing?.peak_current || "");
    const [densityRange, setDensityRange] = useState(editing?.density_range || "");
    const [flowRate, setFlowRate] = useState(editing?.flow_rate ?? "");
    const [type, setType] = useState(editing?.type || "");
    const [maxSuctionLift, setMaxSuctionLift] = useState(editing?.max_suction_lift ?? "");
    const [maxDischargeHead, setMaxDischargeHead] = useState(editing?.max_discharge_head ?? "");
    const [maxSolidsSize, setMaxSolidsSize] = useState(editing?.max_solids_size ?? "");
    const [hazardRating, setHazardRating] = useState(editing?.hazard_rating || "");
    const [powerSource, setPowerSource] = useState(editing?.power_source || "");
    const [active, setActive] = useState(editing ? editing.active : true);

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
                hp: numOrNull(hp),
                phase: phase.trim() || null,
                voltage: voltage.trim() || null,
                peak_current: peakCurrent.trim() || null,
                density_range: densityRange.trim() || null,
                flow_rate: numOrNull(flowRate),
                type: type.trim() || null,
                max_suction_lift: numOrNull(maxSuctionLift),
                max_discharge_head: numOrNull(maxDischargeHead),
                max_solids_size: numOrNull(maxSolidsSize),
                hazard_rating: hazardRating.trim() || null,
                power_source: powerSource.trim() || null,
                active
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

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit pump" : "New pump"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>
                        <label>Code</label>
                        <input value={code} onChange={e=>setCode(e.target.value)} disabled={!!editing} />
                    </div>

                    <div>
                        <label>Name</label>
                        <input value={name} onChange={e=>setName(e.target.value)} />
                    </div>

                    <div>
                        <label>HP</label>
                        <input type="number" value={hp} onChange={e=>setHp(e.target.value)} />
                    </div>

                    <div>
                        <label>Phase</label>
                        <input value={phase} onChange={e=>setPhase(e.target.value)} placeholder="Single / Three" />
                    </div>

                    <div>
                        <label>Voltage</label>
                        <input value={voltage} onChange={e=>setVoltage(e.target.value)} />
                    </div>

                    <div>
                        <label>Peak current</label>
                        <input value={peakCurrent} onChange={e=>setPeakCurrent(e.target.value)} />
                    </div>

                    <div>
                        <label>Density range</label>
                        <input value={densityRange} onChange={e=>setDensityRange(e.target.value)} placeholder="Up to 1.4 SG" />
                    </div>

                    <div>
                        <label>Flow rate (m3/hr)</label>
                        <input type="number" value={flowRate} onChange={e=>setFlowRate(e.target.value)} />
                    </div>

                    <div>
                        <label>Type</label>
                        <input value={type} onChange={e=>setType(e.target.value)} placeholder="Submersible / Non-Submersible / Dry Suction / Wet Suction" />
                    </div>

                    <div>
                        <label>Max suction lift (m)</label>
                        <input type="number" value={maxSuctionLift} onChange={e=>setMaxSuctionLift(e.target.value)} />
                    </div>

                    <div>
                        <label>Max discharge head (m)</label>
                        <input type="number" value={maxDischargeHead} onChange={e=>setMaxDischargeHead(e.target.value)} />
                    </div>

                    <div>
                        <label>Max solids size (mm)</label>
                        <input type="number" value={maxSolidsSize} onChange={e=>setMaxSolidsSize(e.target.value)} />
                    </div>

                    <div>
                        <label>Hazard rating</label>
                        <input value={hazardRating} onChange={e=>setHazardRating(e.target.value)} placeholder="Standard / ATEX Zone 1" />
                    </div>

                    <div>
                        <label>Power source</label>
                        <input value={powerSource} onChange={e=>setPowerSource(e.target.value)} placeholder="Electric / Diesel" />
                    </div>

                    <div>
                        <label>Active</label>
                        <select value={active ? "yes" : "no"} onChange={e=>setActive(e.target.value==="yes")}>
                            <option value="yes">Active</option>
                            <option value="no">Inactive</option>
                        </select>
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

export default function PumpsTab(){

    const [pumps, setPumps] = useState([]);
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
            const data = await getPumps();
            setPumps(data ?? []);
        }
        catch(err){
            console.error(err);
            setError("Unable to load pumps.");
        }
        finally{
            setLoading(false);
        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        const remark = await promptForRemark(editing ? "Updating this pump" : "Creating this pump");

        if(remark===null){
            return;
        }

        if(editing){
            await updatePump(editing.id, { ...payload, actor:buildActor(user), remark });
        }
        else{
            await createPump({ ...payload, actor:buildActor(user), remark });
        }

        setShowModal(false);
        setEditing(null);

        load();

    }

    async function handleRemove(id){

        const remark = await promptForRemark("Removing this pump");

        if(remark===null){
            return;
        }

        try{
            await deletePump(id, buildActor(user), remark);
            load();
        }
        catch(err){
            alert(formatApiError(err));
        }

    }

    return(

        <div className="bm-card">

            <h3>

                Pump Master

                <button
                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"
                    onClick={()=>{ setEditing(null); setShowModal(true); }}
                >
                    + Add
                </button>

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>
                Engineering specs for pump selection — flow rate, suction/discharge limits, hazard rating. Linked to machines via each machine's compatible pump list.
            </p>

            {

                loading ? (

                    <p className="bm-muted">Loading pumps...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : pumps.length===0 ? (

                    <p className="bm-muted">No pumps yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>HP</th>
                                <th>Flow (m3/hr)</th>
                                <th>Hazard</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {

                                pumps.map(p=>(

                                    <tr key={p.id}>

                                        <td>{p.code}</td>
                                        <td>{p.name}</td>
                                        <td>{p.hp ?? "—"}</td>
                                        <td>{p.flow_rate ?? "—"}</td>
                                        <td>{p.hazard_rating || "—"}</td>
                                        <td>
                                            <span className={`bm-pill ${p.active ? "bm-pill-green" : "bm-pill-red"}`}>
                                                {p.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className="bm-backlink"
                                                onClick={()=>{ setEditing(p); setShowModal(true); }}
                                            >
                                                Edit
                                            </button>

                                            {" "}

                                            <button
                                                className="bm-backlink"
                                                onClick={()=>handleRemove(p.id)}
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

                    <PumpModal
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
