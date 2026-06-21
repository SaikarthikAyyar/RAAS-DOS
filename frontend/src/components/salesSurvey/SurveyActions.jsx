// ====================================
// IMPORTS
// ====================================

import {

createSalesSurvey

}

from "../../services/salesSurveyService";


// ====================================
// COMPONENT
// ====================================

export default function SurveyActions({

surveyData

}){


async function submitSurvey(){

try{


const customerRequestId =

localStorage.getItem(

"customerRequestId"

);


const payload = {

customer_request_id:

Number(

customerRequestId

),


survey_date:

new Date()

.toISOString()

.slice(

0,

10

),


material_category:

surveyData.job?.material_category,


consistency:

surveyData.job?.consistency,


bulk_density:

Number(

surveyData.job?.bulk_density

) || null,


hazard_level:

surveyData.job?.hazard_level,


estimated_volume:

Number(

surveyData.geometry?.estimated_volume

) || null,


opening_length:

Number(

surveyData.geometry?.opening_length

) || null,


opening_width:

Number(

surveyData.geometry?.opening_width

) || null,


height_from_ground:

Number(

surveyData.geometry?.height_from_ground

) || null,


drop_to_floor:

Number(

surveyData.geometry?.drop_to_floor

) || null,


setup_distance:

Number(

surveyData.geometry?.setup_distance

) || null,


vertical_lift:

Number(

surveyData.geometry?.vertical_lift

) || null,


hose_distance:

Number(

surveyData.geometry?.hose_distance

) || null,


access_path_width:

Number(

surveyData.geometry?.access_path_width

) || null,


scaffolding_needed:

surveyData.geometry?.scaffolding_needed,


crane_available:

surveyData.geometry?.crane_available,


power_available:

surveyData.safety?.power_available,


water_available:

surveyData.safety?.water_available,


confined_space:

surveyData.safety?.confined_space,


ventilation_required:

surveyData.safety?.ventilation_required,


gas_testing_required:

surveyData.safety?.gas_testing_required,


ehs_restriction:

surveyData.safety?.ehs_restriction,


power_distance:

Number(

surveyData.safety?.power_distance

) || null,


customer_pain_point:

surveyData.insights?.customer_pain

};


await createSalesSurvey(

payload

);


alert(

"Sales Survey Saved"

);

}

catch(error){

console.log(

error

);

}

}


return(

<div className="survey-actions">

<button

onClick={submitSurvey}

>

Save Survey

</button>

</div>

)

}