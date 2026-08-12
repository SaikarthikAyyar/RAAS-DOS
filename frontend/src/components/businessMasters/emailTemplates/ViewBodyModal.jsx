import { useState } from "react";

import { updateEmailTemplate } from "../../../services/emailTemplatesService";


// ====================================
// COMPONENT
// Real body editor - this IS the content actually used when the
// email is sent (not decorative). A read-only reference panel lists
// the template's defined variable keys/labels alongside, since View
// and Details are functionally linked (you need to know the keys to
// use them in the body).
// ====================================

export default function ViewBodyModal({

    template,

    onClose,

    onSaved

}){

    const [body, setBody] = useState(template.body || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        setSaving(true);

        setError("");

        try{

            await updateEmailTemplate(template.id, { body });

            onSaved();

        }

        catch(err){

            setError(err?.detail || "Unable to save body.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:560}}>

                <h3>Body — "{template.name}"</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid single">

                    <div>

                        <label>Email body</label>

                        <textarea

                            value={body}

                            onChange={e=>setBody(e.target.value)}

                            rows={12}

                            style={{width:"100%", fontFamily:"inherit", resize:"vertical"}}

                        />

                    </div>

                </div>

                <div className="email-template-var-reference">

                    <strong style={{fontSize:11.5}}>Available variables (see "Details" to add/remove)</strong>

                    <div style={{marginTop:6, display:"flex", flexWrap:"wrap", gap:6}}>

                        {

                            template.variables.length===0 ? (

                                <span className="bm-muted">No variables defined yet.</span>

                            ) : (

                                template.variables.map(v=>(

                                    <span key={v.id} className="email-template-variable-key">

                                        {`{${v.key}}`} — {v.label}

                                    </span>

                                ))

                            )

                        }

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
