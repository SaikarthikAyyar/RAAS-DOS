import {

FieldInput

}

from "../shared/FormField";

import LookupSelect from "../shared/LookupSelect";

const PH_RANGE_BY_CONDITION = {
    "Acidic": { min: 1, max: 6 },
    "Low / Neutral": { min: 7, max: 7 },
    "Alkaline": { min: 8, max: 14 }
};


export default function SectionB_JobSludge({

surveyData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){


const job = surveyData.job || {};

// ====================================
// pH / Corrosiveness -> pH Min/Max autofill
// Chemistry: neutral sits at exactly 7, acidic is below 7, alkaline
// (basic) is above 7. This is a genuinely SEPARATE measurement from
// Section E's own "pH / Corrosiveness" field (pump.ph_condition,
// a pump-selection-context corrosiveness reading already wired into
// the Customer 360 prefill) - material_ph_condition describes the
// sludge material itself and only drives this section's own pH Min/
// Max autofill. The two number fields stay editable afterward (same
// "autofill, don't lock" convention already used for Customer
// Request's existing-asset autofill), so a user can still fine-tune
// the exact value for this specific site.
// ====================================

function handleMaterialPhConditionChange(section, field, value){

    updateSection(section, field, value);

    const range = PH_RANGE_BY_CONDITION[value];

    if(range){
        updateSection("job", "ph_min", range.min);
        updateSection("job", "ph_max", range.max);
    }

}

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
/>

<LookupSelect
listKey="waterVisibility"
label="Water Visibility"
value={job.water_visibility}
section="job"
field="water_visibility"
updateSection={updateSection}
/>


<FieldInput
label="Fluid Density (kg/m³)"
value={job.bulk_density}
section="job"
field="bulk_density"
type="number"
updateSection={updateSection}
/>


<LookupSelect
listKey="yesNoUnknown"
label="Is Material Pumpable?"
value={job.pumpable}
section="job"
field="pumpable"
updateSection={updateSection}
/>





<FieldInput
label="Large Object Type"
value={job.large_object_type}
section="job"
field="large_object_type"
updateSection={updateSection}
/>


<LookupSelect
listKey="hazardLevel"
label="Hazard Level"
value={job.hazard_level}
section="job"
field="hazard_level"
updateSection={updateSection}
/>


<LookupSelect
listKey="ph"
label="pH / Corrosiveness (Material)"
value={job.material_ph_condition}
section="job"
field="material_ph_condition"
updateSection={handleMaterialPhConditionChange}
/>


<FieldInput
label="pH Min"
value={job.ph_min}
section="job"
field="ph_min"
type="number"
updateSection={updateSection}
/>


<FieldInput
label="pH Max"
value={job.ph_max}
section="job"
field="ph_max"
type="number"
updateSection={updateSection}
/>


<LookupSelect
listKey="yesNoUnknown"
label="Can Material Flow After Agitation?"
value={job.flow_after_agitation}
section="job"
field="flow_after_agitation"
updateSection={updateSection}
/>

<LookupSelect
listKey="temperatureRange"
label="Temperature Range"
value={job.temperature_range}
section="job"
field="temperature_range"
updateSection={updateSection}
/>

<LookupSelect
listKey="sampleAvailability"
label="Sample Available"
value={job.sample_available}
section="job"
field="sample_available"
updateSection={updateSection}
/>

<LookupSelect
listKey="abrasiveness"
label="Abrasiveness"
value={job.abrasiveness}
section="job"
field="abrasiveness"
updateSection={updateSection}
/>

<LookupSelect
listKey="permitRequired"
label="Permit Required"
value={job.permit_required}
section="job"
field="permit_required"
updateSection={updateSection}
/>

<LookupSelect
listKey="flowability"
label="Flowability"
value={job.flowability}
section="job"
field="flowability"
updateSection={updateSection}
/>


</div>

</div>

)

}
