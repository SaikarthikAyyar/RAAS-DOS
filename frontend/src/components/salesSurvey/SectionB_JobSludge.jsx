import {

jobTypes,

materialCategories,

consistencyOptions,

debrisLevels,

hazardLevels,

yesNoUnknown

}

from "../../data/salesSurveyOptions";


export default function SectionB_JobSludge({

surveyData,

updateSection

}){


const job = surveyData.job || {};


return(

<div className="survey-card">


<div className="survey-header">

<h2>

B. Job / Material Details

</h2>

<span>

Workbook Fields

</span>

</div>


<div className="survey-grid">


<FieldSelect
label="Job Type"
value={job.job_type}
section="job"
field="job_type"
options={jobTypes}
updateSection={updateSection}
/>


<FieldSelect
label="Material Category"
value={job.material_category}
section="job"
field="material_category"
options={materialCategories}
updateSection={updateSection}
/>


<FieldSelect
label="Sludge Hardness"
value={job.consistency}
section="job"
field="consistency"
options={consistencyOptions}
updateSection={updateSection}
/>


<FieldInput
label="Sludge Depth"
value={job.sludge_depth}
section="job"
field="sludge_depth"
updateSection={updateSection}
/>


<FieldSelect
label="Debris Level"
value={job.debris_level}
section="job"
field="debris_level"
options={debrisLevels}
updateSection={updateSection}
/>


<FieldInput
label="Fluid Density"
value={job.bulk_density}
section="job"
field="bulk_density"
updateSection={updateSection}
/>


<FieldSelect
label="Is Material Pumpable?"
value={job.pumpable}
section="job"
field="pumpable"
options={yesNoUnknown}
updateSection={updateSection}
/>


<FieldInput
label="Tank/Pit Length"
value={job.tank_length}
section="job"
field="tank_length"
updateSection={updateSection}
/>


<FieldInput
label="Tank/Pit Width"
value={job.tank_width}
section="job"
field="tank_width"
updateSection={updateSection}
/>


<FieldInput
label="Large Object Type"
value={job.large_object_type}
section="job"
field="large_object_type"
updateSection={updateSection}
/>


<FieldSelect
label="Hazard Level"
value={job.hazard_level}
section="job"
field="hazard_level"
options={hazardLevels}
updateSection={updateSection}
/>


<FieldInput
label="pH Min"
value={job.ph_min}
section="job"
field="ph_min"
updateSection={updateSection}
/>


<FieldInput
label="pH Max"
value={job.ph_max}
section="job"
field="ph_max"
updateSection={updateSection}
/>


<FieldSelect
label="Can Material Flow After Agitation?"
value={job.flow_after_agitation}
section="job"
field="flow_after_agitation"
options={yesNoUnknown}
updateSection={updateSection}
/>


<FieldInput
label="Photos / Videos"
value={job.photos}
section="job"
field="photos"
updateSection={updateSection}
/>


</div>

</div>

)

}


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