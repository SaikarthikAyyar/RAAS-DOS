// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";


// ====================================
// COMPONENT
// ====================================

export default function SectionD_Safety({

surveyData,

updateSection

}){


const safety =

surveyData.safety || {};


return(

<div className="survey-card">


<div className="survey-header">

<h2>

D. Support, Safety & Utilities

</h2>



</div>


<div className="survey-grid">


{/* ROW 1 */}

<LookupSelect

listKey="powerAvailable"

label="Power Available"

value={safety.power_available}

section="safety"

field="power_available"

updateSection={updateSection}

tooltip="What kind of power source is available on-site for equipment (e.g. grid, generator, none)."

/>


<LookupSelect

listKey="yesNoUnknown"

label="Water Available?"

value={safety.water_available}

section="safety"

field="water_available"

updateSection={updateSection}

tooltip="Whether a water supply is available on-site, if needed for the job."

/>

<LookupSelect
    listKey="yesNoUnknown"
    label="Air Supply Available"
    value={safety.air_supply_available}
    section="safety"
    field="air_supply_available"
    updateSection={updateSection}
    tooltip="Whether compressed air is available on-site, if needed for pneumatic tools."
/>


<LookupSelect

listKey="yesNoUnknown"

label="Confined Space?"

value={safety.confined_space}

section="safety"

field="confined_space"

updateSection={updateSection}

tooltip="Whether the work area qualifies as a confined space, which requires special safety procedures."

/>


{/* ROW 2 */}

<LookupSelect

listKey="yesNoUnknown"

label="Ventilation Required?"

value={safety.ventilation_required}

section="safety"

field="ventilation_required"

updateSection={updateSection}

tooltip="Whether forced ventilation is needed for the work area (common for confined spaces)."

/>


<LookupSelect

listKey="yesNoUnknown"

label="Gas Testing Required?"

value={safety.gas_testing_required}

section="safety"

field="gas_testing_required"

updateSection={updateSection}

tooltip="Whether atmospheric gas testing is required before entry, per site EHS rules."

/>


<LookupSelect

listKey="ehsRestriction"

label="EHS Restriction"

value={safety.ehs_restriction}

section="safety"

field="ehs_restriction"

updateSection={updateSection}

tooltip="Any environmental, health & safety restriction the customer's site imposes on this job."

/>


{/* ROW 3 */}

<FieldInput

label="Power Availability Distance (m)"

value={safety.power_distance}

section="safety"

field="power_distance"

unit="m"

type="number"

updateSection={updateSection}

tooltip="Distance from the nearest available power source to the work area, in metres."

/>


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

unit,

type,

updateSection,

tooltip

}){

return(

<div className="survey-field">

<label>

{label}
<FieldTooltip text={tooltip}/>

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


