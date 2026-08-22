import { useState } from "react";

import PhoneInput from "../../shared/PhoneInput";

import { isValidEmail, isValidPhone } from "../../../utils/validators";

import { formatApiError } from "../../../utils/apiError";


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

    function updatePhone(_section, _field, value){
        setPhone(value);
    }

    async function handleSubmit(){

        if(!name.trim()){

            setError("Name required.");

            return;

        }

        if(!isValidEmail(email)){

            setError("Enter a valid email address.");

            return;

        }

        if(!isValidPhone(phone)){

            setError("Enter a valid 10-digit phone number.");

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

            setError(formatApiError(err, "Unable to add contact."));

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

                        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com" />

                    </div>

                    <PhoneInput

                        label="Phone"

                        value={phone}

                        section="contact"

                        field="phone"

                        updateSection={updatePhone}

                    />

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
