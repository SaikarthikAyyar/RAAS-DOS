import { useState, useEffect, useRef } from "react";

import {

    renderEmailTemplate,
    sendEmailTemplate

} from "../../../services/emailTemplatesService";

import { isValidEmail } from "../../../utils/validators";

import { formatApiError } from "../../../utils/apiError";

import { withDateStamp } from "../../../utils/exportFilename";


// ====================================
// BASE64 HELPERS (for embedding a real binary attachment into a
// downloaded .eml - chunked to avoid a call-stack overflow from
// String.fromCharCode(...bytes) on a large file, and line-wrapped at
// 76 chars per RFC 2045 so mail clients parse it correctly).
// ====================================

async function blobToBase64(blob){

    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    let binary = "";
    const chunkSize = 0x8000;

    for(let i=0; i<bytes.length; i+=chunkSize){
        binary += String.fromCharCode(...bytes.subarray(i, i+chunkSize));
    }

    return btoa(binary);

}

function wrapBase64(base64){

    return base64.match(/.{1,76}/g).join("\r\n");

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

    const [downloading, setDownloading] = useState(false);

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

    // Download the currently-resolved subject/body as a .eml file - the
    // user's own mail client opens it (as a draft or via Forward) letting
    // them pick their own account/address to send from, instead of going
    // through this app's SMTP relay. When attachmentUrl is supplied (the
    // Quote Release flow), the real document is fetched and embedded as
    // a genuine MIME attachment rather than just a text-only email.
    //
    // Deliberately never writes a "To:" header - downloading means the
    // sender hasn't committed to a recipient through this app at all,
    // and whatever they typed into the recipient field here (which only
    // ever matters for the in-app Send action, if one is even offered
    // alongside Download) may not be who they actually end up mailing.
    // Baking it in would silently pre-fill the wrong address the moment
    // the download is opened, contradicting a body that's otherwise
    // recipient-agnostic. Their mail client's own "To" field is where a
    // real recipient belongs - filled in there, by them, at send time.
    async function handleDownload(){

        setDownloading(true);
        setError("");

        try{

            const headerLines = [];

            headerLines.push(`Subject: ${subjectText}`);

            // X-Unsent tells a mail client that respects it (Apple Mail,
            // notably) to open this .eml straight into an editable
            // compose window instead of a read-only "received message"
            // preview - skips the Reply/Forward step entirely there.
            // Clients that don't recognize it (Outlook, most others)
            // just ignore it and fall back to their normal read view,
            // where Forward still turns it into an editable draft with
            // the subject/body/attachment carried over.
            headerLines.push(`X-Unsent: 1`);
            headerLines.push(`Date: ${new Date().toUTCString()}`);
            headerLines.push(`MIME-Version: 1.0`);

            let bodyContent;

            if(attachmentUrl){

                const response = await fetch(attachmentUrl);

                if(!response.ok){
                    throw new Error("Unable to fetch the attachment for this email.");
                }

                const fileBlob = await response.blob();
                const base64 = wrapBase64(await blobToBase64(fileBlob));
                const mediaType = fileBlob.type || "application/octet-stream";
                const fileName = attachmentFileName || "attachment";
                const boundary = `----=_Part_${Date.now()}`;

                headerLines.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);

                bodyContent = [

                    `--${boundary}`,
                    `Content-Type: text/plain; charset="UTF-8"`,
                    `Content-Transfer-Encoding: 8bit`,
                    ``,
                    bodyText,
                    ``,
                    `--${boundary}`,
                    `Content-Type: ${mediaType}; name="${fileName}"`,
                    `Content-Transfer-Encoding: base64`,
                    `Content-Disposition: attachment; filename="${fileName}"`,
                    ``,
                    base64,
                    ``,
                    `--${boundary}--`

                ].join("\r\n");

            }

            else{

                headerLines.push(`Content-Type: text/plain; charset="UTF-8"`);
                headerLines.push(`Content-Transfer-Encoding: 8bit`);

                bodyContent = bodyText;

            }

            const emlContent = [...headerLines, "", bodyContent].join("\r\n");

            const blob = new Blob([emlContent], { type: "message/rfc822" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = withDateStamp(`${template.name.replace(/\s+/g, "_")}.eml`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        }

        catch(err){

            setError(formatApiError(err, "Unable to prepare the download."));

        }

        finally{

            setDownloading(false);

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

                        onClick={handleDownload}

                        disabled={downloading}

                        title={attachmentUrl ? "Download this email with the quote document attached, as a .eml file - no recipient is set, pick one in your own mail client when you send it" : "Download this email (subject + body) as a .eml file - no recipient is set, pick one in your own mail client when you send it"}

                    >

                        {downloading ? "Preparing..." : "Download (.eml)"}

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
