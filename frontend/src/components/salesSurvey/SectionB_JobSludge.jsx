import {

FieldInput

}

from "../shared/FormField";

import LookupSelect from "../shared/LookupSelect";

import { formatPhOptionLabel } from "../../data/phRanges";


export default function SectionB_JobSludge({

surveyData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){


const job = surveyData.job || {};

// pH / Corrosiveness (Material) - a genuinely SEPARATE measurement
// from Section E's own "pH / Corrosiveness" field (pump.ph_condition,
// a pump-selection-context corrosiveness reading already wired into
// the Customer 360 prefill) - this one describes the sludge material
// itself. No separate pH Min/Max fields - the numeric range shows
// directly in the dropdown's own option text (see phRanges.js).

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// moving on to a later field is exactly the signal that an earlier
// required field was skipped.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[`job.${field}`] && (anyFieldTouched || submitAttempted);

}


return(

<div className="survey-card">


<div className="survey-header">

<h2>

B. Job / Material Details

</h2>


</div>


<div className="survey-grid">


<LookupSelect
listKey="jobType"
label="Job Type*"
value={job.job_type}
section="job"
field="job_type"
updateSection={updateSection}
onBlur={()=>touchField("job", "job_type")}
error={fieldError("job_type")}
errorMessage="Job Type is required."
tooltip="The category of work being requested (e.g. tank, pit, pipeline cleaning)."
/>


<LookupSelect
listKey="materialCategory"
label="Material Category*"
value={job.material_category}
section="job"
field="material_category"
updateSection={updateSection}
onBlur={()=>touchField("job", "material_category")}
error={fieldError("material_category")}
errorMessage="Material Category is required."
tooltip="The type of material to be cleaned (e.g. sludge, slurry, ash)."
/>

<FieldInput
label="Cleaning Date"
type="date"
value={job.cleaning_date}
section="job"
field="cleaning_date"
updateSection={updateSection}
tooltip="The date this cleaning job is expected to be carried out."
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
tooltip="How often this site needs cleaning (one-time, monthly, etc.)."
/>


<LookupSelect
listKey="sludgeHardness"
label="Sludge Hardness*"
value={job.sludge_hardness}
section="job"
field="sludge_hardness"
updateSection={updateSection}
onBlur={()=>touchField("job", "sludge_hardness")}
error={fieldError("sludge_hardness")}
errorMessage="Sludge Hardness is required."
tooltip="How firm/compacted the sludge is - affects which machine can break it up."
/>




<LookupSelect
listKey="debrisLevel"
label="Debris Level*"
value={job.debris_level}
section="job"
field="debris_level"
updateSection={updateSection}
onBlur={()=>touchField("job", "debris_level")}
error={fieldError("debris_level")}
errorMessage="Debris Level is required."
tooltip="How much solid debris (rocks, scrap, foreign objects) is present in the material."
/>

<LookupSelect
listKey="waterVisibility"
label="Water Visibility"
value={job.water_visibility}
section="job"
field="water_visibility"
updateSection={updateSection}
tooltip="How clear/turbid the liquid is - a rough indicator of contamination level."
/>


<FieldInput
label="Fluid Density (kg/m³)"
value={job.bulk_density}
section="job"
field="bulk_density"
type="number"
updateSection={updateSection}
tooltip="The measured or estimated density of the material, if known."
/>


<LookupSelect
listKey="yesNoUnknown"
label="Is Material Pumpable?"
value={job.pumpable}
section="job"
field="pumpable"
updateSection={updateSection}
tooltip="Whether the material can be moved with a pump, or needs mechanical removal."
/>





<FieldInput
label="Large Object Type"
value={job.large_object_type}
section="job"
field="large_object_type"
updateSection={updateSection}
tooltip="A description of any large foreign objects found in the material (e.g. rags, metal scrap)."
/>


<LookupSelect
listKey="hazardLevel"
label="Hazard Level*"
value={job.hazard_level}
section="job"
field="hazard_level"
updateSection={updateSection}
onBlur={()=>touchField("job", "hazard_level")}
error={fieldError("hazard_level")}
errorMessage="Hazard Level is required."
tooltip="Whether the material poses a chemical, flammability, or explosive hazard."
/>


<LookupSelect
listKey="ph"
label="pH / Corrosiveness (Material)*"
value={job.material_ph_condition}
section="job"
field="material_ph_condition"
updateSection={updateSection}
formatOption={formatPhOptionLabel}
onBlur={()=>touchField("job", "material_ph_condition")}
error={fieldError("material_ph_condition")}
errorMessage="pH / Corrosiveness (Material) is required."
tooltip="The acidity/alkalinity of the material - extreme values can affect which machine construction is safe to use."
/>


<LookupSelect
listKey="yesNoUnknown"
label="Can Material Flow After Agitation?"
value={job.flow_after_agitation}
section="job"
field="flow_after_agitation"
updateSection={updateSection}
tooltip="Whether stirring/agitating the material makes it flow enough to be pumped."
/>

<LookupSelect
listKey="temperatureRange"
label="Temperature Range*"
value={job.temperature_range}
section="job"
field="temperature_range"
updateSection={updateSection}
onBlur={()=>touchField("job", "temperature_range")}
error={fieldError("temperature_range")}
errorMessage="Temperature Range is required."
tooltip="The typical operating temperature of the material - extreme heat can rule out certain machines."
/>

<LookupSelect
listKey="sampleAvailability"
label="Sample Available"
value={job.sample_available}
section="job"
field="sample_available"
updateSection={updateSection}
tooltip="Whether a physical sample of the material can be provided for lab analysis."
/>

<LookupSelect
listKey="abrasiveness"
label="Abrasiveness"
value={job.abrasiveness}
section="job"
field="abrasiveness"
updateSection={updateSection}
tooltip="How much wear the material would cause on pump/machine parts (Low/Medium/High)."
/>

<LookupSelect
listKey="permitRequired"
label="Permit Required"
value={job.permit_required}
section="job"
field="permit_required"
updateSection={updateSection}
tooltip="Whether a work permit (e.g. confined space, hot work) is needed before the job can start."
/>

<LookupSelect
listKey="flowability"
label="Flowability"
value={job.flowability}
section="job"
field="flowability"
updateSection={updateSection}
tooltip="How easily the material flows on its own, without agitation or pumping assistance."
/>


</div>

</div>

)

}
