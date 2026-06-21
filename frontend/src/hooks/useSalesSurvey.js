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
// UPDATE SECTION
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
// ESTIMATED VOLUME
// ====================================

let estimatedVolume=0;


if(

geometry.tank_type==="Cylindrical"

){

estimatedVolume=

Math.PI*

Math.pow(

Number(

geometry.length_dia

)/2,

2

)*

Number(

geometry.sludge_depth

);

}

else{

estimatedVolume=

Number(

geometry.length_dia

)*

Number(

geometry.width

)*

Number(

geometry.sludge_depth

);

}


estimatedVolume=

Number(

estimatedVolume.toFixed(

2

)

);


// ====================================
// AVERAGE OUTPUT
// ====================================

const averageOutput=

Number(

geometry.average_output

)

|| 15;


// ====================================
// TOTAL DURATION
// ====================================

const totalDuration=

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

(

Number(

geometry.setup_distance

)

+

Number(

geometry.vertical_lift

)

+

Number(

geometry.hose_distance

)

)

||0;


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

packageName

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