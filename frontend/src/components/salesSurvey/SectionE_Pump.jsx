// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";


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
type="number"
updateSection={updateSection}
/>


<FieldInput
label="Suction Depth (m)"
value={pump.suction_depth}
section="pump"
field="suction_depth"
unit="m"
type="number"
updateSection={updateSection}
/>


<FieldInput
label="Discharge Distance (m)"
value={pump.discharge_distance}
section="pump"
field="discharge_distance"
unit="m"
type="number"
updateSection={updateSection}
/>


<FieldInput
label="Discharge Height (m)"
value={pump.discharge_height}
section="pump"
field="discharge_height"
unit="m"
type="number"
updateSection={updateSection}
/>


<LookupSelect
listKey="pumpPower"
label="Power Source for Pump"
value={pump.pump_power_source}
section="pump"
field="pump_power_source"
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

<LookupSelect
    listKey="dischargeMedium"
    label="Discharge Medium"
    value={pump.discharge_medium}
    section="pump"
    field="discharge_medium"
    updateSection={updateSection}
/>

<LookupSelect
listKey="disposalResponsibility"
label="Disposal Responsibility"
value={pump.disposal_responsibility}
section="pump"
field="disposal_responsibility"
updateSection={updateSection}
/>

<FieldInput
label="Discharge Point Distance"
value={pump.discharge_point_distance}
section="pump"
field="discharge_point_distance"
unit="m"
type="number"
updateSection={updateSection}
/>

<FieldInput
label="Hose Route Bends"
value={pump.hose_route_bends}
section="pump"
field="hose_route_bends"
type="number"
updateSection={updateSection}
/>

<LookupSelect
listKey="pumpRisk"
label="Pump Risk"
value={pump.pump_risk}
section="pump"
field="pump_risk"
updateSection={updateSection}
/>

<FieldInput
label="Effective Work Hours/Day"
value={pump.effective_work_hours}
section="pump"
field="effective_work_hours"
unit="hrs/day"
type="number"
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

