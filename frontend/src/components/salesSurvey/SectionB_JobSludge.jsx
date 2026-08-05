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

import {

FieldInput,

FieldSelect

}

from "../shared/FormField";


export default function SectionB_JobSludge({

surveyData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){


const job = surveyData.job || {};

function fieldError(field){

    return errors?.[`job.${field}`] && (touched?.[`job.${field}`] || submitAttempted);

}


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
onBlur={()=>touchField("job", "job_type")}
error={fieldError("job_type")}
errorMessage="Job Type is required."
/>


<FieldSelect
label="Material Category*"
value={job.material_category}
section="job"
field="material_category"
options={materialCategories}
updateSection={updateSection}
onBlur={()=>touchField("job", "material_category")}
error={fieldError("material_category")}
errorMessage="Material Category is required."
/>

<FieldInput
label="Cleaning Date*"
type="date"
value={job.cleaning_date}
section="job"
field="cleaning_date"
updateSection={updateSection}
onBlur={()=>touchField("job", "cleaning_date")}
error={fieldError("cleaning_date")}
errorMessage="Cleaning Date is required."
/>

<FieldInput
label="Cleaning Frequency*"
value={job.cleaning_frequency}
section="job"
field="cleaning_frequency"
updateSection={updateSection}
onBlur={()=>touchField("job", "cleaning_frequency")}
error={fieldError("cleaning_frequency")}
errorMessage="Cleaning Frequency is required."
/>


<FieldSelect
label="Sludge Hardness*"
value={job.sludge_hardness}
section="job"
field="sludge_hardness"
options={sludge_hardnessOptions}
updateSection={updateSection}
onBlur={()=>touchField("job", "sludge_hardness")}
error={fieldError("sludge_hardness")}
errorMessage="Sludge Hardness is required."
/>




<FieldSelect
label="Debris Level*"
value={job.debris_level}
section="job"
field="debris_level"
options={debrisLevels}
updateSection={updateSection}
onBlur={()=>touchField("job", "debris_level")}
error={fieldError("debris_level")}
errorMessage="Debris Level is required."
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
