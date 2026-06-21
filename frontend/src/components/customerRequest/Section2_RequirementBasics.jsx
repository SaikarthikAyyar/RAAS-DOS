import {

jobTypes,

materialCategories,

accessTypeOptions,

tankTypeOptions

}

from "../../data/salesSurveyOptions";


export default function Section2_RequirementBasics({

customerData,

updateSection

}){

const requirement=

customerData.requirement || {};


return(

<div className="survey-card">


<div className="survey-header">

<h2>

2. Requirement Basics

</h2>

<span>

Customer can answer from observation

</span>

</div>


<div className="survey-grid">


<FieldSelect

label="What needs cleaning?"

value={requirement.service_requirement_type}

section="requirement"

field="service_requirement_type"

options={jobTypes}

updateSection={updateSection}

/>


<FieldSelect

label="Material seen at site"

value={requirement.observed_material}

section="requirement"

field="observed_material"

options={materialCategories}

updateSection={updateSection}

/>


<FieldSelect

label="Estimated quantity known?"

value={requirement.estimated_quantity_known}

section="requirement"

field="estimated_quantity_known"

options={[

"Yes, approximate",

"No"

]}

updateSection={updateSection}

/>


<FieldSelect

label="Tank Type"

value={requirement.tank_type}

section="requirement"

field="tank_type"

options={tankTypeOptions}

updateSection={updateSection}

/>


<FieldInput

label="Approx. length / diameter"

value={requirement.approx_length_dia}

section="requirement"

field="approx_length_dia"

updateSection={updateSection}

/>


<FieldInput

label="Approx. width"

value={requirement.approx_width}

section="requirement"

field="approx_width"

updateSection={updateSection}

/>


<FieldInput

label="Approx. sludge depth"

value={requirement.approx_depth}

section="requirement"

field="approx_depth"

updateSection={updateSection}

/>


<FieldSelect

label="Access opening type"

value={requirement.access_opening_type}

section="requirement"

field="access_opening_type"

options={accessTypeOptions}

updateSection={updateSection}

/>


<FieldSelect

label="Equipment placement nearby?"

value={requirement.can_place_equipment_nearby}

section="requirement"

field="can_place_equipment_nearby"

options={[

"Yes, within 10 m",

"Yes, within 20 m",

"No",

"Unknown"

]}

updateSection={updateSection}

/>


<FieldSelect

label="Quote Basis"

value={requirement.quote_basis}

section="requirement"

field="quote_basis"

options={[

"One-time cleaning",

"AMC",

"Survey first"

]}

updateSection={updateSection}

/>


<div

className="survey-field"

style={{

gridColumn:"1 / span 3"

}}

>

<label>

Customer problem / pain point

</label>


<textarea

rows={4}

value={requirement.pain_point || ""}

onChange={(e)=>

updateSection(

"requirement",

"pain_point",

e.target.value

)

}

/>

</div>


</div>

</div>

)

}


// ====================================
// INPUT
// ====================================

function FieldInput({

label,

value,

section,

field,

updateSection

}){

return(

<div className="survey-field">

<label>

{label}

</label>

<input

value={value || ""}

onChange={(e)=>

updateSection(

section,

field,

e.target.value

)

}

/>

</div>

)

}


// ====================================
// SELECT
// ====================================

function FieldSelect({

label,

value,

section,

field,

options,

updateSection

}){

return(

<div className="survey-field">

<label>

{label}

</label>

<select

value={value || ""}

onChange={(e)=>

updateSection(

section,

field,

e.target.value

)

}

>

<option value="">

Select

</option>

{

options.map(

item=>(

<option

key={item}

value={item}

>

{item}

</option>

)

)

}

</select>

</div>

)

}