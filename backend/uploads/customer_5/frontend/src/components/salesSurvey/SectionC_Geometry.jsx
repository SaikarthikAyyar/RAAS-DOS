// ====================================
// IMPORTS
// ====================================

import {

accessTypeOptions,

tankTypeOptions

}

from "../../data/salesSurveyOptions";


// ====================================
// COMPONENT
// ====================================

export default function SectionC_Geometry({

surveyData,

updateSection,

metrics

}){


const geometry =

surveyData.geometry || {};


const {

estimatedVolume = 0,

averageOutput = 0,

totalDuration = 0,

equipmentReach = 0,

mobilisation = "",

packageName = ""

}

=

metrics || {};


return(

<div className="survey-card">


<div className="survey-header">

<h2>

C. Geometry, Access & Setup

</h2>

<span>

Machine + method feasibility

</span>

</div>


<div className="survey-grid">


{/* ROW 1 */}

<FieldSelect

label="Tank Type"

value={geometry.tank_type}

section="geometry"

field="tank_type"

options={tankTypeOptions}

updateSection={updateSection}

/>


<FieldInput

label="Length / Dia"

value={geometry.length_dia}

section="geometry"

field="length_dia"

unit="m"

updateSection={updateSection}

/>


<FieldInput

label="Width"

value={geometry.width}

section="geometry"

field="width"

unit="m"

updateSection={updateSection}

/>


<FieldInput

label="Sludge Depth"

value={geometry.sludge_depth}

section="geometry"

field="sludge_depth"

unit="m"

updateSection={updateSection}

/>


{/* ROW 2 */}

<FieldSelect

label="Access Type"

value={geometry.access_type}

section="geometry"

field="access_type"

options={accessTypeOptions}

updateSection={updateSection}

/>


<FieldReadOnly

label="Estimated Volume"

value={estimatedVolume}

unit="m³"

/>


<FieldInput

label="Average Output"

value={geometry.average_output}

section="geometry"

field="average_output"

unit="m³/hr"

updateSection={updateSection}

/>


{/* ROW 3 */}

<FieldInput

label="Opening Length/Dia"

value={geometry.opening_length}

section="geometry"

field="opening_length"

unit="mm"

updateSection={updateSection}

/>


<FieldInput

label="Opening Width"

value={geometry.opening_width}

section="geometry"

field="opening_width"

unit="mm"

updateSection={updateSection}

/>


<FieldInput

label="Height from Ground"

value={geometry.height_from_ground}

section="geometry"

field="height_from_ground"

unit="m"

updateSection={updateSection}

/>


{/* ROW 4 */}

<FieldInput

label="Drop to Floor / Sludge"

value={geometry.drop_to_floor}

section="geometry"

field="drop_to_floor"

unit="m"

updateSection={updateSection}

/>


<FieldInput

label="Setup Distance"

value={geometry.setup_distance}

section="geometry"

field="setup_distance"

unit="m"

updateSection={updateSection}

/>


<FieldInput

label="Vertical Lift"

value={geometry.vertical_lift}

section="geometry"

field="vertical_lift"

unit="m"

updateSection={updateSection}

/>


{/* ROW 5 */}

<FieldInput

label="Hose Distance"

value={geometry.hose_distance}

section="geometry"

field="hose_distance"

unit="m"

updateSection={updateSection}

/>


<FieldInput

label="Access Path Width"

value={geometry.access_path_width}

section="geometry"

field="access_path_width"

unit="m"

placeholder="e.g., 2.5"

updateSection={updateSection}

/>


<FieldSelect

label="Equipment Nearby Possible?"

value={geometry.equipment_nearby}

section="geometry"

field="equipment_nearby"

options={[

"Yes, within 10 m",

"Yes, within 20 m",

"No",

"Unknown"

]}

updateSection={updateSection}

/>


{/* ROW 6 */}

<FieldSelect

label="Scaffolding Needed?"

value={geometry.scaffolding_needed}

section="geometry"

field="scaffolding_needed"

options={[

"Yes",

"No"

]}

updateSection={updateSection}

/>


<FieldSelect

label="Crane/Hydra Available?"

value={geometry.crane_available}

section="geometry"

field="crane_available"

options={[

"Yes",

"No",

"Unknown"

]}

updateSection={updateSection}

/>


{/* COMPUTED ROW */}

<FieldReadOnly

label="Equipment Reach"

value={equipmentReach}

unit="m"

/>


<FieldReadOnly

label="Total Duration"

value={totalDuration}

unit="hrs"

/>


<FieldReadOnly

label="Mobilisation Logic"

value={mobilisation}

/>


<FieldReadOnly

label="Recommended Package"

value={packageName}

/>


</div>

</div>

)

}


// ====================================
// INPUT FIELD
// ====================================

function FieldInput({

label,

value,

section,

field,

unit,

placeholder,

updateSection

}){


return(

<div className="survey-field">


<label>

{label}

</label>


<input

placeholder={placeholder || ""}

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
// SELECT FIELD
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


// ====================================
// READ ONLY FIELD
// ====================================

function FieldReadOnly({

label,

value,

unit

}){


return(

<div className="survey-field">


<label>

{label}

</label>


<input

readOnly

value={value}

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