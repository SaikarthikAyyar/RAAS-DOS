// ====================================
// IMPORTS
// ====================================

import {

debrisOptions,

phOptions,

pumpPowerOptions,
dischargeMediumOptions,

disposalRouteOptions,
disposalResponsibilityOptions

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

<FieldSelect
    label="Discharge Medium"
    value={pump.discharge_medium}
    section="pump"
    field="discharge_medium"
    options={dischargeMediumOptions}
    updateSection={updateSection}
/>

<FieldSelect
label="Disposal Route"
value={pump.disposal_route}
section="pump"
field="disposal_route"
options={disposalRouteOptions}
updateSection={updateSection}
/>

<FieldSelect
label="Disposal Responsibility"
value={pump.disposal_responsibility}
section="pump"
field="disposal_responsibility"
options={disposalResponsibilityOptions}
updateSection={updateSection}
/>

<FieldInput
label="Discharge Point Distance"
value={pump.discharge_point_distance}
section="pump"
field="discharge_point_distance"
unit="m"
updateSection={updateSection}
/>

<FieldInput
label="Hose Route Bends"
value={pump.hose_route_bends}
section="pump"
field="hose_route_bends"
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

            <label>{label}</label>

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

                {options.map(item=>(
                    <option
                        key={item}
                        value={item}
                    >
                        {item}
                    </option>
                ))}

            </select>

        </div>

    )

}