import { useState } from "react";


// ====================================
// COMPONENT
// Matches remindCustomer()/openEmailModal(): Subject/To/CC prefilled,
// a read-only preview, "Send reminder" — fully client-side, same as
// the wireframe (no real email backend exists in either place).
// ====================================

export default function SendReminderModal({

    detail,

    onClose,

    onSent

}){

    const contactEmail = detail.contacts[0]?.email || "";

    const [subject, setSubject] = useState(`Follow-up: ${detail.company_name}`);

    const [to, setTo] = useState(contactEmail || "(no contact email on file)");

    const [cc, setCc] = useState(detail.owner || "");

    const preview = `Hi, checking in on ${detail.company_name} — ${detail.next_follow_up_note || ""}.`;

    function handleSend(){

        onSent();

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Send email</h3>

                <p className="bm-modal-hint">Recipients are pre-filled from what we know for this customer — add or change anyone before sending.</p>

                <div className="bm-formgrid single">

                    <div>

                        <label>Subject</label>

                        <input value={subject} onChange={e=>setSubject(e.target.value)} />

                    </div>

                    <div>

                        <label>To</label>

                        <input value={to} onChange={e=>setTo(e.target.value)} />

                    </div>

                    <div>

                        <label>CC</label>

                        <input value={cc} onChange={e=>setCc(e.target.value)} />

                    </div>

                    <div>

                        <label>Preview</label>

                        <textarea readOnly value={preview} />

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleSend}>Send reminder</button>

                </div>

            </div>

        </div>

    );

}
