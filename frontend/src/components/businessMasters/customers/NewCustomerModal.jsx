import { useState } from "react";

import {

    customerCategories,

    customerIndustries,

    customerRegions

} from "../../../data/customerMasterOptions";


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

    const [category, setCategory] = useState(customerCategories[1]);

    const [industry, setIndustry] = useState("");

    const [region, setRegion] = useState("");

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

                    <div>

                        <label>Category</label>

                        <select

                            value={category}

                            onChange={e=>setCategory(e.target.value)}

                        >

                            {customerCategories.map(c=><option key={c}>{c}</option>)}

                        </select>

                    </div>

                    <div>

                        <label>Industry</label>

                        <select

                            value={industry}

                            onChange={e=>setIndustry(e.target.value)}

                        >

                            <option value="">Select</option>

                            {customerIndustries.map(i=><option key={i}>{i}</option>)}

                        </select>

                    </div>

                    <div>

                        <label>Region</label>

                        <select

                            value={region}

                            onChange={e=>setRegion(e.target.value)}

                        >

                            <option value="">Select</option>

                            {customerRegions.map(r=><option key={r}>{r}</option>)}

                        </select>

                    </div>

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
