// ====================================
// IMPORTS
// ====================================

import {

debrisOptions,

phOptions,

pumpPowerOptions

}

from "../../data/salesSurveyOptions";


// ====================================
// COMPONENT
// ====================================

export default function SectionE_Pump({

surveyData,

updateSection

}){

const pump =

surveyData.pump || {};

return(

<div className="survey-card">


<div className="survey-header">

<h2>

E. Pump Selection Inputs

</h2>

<span>

Needed to reduce pump discussions

</span>

</div>


<div className="survey-grid">


<div className="survey-field">

<label>

Target Flow

</label>

<input/>

</div>


<div className="survey-field">

<label>

Suction Depth

</label>

<input/>

</div>


<div className="survey-field">

<label>

Discharge Distance

</label>

<input/>

</div>


<div className="survey-field">

<label>

Discharge Height

</label>

<input/>

</div>


<div className="survey-field">

<label>

Debris / Fibers Present?

</label>

<select>

{

debrisOptions.map(

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


<div className="survey-field">

<label>

pH / Corrosiveness

</label>

<select>

{

phOptions.map(

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


<div className="survey-field">

<label>

Temperature

</label>

<input/>

</div>


<div className="survey-field">

<label>

Power Source for Pump

</label>

<select>

{

pumpPowerOptions.map(

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

<FieldInput

label="Discharge Pit Dimension"

value={

pump.discharge_pit_dimension

|| ""

}

section="pump"

field="discharge_pit_dimension"

unit="m"

updateSection={updateSection}

/>


</div>

</div>

);

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