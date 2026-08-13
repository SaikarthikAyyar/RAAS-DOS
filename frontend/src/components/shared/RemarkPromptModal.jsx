import { useState } from "react";


// ====================================
// COMPONENT
// Business Masters is critical data - every create/update/delete
// there requires the acting user to type a reason before it goes
// through. This replaces the bare window.confirm() previously used
// on delete-style actions (typing + confirming already serves as
// the "are you sure" gate).
// ====================================

export default function RemarkPromptModal({

    actionLabel,

    onCancel,

    onConfirm

}){

    const [remark, setRemark] = useState("");

    const [error, setError] = useState("");

    function handleConfirm(){

        if(!remark.trim()){

            setError("A reason is required before this change can be submitted.");

            return;

        }

        onConfirm(remark.trim());

    }

    return(

        <div className="bm-modal-overlay" onClick={onCancel}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Reason required</h3>

                <p className="bm-modal-hint">
                    {actionLabel} affects Business Masters data. Every user will be notified -
                    please provide a reason for this change.
                </p>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid single">

                    <div>

                        <label>Reason for this change</label>

                        <textarea
                            rows={4}
                            value={remark}
                            onChange={e=>setRemark(e.target.value)}
                            placeholder="e.g. Correcting outdated rate per updated vendor pricing"
                            autoFocus
                        />

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onCancel}>Cancel</button>

                    <button className="bm-btn bm-btn-primary" onClick={handleConfirm}>Confirm</button>

                </div>

            </div>

        </div>

    );

}
