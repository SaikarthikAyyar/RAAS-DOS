import { useState } from "react";

import {

    getQuoteTemplate,
    addQuoteTemplateVariable,
    deleteQuoteTemplateVariable

} from "../../../services/quoteTemplatesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// COMPONENT (Details action)
// Manage the structured variable list for one quote template -
// add/remove only, direct copy of TemplateVariablesModal.jsx minus
// the recipient-flag concept (quote templates don't send anything
// themselves - the release/email step lives on Commercial Approval).
// ====================================

export default function QuoteTemplateVariablesModal({

    template,

    onClose

}){

    const [variables, setVariables] = useState(template.variables || []);

    const [newKey, setNewKey] = useState("");

    const [newLabel, setNewLabel] = useState("");

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    async function refresh(){

        try{

            const data = await getQuoteTemplate(template.id);

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

        const remark = await promptForRemark("Adding this variable");

        if(remark===null){
            return;
        }

        setSaving(true);

        setError("");

        try{

            await addQuoteTemplateVariable(template.id, {

                key: newKey.trim(),
                label: newLabel.trim(),
                sort_order: variables.length,
                actor: buildActor(user),
                remark

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

    async function handleRemove(variable){

        const remark = await promptForRemark(`Removing variable "${variable.key}"`);

        if(remark===null){
            return;
        }

        try{

            await deleteQuoteTemplateVariable(template.id, variable.id, buildActor(user), remark);

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

                    These are the {"{token}"} placeholders resolvable in this template's document body.

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

                <div className="bm-formgrid" style={{marginTop:14}}>

                    <div>

                        <label>Key (used as {"{key}"})</label>

                        <input

                            value={newKey}

                            onChange={e=>setNewKey(e.target.value)}

                            placeholder="e.g. customer"

                        />

                    </div>

                    <div>

                        <label>Label</label>

                        <input

                            value={newLabel}

                            onChange={e=>setNewLabel(e.target.value)}

                            placeholder="e.g. Customer Name"

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

            {remarkModal}

        </div>

    );

}
