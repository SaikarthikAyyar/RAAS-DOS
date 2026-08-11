import { useState } from "react";

import LookupSelect from "../../shared/LookupSelect";


// ====================================
// COMPONENT
// Matches openNewCustomerModal()/submitNewCustomer(). One flagged
// deviation: "Account owner" is a select of hardcoded fake sales-rep
// names (synthOwners) in the wireframe — this app has no real master
// list of sales reps yet, so it stays free text rather than baking
// in demo names as if they were real structural options.
// ====================================

export default function NewCustomerModal({

    onClose,

    onCreate

}){

    const [companyName, setCompanyName] = useState("");

    const [category, setCategory] = useState("Standard Industrial");

    const [industry, setIndustry] = useState("");

    const [region, setRegion] = useState("");

    function updateField(_section, field, value){

        if(field==="category") setCategory(value);

        if(field==="industry") setIndustry(value);

        if(field==="region") setRegion(value);

    }

    const [gstNumber, setGstNumber] = useState("");

    const [owner, setOwner] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(){

        if(!companyName.trim()){

            setError("Company name required.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await onCreate({

                company_name:companyName.trim(),

                category,

                industry:industry || null,

                region:region || null,

                gst_number:gstNumber || null,

                owner:owner || null

            });

        }

        catch(err){

            setError(err?.detail || "Unable to create customer.");

        }

        finally{

            setSaving(false);

        }

    }

    return(

        <div className="bm-modal-overlay" onClick={onClose}>

            <div className="bm-modal-box" onClick={e=>e.stopPropagation()}>

                <h3>New customer</h3>

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

                    <div>

                        <label>Account owner</label>

                        <input

                            value={owner}

                            onChange={e=>setOwner(e.target.value)}

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

                        {saving ? "Creating..." : "Create customer"}

                    </button>

                </div>

            </div>

        </div>

    );

}
