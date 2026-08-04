import { useState } from "react";


// ====================================
// COMPONENT
// ====================================

export default function SetFollowUpModal({

    initialDate,

    initialOwner,

    initialNote,

    onClose,

    onSave

}){

    const [date, setDate] = useState(initialDate || "");

    const [owner, setOwner] = useState(initialOwner || "");

    const [note, setNote] = useState(initialNote || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!date){

            setError("Date required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({

                date,

                owner:owner || null,

                note:note || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to save follow-up.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Set / update next follow-up</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid single">

                    <div>

                        <label>Date</label>

                        <input

                            type="date"

                            value={date}

                            onChange={e=>setDate(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Owner</label>

                        <input value={owner} onChange={e=>setOwner(e.target.value)} />

                    </div>

                    <div>

                        <label>Note</label>

                        <input value={note} onChange={e=>setNote(e.target.value)} />

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
