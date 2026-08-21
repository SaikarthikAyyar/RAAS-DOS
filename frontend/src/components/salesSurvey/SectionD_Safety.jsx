// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";


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

/>


<LookupSelect

listKey="yesNoUnknown"

label="Water Available?"

value={safety.water_available}

section="safety"

field="water_available"

updateSection={updateSection}

/>

<LookupSelect
    listKey="yesNoUnknown"
    label="Air Supply Available"
    value={safety.air_supply_available}
    section="safety"
    field="air_supply_available"
    updateSection={updateSection}
/>


<LookupSelect

listKey="yesNoUnknown"

label="Confined Space?"

value={safety.confined_space}

section="safety"

field="confined_space"

updateSection={updateSection}

/>


{/* ROW 2 */}

<LookupSelect

listKey="yesNoUnknown"

label="Ventilation Required?"

value={safety.ventilation_required}

section="safety"

field="ventilation_required"

updateSection={updateSection}

/>


<LookupSelect

listKey="yesNoUnknown"

label="Gas Testing Required?"

value={safety.gas_testing_required}

section="safety"

field="gas_testing_required"

updateSection={updateSection}

/>


<LookupSelect

listKey="ehsRestriction"

label="EHS Restriction"

value={safety.ehs_restriction}

section="safety"

field="ehs_restriction"

updateSection={updateSection}

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


