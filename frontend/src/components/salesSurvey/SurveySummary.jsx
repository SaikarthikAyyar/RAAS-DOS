// ====================================
// COMPONENT
// ====================================

export default function SurveySummary({

metrics = {},

completion = 0

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

=

metrics;


return(

<div>


<div

style={{

display:"flex",

gap:"20px",

marginTop:"40px",

marginBottom:"40px",

flexWrap:"wrap",

alignItems:"flex-start"

}}

>


<Card

title="Estimated Volume"

value={`${estimatedVolume} m³`}

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


<div className="survey-completion-card">


<div>

Completeness:

</div>


<strong>

{completion}%

</strong>


</div>


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