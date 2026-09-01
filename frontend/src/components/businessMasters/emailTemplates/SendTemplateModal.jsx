import { useState, useEffect, useRef } from "react";

import {

    renderEmailTemplate,
    sendEmailTemplate

} from "../../../services/emailTemplatesService";

import { isValidEmail } from "../../../utils/validators";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// DOWNLOAD ATTACHMENT
// Plain file download of the real document, untouched - no MIME
// wrapping. mailto: (below) cannot carry an attachment under any
// browser/client (a hard, universal web-platform limitation, not
// something fixable client-side), so when this template has a real
// attachmentUrl the user gets the compose window opened AND the real
// file downloaded separately, to drag in themselves.
// ====================================

async function downloadFile(url, fileName){

    const response = await fetch(url);

    if(!response.ok){
        throw new Error("Unable to fetch the attachment for this email.");
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(objectUrl);

}


// ====================================
// COMPONENT
// One input per variable (recipient-flagged one shown first, marked
// "To:"), a live-updating resolved subject/body preview that is
// itself editable (the user's edits win over further re-renders once
// they've touched it), then confirm-before-send.
//
// `attachmentUrl`/`attachmentFileName`: when provided (Commercial
// Approval's Quote Release flow), the Download action fetches that
// file and embeds it as a real MIME attachment in the .eml - the
// caller doesn't need to hand-pick a file. `downloadOnly` hides the
// Send button and the manual file-attach input entirely, since the
// document is already supplied automatically.
// ====================================

export default function SendTemplateModal({

    template,

    onClose,

    requireAttachment = false,

    attachmentUrl = null,

    attachmentFileName = null,

    downloadOnly = false

}){

    const variables = [...template.variables].sort((a,b)=>

        (b.is_recipient_field ? 1 : 0) - (a.is_recipient_field ? 1 : 0)

    );

    const recipientVariable = template.variables.find(v=>v.is_recipient_field);

    // In downloadOnly mode there's no Send action for a recipient
    // address to feed - showing that input would only invite the user
    // to type an address that then does nothing (and, before the fix
    // above, used to get silently baked into the download as a
    // misleading "To:"). Every other variable still renders normally.
    const visibleVariables = downloadOnly
        ? variables.filter(v=>!v.is_recipient_field)
        : variables;

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

        if(recipientVariable && !isValidEmail(values[recipientVariable.key])){

            setError(`"${recipientVariable.label}" must be a valid email address.`);

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

            setError(formatApiError(err, "Unable to send email."));

        }

        finally{

            setSending(false);

        }

    }

    // Opens a real compose pane directly inside Outlook on the web,
    // using whichever Microsoft account is already signed in in this
    // browser - no OS-level default-mail-app registration involved at
    // all. This is Microsoft's own documented "deep link to compose"
    // URL for Outlook Web
    // (learn.microsoft.com/en-us/exchange/outlook-on-the-web-deep-links) -
    // outlook.office.com serves both Microsoft 365 work/school accounts
    // and personal Microsoft accounts today, so one link covers both.
    // Opened in a new tab so the app itself is never navigated away
    // from.
    //
    // mailto: cannot carry a file attachment under any browser or mail
    // client - a hard, universal limitation of the protocol itself,
    // and the same is true of this deep-link's query params. When this
    // template has a real attachmentUrl (the Quote Release flow), the
    // actual document is downloaded separately, as a plain, correctly-
    // typed file (not wrapped in a broken MIME envelope) - the user
    // drags it into the compose pane that just opened.
    //
    // Deliberately never pre-fills "To:" - opening this means the
    // sender hasn't committed to a recipient through this app, and
    // whatever they typed into the recipient field here (which only
    // ever matters for the in-app Send action, if one is even offered
    // alongside this) may not be who they actually end up mailing.
    // Outlook's own To field is where a real recipient belongs -
    // filled in there, by them, at send time.
    function handleOpenInOutlookWeb(){

        const composeUrl =
            `https://outlook.office.com/mail/deeplink/compose` +
            `?subject=${encodeURIComponent(subjectText)}` +
            `&body=${encodeURIComponent(bodyText)}`;

        window.open(composeUrl, "_blank", "noopener,noreferrer");

        if(attachmentUrl){

            downloadFile(attachmentUrl, attachmentFileName || "attachment")
                .catch(err=>setError(formatApiError(err, "Unable to download the attachment.")));

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:600}}>

                <h3>{downloadOnly ? "Download" : "Send"} — "{template.name}"</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                {

                    variables.length===0 ? (

                        <p className="bm-muted">This template has no variables defined - add some via "Details" first.</p>

                    ) : visibleVariables.length===0 ? (

                        <p className="bm-muted">This template's only variable is the recipient address, which doesn't apply to a download - edit Subject/Body below directly if needed.</p>

                    ) : (

                        <div className="bm-formgrid">

                            {

                                visibleVariables.map(v=>(

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

                    {

                        downloadOnly ? (

                            attachmentFileName && (

                                <div>
                                    <label>Attachment</label>
                                    <p className="bm-muted" style={{margin:0}}>
                                        {attachmentFileName} (included automatically)
                                    </p>
                                </div>

                            )

                        ) : (

                            <div>

                                <label>{requireAttachment ? "Attach the quote release document (required)" : "Attach a file (optional)"}</label>

                                <input

                                    type="file"

                                    onChange={e=>setAttachmentFile(e.target.files?.[0] || null)}

                                />

                            </div>

                        )

                    }

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className={downloadOnly ? "bm-btn bm-btn-primary" : "bm-btn"}

                        onClick={handleOpenInOutlookWeb}

                        title={attachmentUrl ? "Opens a compose window directly in Outlook on the web (uses whichever Microsoft account is already signed in), and downloads the quote document separately to attach yourself - no recipient is set, pick one in Outlook when you send it" : "Opens a compose window directly in Outlook on the web (uses whichever Microsoft account is already signed in) - no recipient is set, pick one in Outlook when you send it"}

                    >

                        Open in Outlook Web

                    </button>

                    {

                        !downloadOnly && (

                            <button

                                className="bm-btn bm-btn-primary"

                                onClick={handleSend}

                                disabled={sending || variables.length===0 || (requireAttachment && !attachmentFile)}

                            >

                                {sending ? "Sending..." : "Send"}

                            </button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}
