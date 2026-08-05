// ====================================
// IMPORTS
// ====================================

import {

debrisOptions,

phOptions,

pumpPowerOptions,
dischargeMediumOptions,

disposalRouteOptions,
disposalResponsibilityOptions,
pumpRiskOptions

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


<FieldInput
label="Target Flow (m³/hr)"
value={pump.target_flow}
section="pump"
field="target_flow"
unit="m³/hr"
updateSection={updateSection}
/>


<FieldInput
label="Suction Depth (m)"
value={pump.suction_depth}
section="pump"
field="suction_depth"
unit="m"
updateSection={updateSection}
/>


<FieldInput
label="Discharge Distance (m)"
value={pump.discharge_distance}
section="pump"
field="discharge_distance"
unit="m"
updateSection={updateSection}
/>


<FieldInput
label="Discharge Height (m)"
value={pump.discharge_height}
section="pump"
field="discharge_height"
unit="m"
updateSection={updateSection}
/>


<FieldSelect
label="Debris / Fibers Present?"
value={pump.debris_present}
section="pump"
field="debris_present"
options={debrisOptions}
updateSection={updateSection}
/>


<FieldSelect
label="pH / Corrosiveness"
value={pump.ph_condition}
section="pump"
field="ph_condition"
options={phOptions}
updateSection={updateSection}
/>


<FieldSelect
label="Power Source for Pump"
value={pump.pump_power_source}
section="pump"
field="pump_power_source"
options={pumpPowerOptions}
updateSection={updateSection}
/>

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

<FieldSelect
label="Pump Risk"
value={pump.pump_risk}
section="pump"
field="pump_risk"
options={pumpRiskOptions}
updateSection={updateSection}
/>

<FieldInput
label="Effective Work Hours/Day"
value={pump.effective_work_hours}
section="pump"
field="effective_work_hours"
unit="hrs/day"
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
