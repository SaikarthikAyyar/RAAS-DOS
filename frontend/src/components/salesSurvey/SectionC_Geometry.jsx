// ====================================
// IMPORTS
// ====================================

import {

accessTypeOptions,

tankTypeOptions,
accessSupportOptions,
customerSupportOptions,
yesNoUnknown,
tankLocationOptions,
setupComplexityOptions

}

from "../../data/salesSurveyOptions";


// ====================================
// COMPONENT
// ====================================

export default function SectionC_Geometry({

surveyData,

updateSection,

metrics,

errors,

touched,

touchField,

submitAttempted

}){


const geometry =

surveyData.geometry || {};

function fieldError(field){

    return errors?.[`geometry.${field}`] && (touched?.[`geometry.${field}`] || submitAttempted);

}


const {

estimatedVolume = 0,



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


</div>


<div className="survey-grid">


{/* ROW 1 */}

<FieldSelect

label="Tank Type*"

value={geometry.tank_type}

section="geometry"

field="tank_type"

options={tankTypeOptions}

updateSection={updateSection}

onBlur={()=>touchField("geometry", "tank_type")}

error={fieldError("tank_type")}

errorMessage="Tank Type is required."

/>


<FieldInput

label="Length / Dia (m)*"

value={geometry.length_dia}

section="geometry"

field="length_dia"

unit="m"

type="number"

updateSection={updateSection}

onBlur={()=>touchField("geometry", "length_dia")}

error={fieldError("length_dia")}

errorMessage="Length / Dia is required."

/>


<FieldInput

label="Width (m)*"

value={geometry.width}

section="geometry"

field="width"

unit="m"

type="number"

updateSection={updateSection}

onBlur={()=>touchField("geometry", "width")}

error={fieldError("width")}

errorMessage="Width is required."

/>


<FieldInput

label="Sludge Depth (m)*"

value={geometry.sludge_depth}

section="geometry"

field="sludge_depth"

unit="m"

type="number"

updateSection={updateSection}

onBlur={()=>touchField("geometry", "sludge_depth")}

error={fieldError("sludge_depth")}

errorMessage="Sludge Depth is required."

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

label="Estimated Volume (m³)"

value={estimatedVolume}

unit="m³"

/>


<FieldInput

label="Average Output (m³/hr)"

value={geometry.average_output}

section="geometry"

field="average_output"

unit="m³/hr"

type="number"

updateSection={updateSection}

/>


{/* ROW 3 */}

<FieldInput

label="Opening Length/Dia (mm)"

value={geometry.opening_length}

section="geometry"

field="opening_length"

unit="mm"

type="number"

updateSection={updateSection}

/>


<FieldInput

label="Opening Width (mm)"

value={geometry.opening_width}

section="geometry"

field="opening_width"

unit="mm"

type="number"

updateSection={updateSection}

/>


<FieldInput

label="Height from Ground (m)"

value={geometry.height_from_ground}

section="geometry"

field="height_from_ground"

unit="m"

type="number"

updateSection={updateSection}

/>


{/* ROW 4 */}

<FieldInput

label="Drop to Floor / Sludge (m)"

value={geometry.drop_to_floor}

section="geometry"

field="drop_to_floor"

unit="m"

type="number"

updateSection={updateSection}

/>


<FieldInput

label="Setup Distance (m)"

value={geometry.setup_distance}

section="geometry"

field="setup_distance"

unit="m"

type="number"

updateSection={updateSection}

/>


<FieldInput

label="Vertical Lift (m)"

value={geometry.vertical_lift}

section="geometry"

field="vertical_lift"

unit="m"

type="number"

updateSection={updateSection}

/>


{/* ROW 5 */}

<FieldInput

label="Hose Distance (m)"

value={geometry.hose_distance}

section="geometry"

field="hose_distance"

unit="m"

type="number"

updateSection={updateSection}

/>


<FieldInput

label="Access Path Width (m)"

value={geometry.access_path_width}

section="geometry"

field="access_path_width"

unit="m"

type="number"

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
label="Access Support"
value={geometry.access_support}
section="geometry"
field="access_support"
options={accessSupportOptions}
updateSection={updateSection}
/>


<FieldSelect
label="Customer Support Equipment"
value={geometry.customer_support}
section="geometry"
field="customer_support"
options={customerSupportOptions}
updateSection={updateSection}
/>


{/* ROW 7 */}

<FieldSelect
label="Scaffolding Needed?"
value={geometry.scaffolding_needed}
section="geometry"
field="scaffolding_needed"
options={yesNoUnknown}
updateSection={updateSection}
/>

<FieldSelect
label="Crane Available?"
value={geometry.crane_available}
section="geometry"
field="crane_available"
options={yesNoUnknown}
updateSection={updateSection}
/>

<FieldInput
label="Opening Height (mm)"
value={geometry.opening_height}
section="geometry"
field="opening_height"
unit="mm"
type="number"
updateSection={updateSection}
/>


{/* COMPUTED ROW */}

<FieldReadOnly

label="Equipment Reach (m)"

value={equipmentReach}

unit="m"

/>


<FieldReadOnly

label="Total Duration (hrs)"

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

<FieldSelect
label="Location of Tank"
value={geometry.tank_location}
section="geometry"
field="tank_location"
options={tankLocationOptions}
updateSection={updateSection}
/>

<FieldSelect
label="Setup Complexity"
value={geometry.setup_complexity}
section="geometry"
field="setup_complexity"
options={setupComplexityOptions}
updateSection={updateSection}
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

updateSection,

onBlur,

error,

errorMessage,

type

}){


return(

<div className={error ? "survey-field field-error" : "survey-field"}>


<label>

{label}

</label>


<input

type={type || "text"}

placeholder={placeholder || ""}

value={value || ""}

onChange={(e)=>

updateSection(

section,

field,

e.target.value

)

}

onBlur={onBlur}

/>


{
    error && errorMessage && (
        <span className="field-error-message">{errorMessage}</span>
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

updateSection,

onBlur,

error,

errorMessage

}){


return(

<div className={error ? "survey-field field-error" : "survey-field"}>


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

onBlur={onBlur}

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


{
    error && errorMessage && (
        <span className="field-error-message">{errorMessage}</span>
    )
}


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


</div>

)

}
