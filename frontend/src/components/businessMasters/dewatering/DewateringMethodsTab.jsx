import { useState, useEffect, useCallback } from "react";

import {

    getDewateringMethods,
    createDewateringMethod,
    updateDewateringMethod,
    deleteDewateringMethod

} from "../../../services/dewateringMethodsService";


// ====================================
// ADD / EDIT MODAL
// ====================================

function DewateringMethodModal({ editing, onClose, onSave }){

    const [methodKey, setMethodKey] = useState(editing?.method_key || "");

    const [methodName, setMethodName] = useState(editing?.method_name || "");

    const [ratePerM3, setRatePerM3] = useState(editing?.rate_per_m3 ?? "");

    const [bestFor, setBestFor] = useState(editing?.best_for || "");

    const [reviewTrigger, setReviewTrigger] = useState(editing?.review_trigger || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!methodKey.trim() || !methodName.trim() || ratePerM3===""){

            setError("Method key, method name and rate per m³ are required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                method_key: methodKey.trim().toUpperCase(),
                method_name: methodName.trim(),
                rate_per_m3: Number(ratePerM3),
                best_for: bestFor.trim() || null,
                review_trigger: reviewTrigger.trim() || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to save dewatering method.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>{editing ? "Edit dewatering method" : "New dewatering method"}</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Method key</label>

                        <input

                            value={methodKey}

                            onChange={e=>setMethodKey(e.target.value)}

                            disabled={!!editing}

                            placeholder="e.g. FILTER_PRESS"

                        />

                    </div>

                    <div>

                        <label>Method name</label>

                        <input

                            value={methodName}

                            onChange={e=>setMethodName(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Rate per m³ (₹)</label>

                        <input

                            type="number"

                            value={ratePerM3}

                            onChange={e=>setRatePerM3(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Best for</label>

                        <input

                            value={bestFor}

                            onChange={e=>setBestFor(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Review trigger</label>

                        <input

                            value={reviewTrigger}

                            onChange={e=>setReviewTrigger(e.target.value)}

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

export default function DewateringMethodsTab(){

    const [methods, setMethods] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [editing, setEditing] = useState(null);

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getDewateringMethods();

            setMethods(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load dewatering methods.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleSave(payload){

        if(editing){

            await updateDewateringMethod(editing.id, {

                method_name: payload.method_name,
                rate_per_m3: payload.rate_per_m3,
                best_for: payload.best_for,
                review_trigger: payload.review_trigger

            });

        }

        else{

            await createDewateringMethod(payload);

        }

        setShowModal(false);

        setEditing(null);

        load();

    }

    async function handleRemove(id){

        if(!window.confirm("Remove this dewatering method?")) return;

        try{

            await deleteDewateringMethod(id);

            load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove dewatering method.");

        }

    }

    return(

        <div className="bm-card">

            <h3>

                Dewatering methods

                <button

                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                    onClick={()=>{ setEditing(null); setShowModal(true); }}

                >

                    + Add

                </button>

            </h3>

            {

                loading ? (

                    <p className="bm-muted">Loading dewatering methods...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : methods.length===0 ? (

                    <p className="bm-muted">No dewatering methods yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Method</th>

                                <th>Rate per m³ (₹)</th>

                                <th>Best for</th>

                                <th>Review trigger</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                methods.map(m=>(

                                    <tr key={m.id}>

                                        <td>{m.method_name}</td>

                                        <td>{Number(m.rate_per_m3).toLocaleString()}</td>

                                        <td>{m.best_for || "—"}</td>

                                        <td>{m.review_trigger || "—"}</td>

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

                    <DewateringMethodModal

                        editing={editing}

                        onClose={()=>{ setShowModal(false); setEditing(null); }}

                        onSave={handleSave}

                    />

                )

            }

        </div>

    );

}
