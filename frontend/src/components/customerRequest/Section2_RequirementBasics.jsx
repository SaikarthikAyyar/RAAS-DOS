import {

materialCategories,

accessTypeOptions,

assetTypeOptions

}

from "../../data/salesSurveyOptions";

import {

FieldInput,

FieldSelect

}

from "../shared/FormField";


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

function fieldError(field){

    return errors?.[field] && (touched?.[`requirement.${field}`] || submitAttempted);

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

/>

{

!hasExistingAsset && (

<>

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

</>

)

}

<FieldSelect

label="Material seen at site"

value={requirement.observed_material}

section="requirement"

field="observed_material"

options={materialCategories}

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

<FieldInput
    label="*Cleaning Date"
    type="date"
    value={requirement.cleaning_date}
    section="requirement"
    field="cleaning_date"
    updateSection={updateSection}
    onBlur={()=>touchField("requirement", "cleaning_date")}
    error={fieldError("cleaning_date")}
    errorMessage="Cleaning Date is required."
/>

<FieldSelect
    label="*Cleaning Frequency"
    value={requirement.cleaning_frequency}
    section="requirement"
    field="cleaning_frequency"
    options={[
        "One Time",
        "Weekly",
        "Monthly",
        "Quarterly",
        "Half Yearly",
        "Yearly"
    ]}
    updateSection={updateSection}
    onBlur={()=>touchField("requirement", "cleaning_frequency")}
    error={fieldError("cleaning_frequency")}
    errorMessage="Cleaning Frequency is required."
/>

{

!hasExistingAsset && (

<>

<FieldInput

label="Asset Name"

value={requirement.asset_name}

section="requirement"

field="asset_name"

updateSection={updateSection}

/>

<FieldSelect

label="Asset Type"

value={requirement.asset_type}

section="requirement"

field="asset_type"

options={assetTypeOptions}

updateSection={updateSection}

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
