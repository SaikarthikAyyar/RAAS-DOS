// ====================================
// IMPORTS
// ====================================

import "../components/operations/Operations.css";

import useOpsSelector

from "../hooks/useOpsSelector";

import OpsInputs

from "../components/operations/OpsInputs";

import OpsDecision

from "../components/operations/OpsDecision";

import OpsDaysManpower

from "../components/operations/OpsDaysManpower";

import OpsActions

from "../components/operations/OpsActions";


// ====================================
// COMPONENT
// ====================================

export default function OpsSelector(){

const{

surveys,

selectedSurvey,

setSelectedSurvey,

opsData,

saveOps

}=

useOpsSelector();

return(

<div className="ops-selector-page">

<div className="ops-page-header">

<h1>

Ops Selector

</h1>

<p>

This screen pulls survey inputs and gives machine,
pump, accessories, manpower, days and approval gate
in one place.

</p>

</div>


<div className="ops-selector-bar">

<select

value={selectedSurvey}

onChange={(e)=>

setSelectedSurvey(

e.target.value

)

}

className="ops-survey-select"

>

<option value="">

Select Sales Survey

</option>

{

surveys.map(

survey=>(

<option

key={survey.id}

value={survey.id}

>

{survey.label}

</option>

)

)

}

</select>

</div>


<div className="ops-grid">

<OpsInputs

inputs={opsData.inputs}

/>

<OpsDecision

opsData={opsData}

/>

</div>


<div className="ops-grid">

<OpsDaysManpower

opsData={opsData}

/>

<OpsActions

saveOps={saveOps}

/>

</div>

</div>

);

}