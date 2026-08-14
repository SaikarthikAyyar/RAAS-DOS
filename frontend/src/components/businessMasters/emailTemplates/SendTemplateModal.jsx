import { useState, useEffect, useRef } from "react";

import {

    renderEmailTemplate,
    sendEmailTemplate

} from "../../../services/emailTemplatesService";


// ====================================
// COMPONENT
// One input per variable (recipient-flagged one shown first, marked
// "To:"), a live-updating resolved subject/body preview that is
// itself editable (the user's edits win over further re-renders once
// they've touched it), then confirm-before-send.
// ====================================

export default function SendTemplateModal({

    template,

    onClose,

    requireAttachment = false

}){

    const variables = [...template.variables].sort((a,b)=>

        (b.is_recipient_field ? 1 : 0) - (a.is_recipient_field ? 1 : 0)

    );

    const recipientVariable = template.variables.find(v=>v.is_recipient_field);

    const [values, setValues] = useState(

        Object.fromEntries(variables.map(v=>[v.key, ""]))

    );

    const [subjectText, setSubjectText] = useState(template.subject);

    const [bodyText, setBodyText] = useState(template.body);

    const [previewDirty, setPreviewDirty] = useState(false);

    const [attachmentFile, setAttachmentFile] = useState(null);

    const [error, setError] = useState("");

    const [sending, setSending] = useState(false);

    const debounceRef = useRef(null);

    useEffect(()=>{

        if(debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async()=>{

            try{

                const rendered = await renderEmailTemplate(template.id, values);

                if(!previewDirty){

                    setSubjectText(rendered.subject);
                    setBodyText(rendered.body);

                }

            }

            catch(err){

                console.error(err);

            }

        }, 400);

        return ()=>{ if(debounceRef.current) clearTimeout(debounceRef.current); };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values]);

    function handleValueChange(key, value){

        setValues(prev=>({ ...prev, [key]: value }));

    }

    async function handleSend(){

        if(recipientVariable && !values[recipientVariable.key]?.trim()){

            setError(`"${recipientVariable.label}" is required.`);

            return;

        }

        if(requireAttachment && !attachmentFile){

            setError("Attach the quote release document before sending - there's no point sending this email without it.");

            return;

        }

        if(!window.confirm(`Send this email now?\n\nSubject: ${subjectText}`)){

            return;

        }

        setSending(true);

        setError("");

        try{

            await sendEmailTemplate(template.id, {

                variableValues: values,
                subjectOverride: subjectText,
                bodyOverride: bodyText,
                attachmentFile

            });

            alert("Email sent.");

            onClose();

        }

        catch(err){

            setError(err?.detail || "Unable to send email.");

        }

        finally{

            setSending(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>

                <h3>Send — "{template.name}"</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                {

                    variables.length===0 ? (

                        <p className="bm-muted">This template has no variables defined - add some via "Details" first.</p>

                    ) : (

                        <div className="bm-formgrid">

                            {

                                variables.map(v=>(

                                    <div key={v.id}>

                                        <label>

                                            {v.is_recipient_field ? `To: ${v.label}` : v.label}

                                        </label>

                                        <input

                                            value={values[v.key] || ""}

                                            onChange={e=>handleValueChange(v.key, e.target.value)}

                                            placeholder={v.is_recipient_field ? "name@example.com" : ""}

                                        />

                                    </div>

                                ))

                            }

                        </div>

                    )

                }

                <div className="bm-formgrid single" style={{marginTop:14}}>

                    <div>

                        <label>Subject (resolved — editable)</label>

                        <input

                            value={subjectText}

                            onChange={e=>{ setSubjectText(e.target.value); setPreviewDirty(true); }}

                        />

                    </div>

                    <div>

                        <label>Body (resolved — editable)</label>

                        <textarea

                            value={bodyText}

                            onChange={e=>{ setBodyText(e.target.value); setPreviewDirty(true); }}

                            rows={10}

                            style={{width:"100%", fontFamily:"inherit", resize:"vertical"}}

                        />

                    </div>

                    <div>

                        <label>{requireAttachment ? "Attach the quote release document (required)" : "Attach a file (optional)"}</label>

                        <input

                            type="file"

                            onChange={e=>setAttachmentFile(e.target.files?.[0] || null)}

                        />

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className="bm-btn bm-btn-primary"

                        onClick={handleSend}

                        disabled={sending || variables.length===0 || (requireAttachment && !attachmentFile)}

                    >

                        {sending ? "Sending..." : "Send"}

                    </button>

                </div>

            </div>

        </div>

    );

}
