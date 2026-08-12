import { useState, useEffect } from "react";

import {

    getEmailTemplate,
    addTemplateVariable,
    updateTemplateVariable,
    deleteTemplateVariable

} from "../../../services/emailTemplatesService";


// ====================================
// COMPONENT (Details action)
// Manage the structured variable list for one template - add/remove,
// and mark which one variable supplies the "to" address (only one at
// a time; toggling a new one on auto-untoggles the previous, matching
// the backend's own enforcement).
// ====================================

export default function TemplateVariablesModal({

    template,

    onClose

}){

    const [variables, setVariables] = useState(template.variables || []);

    const [newKey, setNewKey] = useState("");

    const [newLabel, setNewLabel] = useState("");

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    async function refresh(){

        try{

            const data = await getEmailTemplate(template.id);

            setVariables(data.variables || []);

        }

        catch(err){

            console.error(err);

        }

    }

    async function handleAdd(){

        if(!newKey.trim() || !newLabel.trim()){

            setError("Key and label are required.");

            return;

        }

        if(!/^\w+$/.test(newKey.trim())){

            setError("Key can only contain letters, numbers and underscores (used as {key} in the body).");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await addTemplateVariable(template.id, {

                key: newKey.trim(),
                label: newLabel.trim(),
                is_recipient_field: false,
                sort_order: variables.length

            });

            setNewKey("");
            setNewLabel("");

            await refresh();

        }

        catch(err){

            setError(err?.detail || "Unable to add variable.");

        }

        finally{

            setSaving(false);

        }

    }

    async function handleToggleRecipient(variable){

        try{

            await updateTemplateVariable(template.id, variable.id, {

                is_recipient_field: !variable.is_recipient_field

            });

            await refresh();

        }

        catch(err){

            alert(err?.detail || "Unable to update variable.");

        }

    }

    async function handleRemove(variable){

        if(!window.confirm(`Remove variable "${variable.key}"?`)) return;

        try{

            await deleteTemplateVariable(template.id, variable.id);

            await refresh();

        }

        catch(err){

            alert(err?.detail || "Unable to remove variable.");

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Details — "{template.name}"</h3>

                <p className="bm-modal-hint">

                    These become the fields the "Send" form asks for. Mark the one that supplies the recipient's email address.

                </p>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div>

                    {

                        variables.length===0 ? (

                            <p className="bm-muted">No variables yet.</p>

                        ) : (

                            variables.map(v=>(

                                <div key={v.id} className="email-template-variable-row">

                                    <span className="email-template-variable-key">{`{${v.key}}`}</span>

                                    <span style={{flex:1}}>{v.label}</span>

                                    {

                                        v.is_recipient_field ? (

                                            <span className="email-template-recipient-badge">Recipient</span>

                                        ) : (

                                            <button

                                                className="bm-backlink"

                                                onClick={()=>handleToggleRecipient(v)}

                                            >

                                                Mark as recipient

                                            </button>

                                        )

                                    }

                                    <button

                                        className="bm-backlink"

                                        style={{color:"#991b1b"}}

                                        onClick={()=>handleRemove(v)}

                                    >

                                        Remove

                                    </button>

                                </div>

                            ))

                        )

                    }

                </div>

                {

                    variables.length===0 && (

                        <div style={{marginTop:10}}>

                            <button

                                className="bm-btn bm-btn-ghost bm-btn-xs"

                                onClick={()=>{ setNewKey("receiver_email"); setNewLabel("Recipient Email"); }}

                            >

                                Suggest: Recipient Email

                            </button>

                            {" "}

                            <button

                                className="bm-btn bm-btn-ghost bm-btn-xs"

                                onClick={()=>{ setNewKey("receiver_name"); setNewLabel("Recipient Name"); }}

                            >

                                Suggest: Recipient Name

                            </button>

                        </div>

                    )

                }

                <div className="bm-formgrid" style={{marginTop:14}}>

                    <div>

                        <label>Key (used as {"{key}"})</label>

                        <input

                            value={newKey}

                            onChange={e=>setNewKey(e.target.value)}

                            placeholder="e.g. receiver_email"

                        />

                    </div>

                    <div>

                        <label>Label</label>

                        <input

                            value={newLabel}

                            onChange={e=>setNewLabel(e.target.value)}

                            placeholder="e.g. Recipient Email"

                        />

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button

                        className="bm-btn bm-btn-primary bm-btn-xs"

                        onClick={handleAdd}

                        disabled={saving}

                    >

                        + Add variable

                    </button>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Close</button>

                </div>

            </div>

        </div>

    );

}
