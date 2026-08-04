import { useState } from "react";


// ====================================
// COMPONENT
// ====================================

export default function AddContactModal({

    onClose,

    onAdd

}){

    const [name, setName] = useState("");

    const [designation, setDesignation] = useState("");

    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!name.trim()){

            setError("Name required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onAdd({

                name:name.trim(),

                designation:designation || null,

                email:email || null,

                phone:phone || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to add contact.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Add contact</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid single">

                    <div>

                        <label>Name</label>

                        <input value={name} onChange={e=>setName(e.target.value)} />

                    </div>

                    <div>

                        <label>Designation</label>

                        <input value={designation} onChange={e=>setDesignation(e.target.value)} />

                    </div>

                    <div>

                        <label>Email</label>

                        <input value={email} onChange={e=>setEmail(e.target.value)} />

                    </div>

                    <div>

                        <label>Phone</label>

                        <input value={phone} onChange={e=>setPhone(e.target.value)} />

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className="bm-btn bm-btn-primary"

                        onClick={handleSubmit}

                        disabled={saving}

                    >

                        {saving ? "Adding..." : "Add contact"}

                    </button>

                </div>

            </div>

        </div>

    );

}
