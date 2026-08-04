// ====================================
// NEW SITE FIELDS
// Matches the wireframe's #newSiteFields block (Division/
// Subsidiary, Department here - Plant and Cleaning frequency are
// deliberately not repeated, they reuse Plant/Site Location and
// Cleaning Frequency already collected elsewhere on this form).
// Only rendered when no existing asset has been selected.
// ====================================

export default function NewSiteFields({

customerData,

updateSection

}){

const customer = customerData.customer || {};

return(

<div className="survey-card">

<div className="survey-header">

<h2>

New site

</h2>

<span>

Creates a Division / Department / Asset for this customer

</span>

</div>

<div className="survey-grid">

<div className="survey-field">

<label>

Division / Subsidiary

</label>

<input

    value={customer.division || ""}

    placeholder="e.g. Long Products (leave blank for 'Main')"

    onChange={e=>updateSection("customer", "division", e.target.value)}

/>

</div>

<div className="survey-field">

<label>

Department

</label>

<input

    value={customer.department || ""}

    placeholder="e.g. Tin Plant (leave blank for 'General')"

    onChange={e=>updateSection("customer", "department", e.target.value)}

/>

</div>

</div>

</div>

)

}
