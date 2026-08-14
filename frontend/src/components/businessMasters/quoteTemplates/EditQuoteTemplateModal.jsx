import { useState } from "react";

import {

    createQuoteTemplate,
    updateQuoteTemplate

} from "../../../services/quoteTemplatesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// COMPONENT
// Create + edit a quote template - name/active/body all together in
// one modal (unlike Email Templates, which splits metadata and body
// across two modals). The body is a real, long, admin-edited document
// draft: ordinary {token} placeholders plus the two reserved table
// placeholders {tank_machine_table} / {commercial_table}, each on
// its own paragraph line, resolved server-side into real docx tables.
// ====================================

export default function EditQuoteTemplateModal({

    template,

    onClose,

    onSaved

}){

    const [name, setName] = useState(template?.name || "");

    const [active, setActive] = useState(template?.active ?? true);

    const [body, setBody] = useState(template?.body || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    async function handleSubmit(){

        if(!name.trim()){

            setError("Name is required.");

            return;

        }

        const remark = await promptForRemark(template ? "Updating this quote template" : "Creating this quote template");

        if(remark===null){
            return;
        }

        setSaving(true);

        setError("");

        try{

            if(template){

                await updateQuoteTemplate(template.id, {

                    name: name.trim(),
                    active,
                    body,
                    actor: buildActor(user),
                    remark

                });

            }

            else{

                await createQuoteTemplate({

                    name: name.trim(),
                    active,
                    body,
                    variables: [],
                    actor: buildActor(user),
                    remark

                });

            }

            onSaved();

        }

        catch(err){

            setError(err?.detail || "Unable to save quote template.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:640}}>

                <h3>{template ? "Edit quote template" : "New quote template"}</h3>

                <p className="bm-modal-hint">

                    Use {"{token}"} placeholders for ordinary values (customer, site, value, ...).
                    Put {"{tank_machine_table}"} and {"{commercial_table}"} on their own lines to
                    insert the real dynamic Tank/Machine and Commercial tables when the quote is released.

                </p>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid single">

                    <div>

                        <label>Name</label>

                        <input

                            value={name}

                            onChange={e=>setName(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>

                            <input

                                type="checkbox"

                                checked={active}

                                onChange={e=>setActive(e.target.checked)}

                                style={{width:"auto", marginRight:6}}

                            />

                            Active

                        </label>

                    </div>

                    <div>

                        <label>Document body</label>

                        <textarea

                            value={body}

                            onChange={e=>setBody(e.target.value)}

                            rows={18}

                            style={{width:"100%", fontFamily:"inherit", resize:"vertical"}}

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

            {remarkModal}

        </div>

    );

}
