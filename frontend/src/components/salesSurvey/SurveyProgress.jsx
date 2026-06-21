// ====================================
// SURVEY HEADER
// ====================================

export default function SurveyProgress({

metrics = {}

}){


const {

estimatedVolume = 0,

averageOutput = 0,

totalDuration = 0,

equipmentReach = 0,

mobilisation = "Unknown",

pumpability = "Unknown",

risk = "Low",

packageName = "Pending"

}

= metrics;


return(

<div className="survey-progress-container">


<div className="survey-progress-left">


<div className="survey-sheet-title">

WORKBOOK SHEET: 2 SALES SURVEY

</div>


<h1>

Complete Site Survey

</h1>


<p>

Complete all site survey categories required

for quotation generation and operations planning.

</p>


<div

style={{

display:"flex",

gap:"20px",

marginTop:"30px",

flexWrap:"wrap"

}}

>


<Card

title="Estimated Volume"

value={`${estimatedVolume.toFixed(2)} m³`}

/>


<Card

title="Average Output"

value={`${averageOutput} m³/hr`}

/>


<Card

title="Total Duration"

value={`${totalDuration} hrs`}

/>


<Card

title="Equipment Reach"

value={`${equipmentReach} m`}

/>


<Card

title="Mobilisation"

value={mobilisation}

/>


<Card

title="Pumpability"

value={pumpability}

/>


<Card

title="Risk"

value={risk}

/>


<Card

title="Recommended Package"

value={packageName}

/>


</div>


</div>


<div className="survey-completion-card">


<div>

Completeness:

</div>


<strong>

86%

</strong>


</div>


</div>

)

}


// ====================================
// CARD
// ====================================

function Card({

title,

value

}){


return(

<div

style={{

width:"180px",

background:"white",

padding:"20px",

borderRadius:"20px",

border:"1px solid #dfe4ec"

}}

>


<div>

{title}

</div>


<h3>

{value}

</h3>


</div>

)

}