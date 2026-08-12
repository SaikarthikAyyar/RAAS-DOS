import { useState } from "react";

import { setSurveyReminder } from "../../../services/surveyReminderService";

// ====================================
// COMPONENT
// A plain countdown from "now" - the number+unit is converted to
// seconds and compared against created_at, never against the
// enquiry's current aging value (confirmed design: a 1-day reminder
// on an already 4-day-old enquiry fires 1 day after it's set, not
// immediately).
// ====================================

const UNIT_SECONDS = {

    minutes: 60,
    hours: 3600,
    days: 86400

};

export default function SurveyReminderModal({

    enquiryId,
    userId,
    userName,

    onClose,
    onSaved

}){

    const [amount, setAmount] = useState(5);

    const [unit, setUnit] = useState("hours");

    const [error, setError] = useState("");

    const [saving, setSaving] = useState(false);

    async function handleSave(){

        if(!amount || amount <= 0){

            setError("Enter a duration greater than 0.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            const thresholdSeconds = Math.round(amount * UNIT_SECONDS[unit]);

            const status = await setSurveyReminder(enquiryId, {

                thresholdSeconds,
                userId,
                userName

            });

            onSaved(status);

            onClose();

        }

        catch(err){

            setError(err?.detail || "Unable to set reminder.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:420}}>

                <h3>Set Survey Reminder</h3>

                <p className="bm-modal-hint">

                    Remind me in:

                </p>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Amount</label>

                        <input

                            type="number"

                            min="1"

                            value={amount}

                            onChange={e=>setAmount(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Unit</label>

                        <select value={unit} onChange={e=>setUnit(e.target.value)}>

                            <option value="minutes">Minutes</option>
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>

                        </select>

                    </div>

                </div>

                <div className="bm-modal-actions">

                    <button className="bm-btn bm-btn-ghost" onClick={onClose}>Cancel</button>

                    <button

                        className="bm-btn bm-btn-primary"

                        onClick={handleSave}

                        disabled={saving}

                    >

                        {saving ? "Saving..." : "Save"}

                    </button>

                </div>

            </div>

        </div>

    );

}
