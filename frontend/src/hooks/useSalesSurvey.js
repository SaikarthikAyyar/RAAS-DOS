// ====================================
// IMPORTS
// ====================================

import { useState } from "react";


// ====================================
// HOOK
// ====================================

export default function useSalesSurvey(){


const [

surveyData,

setSurveyData

]

= useState({

customer:{},

job:{},

geometry:{},

safety:{},

pump:{},

dewatering:{},

insights:{}

});


// ====================================
// UPDATE
// ====================================

const updateSection=(

section,

field,

value

)=>{

setSurveyData(

previous=>(

{

...previous,

[section]:{

...previous[section],

[field]:value

}

}

)

);

};


// ====================================
// REFERENCES
// ====================================

const geometry=

surveyData.geometry || {};


const job=

surveyData.job || {};


const safety=

surveyData.safety || {};


// ====================================
// SAFE NUMBERS
// ====================================

const length=

Number(

geometry.length_dia

) || 0;


const width=

Number(

geometry.width

) || 0;


const depth=

Number(

geometry.sludge_depth

) || 0;


const setupDistance=

Number(

geometry.setup_distance

) || 0;


const verticalLift=

Number(

geometry.vertical_lift

) || 0;


const hoseDistance=

Number(

geometry.hose_distance

) || 0;


// ====================================
// ESTIMATED VOLUME
// ====================================

let estimatedVolume=0;


if(

geometry.tank_type==="Cylindrical"

){

estimatedVolume=

Math.PI*

Math.pow(

length/2,

2

)*

depth;

}

else{

estimatedVolume=

length*

width*

depth;

}


estimatedVolume=

Number(

estimatedVolume.toFixed(

2

)

);


// ====================================
// OUTPUT
// ====================================

const averageOutput=

Number(

geometry.average_output

)

||15;


// ====================================
// DURATION
// ====================================

const totalDuration=

estimatedVolume>0

&&

averageOutput>0

?

(

estimatedVolume/

averageOutput

).toFixed(

1

)

:

0;


// ====================================
// EQUIPMENT REACH
// ====================================

const equipmentReach=

setupDistance+

verticalLift+

hoseDistance;


// ====================================
// PUMPABILITY
// ====================================

let pumpability=

"Easy";


if(

job.consistency==="Sticky"

||

job.consistency==="Hard settled"

){

pumpability=

"Difficult";

}


if(

job.consistency==="Abrasive"

||

job.consistency==="Fibrous"

){

pumpability=

"Very Difficult";

}


// ====================================
// RISK
// ====================================

let risk=

"Low";


if(

safety.confined_space==="Yes"

||

safety.gas_testing_required==="Yes"

){

risk=

"Medium";

}


if(

safety.ehs_restriction==="High"

||

safety.ehs_restriction==="Critical"

){

risk=

"High";

}


// ====================================
// MOBILISATION
// ====================================

let mobilisation=

"Single vehicle";


if(

estimatedVolume>150

){

mobilisation=

"Multi vehicle deployment";

}


if(

estimatedVolume>300

){

mobilisation=

"Large fleet mobilisation";

}


// ====================================
// PACKAGE
// ====================================

let packageName=

"Vacuum Loading";


if(

pumpability==="Difficult"

){

packageName=

"Vacuum + Agitator";

}


if(

pumpability==="Very Difficult"

){

packageName=

"Excavation + Vacuum";

}


// ====================================
// COMPLETENESS
// ====================================

const allValues=[

...Object.values(

surveyData.customer || {}

),

...Object.values(

surveyData.job || {}

),

...Object.values(

surveyData.geometry || {}

),

...Object.values(

surveyData.safety || {}

),

...Object.values(

surveyData.pump || {}

),

...Object.values(

surveyData.dewatering || {}

),

...Object.values(

surveyData.insights || {}

)

];


const filledFields=

allValues.filter(

value=>

value!==null

&&

value!==undefined

&&

value!==""

).length;


const totalFields=

45;


const completion=

Math.round(

(

filledFields/

totalFields

)*100

);


// ====================================
// METRICS
// ====================================

const metrics={

estimatedVolume,

averageOutput,

totalDuration,

equipmentReach,

mobilisation,

pumpability,

risk,

packageName,

completion

};


// ====================================
// RETURN
// ====================================

return{

surveyData,

setSurveyData,

updateSection,

metrics

};

}