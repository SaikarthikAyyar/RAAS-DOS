// ====================================
// IMPORTS
// ====================================

import {

yesNoUnknown

}

from "../../data/salesSurveyOptions";


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

<FieldSelect

label="Power Available"

value={safety.power_available}

section="safety"

field="power_available"

options={[

"230V 1PH",

"415V 3PH",

"Generator Required",

"Hydraulic Powerpack",

"Unknown"

]}

updateSection={updateSection}

/>


<FieldSelect

label="Water Available?"

value={safety.water_available}

section="safety"

field="water_available"

options={yesNoUnknown}

updateSection={updateSection}

/>

<FieldSelect
    label="Air Supply Available"
    value={safety.air_supply_available}
    section="safety"
    field="air_supply_available"
    options={yesNoUnknown}
    updateSection={updateSection}
/>


<FieldSelect

label="Confined Space?"

value={safety.confined_space}

section="safety"

field="confined_space"

options={yesNoUnknown}

updateSection={updateSection}

/>


{/* ROW 2 */}

<FieldSelect

label="Ventilation Required?"

value={safety.ventilation_required}

section="safety"

field="ventilation_required"

options={yesNoUnknown}

updateSection={updateSection}

/>


<FieldSelect

label="Gas Testing Required?"

value={safety.gas_testing_required}

section="safety"

field="gas_testing_required"

options={yesNoUnknown}

updateSection={updateSection}

/>


<FieldSelect

label="EHS Restriction"

value={safety.ehs_restriction}

section="safety"

field="ehs_restriction"

options={[

"Low",

"Medium",

"High",

"Critical"

]}

updateSection={updateSection}

/>


{/* ROW 3 */}

<FieldInput

label="Power Availability Distance"

value={safety.power_distance}

section="safety"

field="power_distance"

unit="m"

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

{

unit && (

<div>

{unit}

</div>

)

}

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