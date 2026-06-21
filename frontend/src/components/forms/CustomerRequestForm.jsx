// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import "./CustomerRequest.css";


// ====================================
// COMPONENT
// ====================================

export default function CustomerRequestForm({

onSubmit

}){


const [form,setForm] = useState({

company_name:"",

site_location:"",

contact_person:"",

contact_number:"",

nearest_hub:"",

urgency:"Immediate / breakdown",

job_type:"",

material_category:"",

quantity_known:"",

length:"",

width:"",

sludge_depth:"",

access_type:"Open top",

equipment_nearby:"Yes, within 10 m",

quote_basis:"One-time cleaning",

pain_point:"",

photos:[],

videos:[],

drawings:[]

});


// ====================================
// UPDATE
// ====================================

function update(field,value){

setForm(

prev=>({

...prev,

[field]:value

})

);

}


// ====================================
// SUBMIT
// ====================================

function submit(){

onSubmit(form);

}


// ====================================
// UI
// ====================================

return(

<div className="customer-request-page">


{/* SECTION 1 */}

<div className="customer-card">

<div className="customer-header">

<h2>

1. Customer & Site

</h2>

<span>

Required

</span>

</div>


<div className="customer-grid">


<InputField
label="Company Name"
field="company_name"
/>


<InputField
label="Plant / Site Location"
field="site_location"
/>


<InputField
label="Contact Person"
field="contact_person"
/>


<InputField
label="Contact Number"
field="contact_number"
/>


<InputField
label="Nearest City / Hub"
field="nearest_hub"
placeholder="e.g., Mumbai / Pune / Jamshedpur"
/>


<SelectField

label="Urgency"

field="urgency"

options={[

"Immediate / breakdown",

"Within 24 hrs",

"Within 3 days",

"Within 1 week"

]}

/>

</div>

</div>


{/* SECTION 2 */}

<div className="customer-card">


<div className="customer-header">

<h2>

2. Requirement Basics

</h2>

<span>

Customer can answer from observation

</span>

</div>


<div className="customer-grid">


<SelectField

label="What needs cleaning?"

field="job_type"

options={[

"Tank / pit / sump",

"Industrial Tank",

"Clarifier / ETP / STP",

"Drain / Channel",

"Pipeline",

"Pond / Lagoon",

"Reservoir"

]}

/>


<SelectField

label="Material seen at site"

field="material_category"

options={[

"Watery slurry",

"Pumpable sludge",

"Settled sludge",

"Sticky sludge",

"Unknown"

]}

/>


<SelectField

label="Estimated quantity known?"

field="quantity_known"

options={[

"Yes, approximate",

"No"

]}

/>


<InputField

label="Approx. length / diameter"

field="length"

placeholder="e.g., 12 m"

/>


<InputField

label="Approx. width"

field="width"

placeholder="e.g., 6 m"

/>


<InputField

label="Approx. sludge depth"

field="sludge_depth"

placeholder="e.g., 0.8 m"

/>


<SelectField

label="Access opening type"

field="access_type"

options={[

"Open top",

"Manhole",

"Side entry",

"Pipeline access"

]}

/>


<SelectField

label="Equipment placement nearby?"

field="equipment_nearby"

options={[

"Yes, within 10 m",

"Yes, within 20 m",

"No"

]}

/>


<SelectField

label="Quote Basis"

field="quote_basis"

options={[

"One-time cleaning",

"AMC",

"Survey first"

]}

/>


<div

className="customer-field"

style={{gridColumn:"1 / span 3"}}

>

<label>

Customer problem / pain point

</label>


<textarea

rows={4}

value={form.pain_point}

onChange={(e)=>

update(

"pain_point",

e.target.value

)

}

/>

</div>


</div>

</div>


{/* SECTION 3 */}

<div className="customer-card">


<div className="customer-header">

<h2>

3. Uploads

</h2>

<span>

Photos/videos/layouts

</span>

</div>


<div className="upload-grid">


<UploadBox

label="📷 Site photos"

field="photos"

/>


<UploadBox

label="🎥 Site videos"

field="videos"

/>


<UploadBox

label="📄 Drawing / layout"

field="drawings"

/>


</div>

</div>


<div className="button-row">


<button

className="submit-btn"

onClick={submit}

>

Submit Requirement

</button>


<button

className="draft-btn"

>

Save Draft

</button>


</div>


</div>

)


// ====================================
// SUB COMPONENTS
// ====================================

function InputField({

label,

field,

placeholder

}){

return(

<div className="customer-field">

<label>

{label}

</label>

<input

placeholder={placeholder}

/>

</div>

)

}


function SelectField({

label,

field,

options

}){

return(

<div className="customer-field">

<label>

{label}

</label>

<select>

{

options.map(

item=>(

<option key={item}>

{item}

</option>

)

)

}

</select>

</div>

)

}


function UploadBox({

label

}){

return(

<div className="upload-box">

{label}

</div>

)

}

}