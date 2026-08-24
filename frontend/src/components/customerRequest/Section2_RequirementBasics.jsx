import {

FieldInput

}

from "../shared/FormField";

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";


// ====================================
// COMPONENT
// Merged "New site" (Division/Department, matches the wireframe's
// #newSiteFields block minus Plant, which lives here too now via
// Plant / Site Location) with "Requirement Basics" into one section,
// per the 2026-08-04 restructure.
// ====================================

export default function Section2_RequirementBasics({

customerData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){

const customer=

customerData.customer || {};

const requirement=

customerData.requirement || {};

const hasExistingAsset = Boolean(customer.existing_asset_id);

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// moving on to a later field is exactly the signal that an earlier
// required field was skipped.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[field] && (anyFieldTouched || submitAttempted);

}


return(

<div className="survey-card">


<div className="survey-header">

<h2>

2. New Site & Requirements

</h2>

<span>

Customer can answer from observation

</span>

</div>


<div className="survey-grid">


<FieldInput

label="*Plant / Site Location"

value={customer.plant_site_location}

section="customer"

field="plant_site_location"

updateSection={updateSection}

onBlur={()=>touchField("customer", "plant_site_location")}

error={errors?.plant_site_location && (touched?.["customer.plant_site_location"] || submitAttempted)}

errorMessage="Plant / Site Location is required."

tooltip="The specific plant or site address where the job will take place."

/>

{

!hasExistingAsset && (

<>

<div className="survey-field">

<label>

Division / Subsidiary
<FieldTooltip text="The customer's internal division or subsidiary this site belongs to, if applicable."/>

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
<FieldTooltip text="The department at the site responsible for this job, if applicable."/>

</label>

<input

    value={customer.department || ""}

    placeholder="e.g. Tin Plant (leave blank for 'General')"

    onChange={e=>updateSection("customer", "department", e.target.value)}

/>

</div>

</>

)

}

<LookupSelect

listKey="materialCategory"

label="Material seen at site"

value={requirement.observed_material}

section="requirement"

field="observed_material"

updateSection={updateSection}

tooltip="The type of material observed at the site (e.g. sludge, slurry, ash) - a first-pass estimate before the formal survey."

/>


<LookupSelect

listKey="accessType"

label="Access opening type"

value={requirement.access_opening_type}

section="requirement"

field="access_opening_type"

updateSection={updateSection}

tooltip="How the tank/pit/vessel can be accessed (e.g. manhole, open top) - affects which equipment can be used."

/>


<LookupSelect

listKey="equipmentNearby"

label="Equipment placement nearby?"

value={requirement.can_place_equipment_nearby}

section="requirement"

field="can_place_equipment_nearby"

updateSection={updateSection}

tooltip="Whether there's space to position cleaning equipment near the access point."

/>

<FieldInput
    label="Cleaning Date"
    type="date"
    value={requirement.cleaning_date}
    section="requirement"
    field="cleaning_date"
    updateSection={updateSection}
    tooltip="The date this cleaning job is expected to be carried out."
/>

<LookupSelect
    listKey="cleaningFrequency"
    label="*Cleaning Frequency"
    value={requirement.cleaning_frequency}
    section="requirement"
    field="cleaning_frequency"
    updateSection={updateSection}
    onBlur={()=>touchField("requirement", "cleaning_frequency")}
    error={fieldError("cleaning_frequency")}
    errorMessage="Cleaning Frequency is required."
    tooltip="How often this site needs cleaning (one-time, monthly, etc.) - helps plan recurring work."
/>

{

!hasExistingAsset && (

<>

<FieldInput

label="*Tank Name"

value={requirement.asset_name}

section="requirement"

field="asset_name"

updateSection={updateSection}

onBlur={()=>touchField("requirement", "asset_name")}

error={fieldError("asset_name")}

errorMessage="Tank Name is required to create a new site/asset record."

tooltip="A name identifying this specific tank/asset, used to track it in Business Masters."

/>

<LookupSelect

listKey="assetType"

label="Tank Type"

value={requirement.asset_type}

section="requirement"

field="asset_type"

updateSection={updateSection}

tooltip="The shape/construction of the tank (e.g. cuboidal, cylindrical)."

/>

</>

)

}

<div

className="survey-field"

style={{

gridColumn:"1 / span 3"

}}

>

<label>

Customer problem / pain point
<FieldTooltip text="A brief description, in the customer's own words, of the problem they want solved."/>

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
