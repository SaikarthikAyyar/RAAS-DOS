// ====================================
// IMPORTS
// ====================================

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";


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

// Once the user has interacted with ANY field on the form (not just
// this one), a still-empty compulsory field starts showing its error -
// moving on to a later field is exactly the signal that an earlier
// required field was skipped.
const anyFieldTouched = Object.keys(touched || {}).length > 0;

function fieldError(field){

    return errors?.[`geometry.${field}`] && (anyFieldTouched || submitAttempted);

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

<LookupSelect

listKey="geometryTankType"

label="Tank Type*"

value={geometry.tank_type}

section="geometry"

field="tank_type"

updateSection={updateSection}

onBlur={()=>touchField("geometry", "tank_type")}

error={fieldError("tank_type")}

errorMessage="Tank Type is required."

tooltip="The shape/construction of the tank or vessel being surveyed."

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

tooltip="The tank's length (rectangular) or diameter (round), in metres."

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

tooltip="The tank's width, in metres (leave the same as Length/Dia for a round tank)."

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

tooltip="How deep the sludge/material sits in the tank, in metres."

/>


{/* ROW 2 */}

<LookupSelect

listKey="accessType"

label="Access Type"

value={geometry.access_type}

section="geometry"

field="access_type"

updateSection={updateSection}

tooltip="How the machine/hose can get into the tank (e.g. manhole, open top, side entry)."

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

tooltip="The expected rate at which material can be removed, in cubic metres per hour."

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

tooltip="The length or diameter of the access opening, in millimetres."

/>


<FieldInput

label="Opening Width (mm)"

value={geometry.opening_width}

section="geometry"

field="opening_width"

unit="mm"

type="number"

updateSection={updateSection}

tooltip="The width of the access opening, in millimetres."

/>


<FieldInput

label="Height from Ground (m)"

value={geometry.height_from_ground}

section="geometry"

field="height_from_ground"

unit="m"

type="number"

updateSection={updateSection}

tooltip="The height of the access opening above ground level, in metres."

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

tooltip="The vertical distance from the access opening down to the tank floor or sludge surface, in metres."

/>


<FieldInput

label="Vertical Lift (m)"

value={geometry.vertical_lift}

section="geometry"

field="vertical_lift"

unit="m"

type="number"

updateSection={updateSection}

tooltip="The height the pump/hose needs to lift material to reach the discharge point, in metres."

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

tooltip="The total hose run length needed from the pump to the discharge point, in metres."

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

tooltip="The width of the path equipment must travel to reach the tank, in metres."

/>


<LookupSelect

listKey="equipmentNearby"

label="Equipment Nearby Possible?"

value={geometry.equipment_nearby}

section="geometry"

field="equipment_nearby"

updateSection={updateSection}

tooltip="Whether there's enough clear space to position cleaning equipment close to the access point."

/>


{/* ROW 6 */}

<LookupSelect
listKey="accessSupport"
label="Access Support"
value={geometry.access_support}
section="geometry"
field="access_support"
updateSection={updateSection}
tooltip="What extra support (ladder, platform, scaffolding) is available to help reach the access point."
/>


<LookupSelect
listKey="customerSupport"
label="Customer Support Equipment"
value={geometry.customer_support}
section="geometry"
field="customer_support"
updateSection={updateSection}
tooltip="Equipment the customer can provide on-site to assist the job (e.g. forklift, generator)."
/>


{/* ROW 7 */}

<LookupSelect
listKey="yesNoUnknown"
label="Scaffolding Needed?"
value={geometry.scaffolding_needed}
section="geometry"
field="scaffolding_needed"
updateSection={updateSection}
tooltip="Whether scaffolding is needed to safely reach the access point."
/>

<LookupSelect
listKey="yesNoUnknown"
label="Crane Available?"
value={geometry.crane_available}
section="geometry"
field="crane_available"
updateSection={updateSection}
tooltip="Whether a crane is available on-site, needed for heavy equipment or awkward access."
/>

<FieldInput
label="Opening Height (mm)"
value={geometry.opening_height}
section="geometry"
field="opening_height"
unit="mm"
type="number"
updateSection={updateSection}
tooltip="The vertical clearance of the access opening, in millimetres."
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

<LookupSelect
listKey="tankLocation"
label="Location of Tank"
value={geometry.tank_location}
section="geometry"
field="tank_location"
updateSection={updateSection}
tooltip="Whether the tank is overhead or underground - affects rigging and access planning."
/>

<LookupSelect
listKey="setupComplexity"
label="Setup Complexity"
value={geometry.setup_complexity}
section="geometry"
field="setup_complexity"
updateSection={updateSection}
tooltip="An overall estimate of how difficult it will be to set up equipment for this job."
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

type,

tooltip

}){


return(

<div className={error ? "survey-field field-error" : "survey-field"}>


<label>

{label}
<FieldTooltip text={tooltip}/>

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
