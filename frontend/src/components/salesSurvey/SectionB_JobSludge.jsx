import {

jobTypes,

materialCategories,

sludge_hardnessOptions,

debrisLevels,

hazardLevels,

yesNoUnknown,

waterVisibilityOptions,
temperatureRangeOptions,
sampleAvailabilityOptions

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


</div>


<div className="survey-grid">


<FieldSelect
label="Job Type*"
value={job.job_type}
section="job"
field="job_type"
options={jobTypes}
updateSection={updateSection}
/>


<FieldSelect
label="Material Category*"
value={job.material_category}
section="job"
field="material_category"
options={materialCategories}
updateSection={updateSection}
/>

<FieldInput
label="Cleaning Date*"
type="date"
value={job.cleaning_date}
section="job"
field="cleaning_date"
updateSection={updateSection}
/>

<FieldInput
label="Cleaning Frequency*"
value={job.cleaning_frequency}
section="job"
field="cleaning_frequency"
updateSection={updateSection}
/>


<FieldSelect
label="Sludge Hardness*"
value={job.sludge_hardness}
section="job"
field="sludge_hardness"
options={sludge_hardnessOptions}
updateSection={updateSection}
/>




<FieldSelect
label="Debris Level*"
value={job.debris_level}
section="job"
field="debris_level"
options={debrisLevels}
updateSection={updateSection}
/>

<FieldSelect
label="Water Visibility"
value={job.water_visibility}
section="job"
field="water_visibility"
options={waterVisibilityOptions}
updateSection={updateSection}
/>


<FieldInput
label="Fluid Density (kg/m³)"
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

<FieldSelect
label="Temperature Range"
value={job.temperature_range}
section="job"
field="temperature_range"
options={temperatureRangeOptions}
updateSection={updateSection}
/>

<FieldSelect
label="Sample Available"
value={job.sample_available}
section="job"
field="sample_available"
options={sampleAvailabilityOptions}
updateSection={updateSection}
/>




</div>

</div>

)

}


function FieldInput({

label,

type,

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

type={type || "text"}

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
