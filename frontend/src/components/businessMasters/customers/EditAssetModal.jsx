import { useState } from "react";

import { formatApiError } from "../../../utils/apiError";


// ====================================
// COMPONENT
// Edits an asset's structural fields (division/plant/department/
// name) only - the mutable site-profile fields (observed material,
// access opening type, ...) are kept current automatically off the
// next Sales Survey submitted at this asset, not hand-edited here.
// Every dependent module (Sales Survey's "Existing asset" picker,
// the Enquiry Workspace's Asset Profile card, this same Customer 360
// view/export) reads this same Asset row live, so saving here is all
// that's needed for the change to show up everywhere else.
// ====================================

export default function EditAssetModal({

    asset,

    onClose,

    onSave

}){

    const [division, setDivision] = useState(asset.division || "");

    const [plant, setPlant] = useState(asset.plant || "");

    const [department, setDepartment] = useState(asset.department || "");

    const [name, setName] = useState(asset.name || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        setSaving(true);
        setError("");

        try{

            await onSave({

                division: division.trim() || null,
                plant: plant.trim() || null,
                department: department.trim() || null,
                name: name.trim() || null

            });

        }

        catch(err){

            setError(formatApiError(err, "Unable to update asset."));

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Edit asset</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Division</label>

                        <input

                            value={division}

                            onChange={e=>setDivision(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Plant</label>

                        <input

                            value={plant}

                            onChange={e=>setPlant(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Department</label>

                        <input

                            value={department}

                            onChange={e=>setDepartment(e.target.value)}

                        />

                    </div>

                    <div>

                        <label>Asset</label>

                        <input

                            value={name}

                            onChange={e=>setName(e.target.value)}

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

                        {saving ? "Saving..." : "Save changes"}

                    </button>

                </div>

            </div>

        </div>

    );

}
