import { useState } from "react";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// COMPONENT
// Two-step "+ Add" flow: choose Custom vs Other, then type the value.
// Replaces the wireframe's bare prompt() with a real styled modal,
// matching this app's established convention (NewCustomerModal etc.).
// The actual API call (and its remark prompt) lives in the parent
// tab, matching the Customers tab's onCreate/onAdd callback pattern.
// ====================================

export default function AddLookupValueModal({

    list,

    onClose,

    onSave

}){

    const [kind, setKind] = useState(null);

    const [value, setValue] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const hasOther = list.values.some(v=>v.is_other);

    async function handleSubmit(){

        if(!value.trim()){

            setError("Please enter a value.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onSave({ value: value.trim(), kind });

        }

        catch(err){

            setError(formatApiError(err, "Unable to add value."));

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Add to "{list.display_name}"</h3>

                {

                    !kind ? (

                        <>

                            <p className="bm-modal-hint">

                                Is this a normal option, or should selecting it let the user type their own value?

                            </p>

                            <div className="bm-modal-actions">

                                <button

                                    className="bm-btn bm-btn-ghost"

                                    onClick={onClose}

                                >

                                    Cancel

                                </button>

                                <button

                                    className="bm-btn bm-btn-ghost"

                                    disabled={hasOther}

                                    title={hasOther ? "This list already has an Other option." : undefined}

                                    onClick={()=>setKind("other")}

                                >

                                    Other (custom input)

                                </button>

                                <button

                                    className="bm-btn bm-btn-primary"

                                    onClick={()=>setKind("custom")}

                                >

                                    Custom (normal option)

                                </button>

                            </div>

                        </>

                    ) : (

                        <>

                            {

                                kind==="other" && (

                                    <p className="bm-modal-hint">

                                        This value will let end users type their own free-text answer when selected in the real form.

                                    </p>

                                )

                            }

                            {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                            <div className="bm-formgrid single">

                                <div>

                                    <label>{kind==="other" ? "Label (e.g. Other)" : "Value"}</label>

                                    <input

                                        value={value}

                                        onChange={e=>setValue(e.target.value)}

                                        placeholder={kind==="other" ? "Other" : ""}

                                        autoFocus

                                    />

                                </div>

                            </div>

                            <div className="bm-modal-actions">

                                <button className="bm-btn bm-btn-ghost" onClick={()=>setKind(null)}>Back</button>

                                <button

                                    className="bm-btn bm-btn-primary"

                                    onClick={handleSubmit}

                                    disabled={saving}

                                >

                                    {saving ? "Saving..." : "Save"}

                                </button>

                            </div>

                        </>

                    )

                }

            </div>

        </div>

    );

}
