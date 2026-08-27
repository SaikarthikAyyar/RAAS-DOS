// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";

import { FieldInput as SharedFieldInput } from "../shared/FormField";


// ====================================
// COMPONENT
// ====================================

export default function SectionE_Pump({

surveyData,

updateSection,

errors,

touched,

touchField,

submitAttempted

}){

const pump =

surveyData.pump || {};

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// matches the same convention already used in Sections B/C.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[`pump.${field}`] && (anyFieldTouched || submitAttempted);

}

return(

<div className="survey-card">


<div className="survey-header">

<h2>

E. Pump Selection Inputs

</h2>


</div>


<div className="survey-grid">


<SharedFieldInput
label="Target Flow (m³/hr)*"
value={pump.target_flow}
section="pump"
field="target_flow"
type="number"
updateSection={updateSection}
onBlur={()=>touchField("pump", "target_flow")}
error={fieldError("target_flow")}
errorMessage="Target Flow is required."
tooltip="The desired rate of material removal, in cubic metres per hour."
/>


<SharedFieldInput
label="Suction Depth (m)*"
value={pump.suction_depth}
section="pump"
field="suction_depth"
type="number"
updateSection={updateSection}
onBlur={()=>touchField("pump", "suction_depth")}
error={fieldError("suction_depth")}
errorMessage="Suction Depth is required."
tooltip="How deep the pump needs to draw material from, in metres."
/>


<FieldInput
label="Discharge Distance (m)"
value={pump.discharge_distance}
section="pump"
field="discharge_distance"
unit="m"
type="number"
updateSection={updateSection}
tooltip="The horizontal distance from the pump to the discharge point, in metres."
/>


<FieldInput
label="Discharge Height (m)"
value={pump.discharge_height}
section="pump"
field="discharge_height"
unit="m"
type="number"
updateSection={updateSection}
tooltip="The vertical height the pump needs to lift material to the discharge point, in metres."
/>


<LookupSelect
listKey="pumpPower"
label="Power Source for Pump"
value={pump.pump_power_source}
section="pump"
field="pump_power_source"
updateSection={updateSection}
tooltip="What powers the pump on-site (e.g. diesel, electric, hydraulic)."
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

tooltip="The size of the pit or sump the material will be discharged into, if applicable."

/>

<LookupSelect
    listKey="dischargeMedium"
    label="Discharge Medium"
    value={pump.discharge_medium}
    section="pump"
    field="discharge_medium"
    updateSection={updateSection}
    tooltip="Where the pumped material is discharged to (e.g. tanker, drain, holding pit)."
/>

<LookupSelect
listKey="disposalResponsibility"
label="Disposal Responsibility"
value={pump.disposal_responsibility}
section="pump"
field="disposal_responsibility"
updateSection={updateSection}
tooltip="Who is responsible for disposing of the removed material - RAAS-DOS or the customer."
/>

<FieldInput
label="Discharge Point Distance (m)"
value={pump.discharge_point_distance}
section="pump"
field="discharge_point_distance"
unit="m"
type="number"
updateSection={updateSection}
tooltip="The total distance from the pump to the final discharge point, in metres."
/>

<FieldInput
label="Hose Route Bends"
value={pump.hose_route_bends}
section="pump"
field="hose_route_bends"
type="number"
updateSection={updateSection}
tooltip="The number of bends/turns in the hose route - more bends reduce flow efficiency."
/>

<LookupSelect
listKey="pumpRisk"
label="Pump Risk"
value={pump.pump_risk}
section="pump"
field="pump_risk"
updateSection={updateSection}
tooltip="Any elevated risk associated with pumping this material (e.g. clogging, hazardous fumes)."
/>

<FieldInput
label="Effective Work Hours/Day"
value={pump.effective_work_hours}
section="pump"
field="effective_work_hours"
unit="hrs/day"
type="number"
updateSection={updateSection}
tooltip="The realistic number of productive working hours available per day on-site."
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

