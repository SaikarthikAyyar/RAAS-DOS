import { useState } from "react";

import LookupSelect from "../../shared/LookupSelect";


// ====================================
// COMPONENT
// Admin-only edit of the customer's core fields - company_name/
// category/industry/region/gst_number. Account Owner keeps its own
// dedicated reassign flow (CustomerDetailView), Created By is
// permanent - neither is editable here.
// ====================================

export default function EditCustomerModal({

    detail,

    onClose,

    onSave

}){

    const [companyName, setCompanyName] = useState(detail.company_name || "");

    const [category, setCategory] = useState(detail.category || "");

    const [industry, setIndustry] = useState(detail.industry || "");

    const [region, setRegion] = useState(detail.region || "");

    const [gstNumber, setGstNumber] = useState(detail.gst_number || "");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    function updateField(_section, field, value){

        if(field==="category") setCategory(value);
        if(field==="industry") setIndustry(value);
        if(field==="region") setRegion(value);

    }

    async function handleSubmit(){

        if(!companyName.trim()){

            setError("Company name required.");
            return;

        }

        setSaving(true);
        setError("");

        try{

            await onSave({

                company_name:companyName.trim(),
                category:category || null,
                industry:industry || null,
                region:region || null,
                gst_number:gstNumber || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to update customer.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>Edit customer</h3>

                {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                <div className="bm-formgrid">

                    <div>

                        <label>Company name</label>

                        <input

                            value={companyName}

                            onChange={e=>setCompanyName(e.target.value)}

                        />

                    </div>

                    <LookupSelect

                        listKey="customerCategory"

                        label="Category"

                        value={category}

                        section="customer"

                        field="category"

                        updateSection={updateField}

                    />

                    <LookupSelect

                        listKey="customerIndustry"

                        label="Industry"

                        value={industry}

                        section="customer"

                        field="industry"

                        updateSection={updateField}

                    />

                    <LookupSelect

                        listKey="customerRegion"

                        label="Region"

                        value={region}

                        section="customer"

                        field="region"

                        updateSection={updateField}

                    />

                    <div>

                        <label>GST number</label>

                        <input

                            value={gstNumber}

                            onChange={e=>setGstNumber(e.target.value)}

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
