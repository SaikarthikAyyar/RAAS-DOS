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

surveyData,

metrics,

canSubmit,

customerRequestId


}){


async function submitSurvey(){

try{





const payload={


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

plant_site_location:

surveyData.customer?.plant_site_location,


// ====================================
// SECTION B
// ====================================

material_category:

surveyData.job?.material_category,


job_type:
surveyData.job?.job_type,

cleaning_date:
surveyData.job?.cleaning_date,

cleaning_frequency:
surveyData.job?.cleaning_frequency,



bulk_density:

Number(

surveyData.job?.bulk_density

)

|| null,


hazard_level:

surveyData.job?.hazard_level,

sludge_hardness:
surveyData.job?.sludge_hardness,

debris_level:
surveyData.job?.debris_level,

water_visibility:
surveyData.job?.water_visibility,

pumpable:
surveyData.job?.pumpable,

large_object_type:
surveyData.job?.large_object_type,

ph_min:
Number(surveyData.job?.ph_min) || null,

ph_max:
Number(surveyData.job?.ph_max) || null,

flow_after_agitation:
surveyData.job?.flow_after_agitation,

temperature_range:
surveyData.job?.temperature_range,

sample_available:
surveyData.job?.sample_available,


// ====================================
// COMPUTED
// ====================================


tank_type:
surveyData.geometry?.tank_type,

tank_length:
Number(
    surveyData.geometry?.length_dia
) || null,

tank_width:
Number(
    surveyData.geometry?.width
) || null,

tank_depth:
Number(
    surveyData.geometry?.sludge_depth
) || null,

average_output:
Number(
    surveyData.geometry?.average_output
) || null,

estimated_volume:

metrics.estimatedVolume,


// ====================================
// SECTION C
// ====================================

opening_length:

Number(

surveyData.geometry?.opening_length

)

|| null,


opening_width:

Number(

surveyData.geometry?.opening_width

)

|| null,


height_from_ground:

Number(

surveyData.geometry?.height_from_ground

)

|| null,


drop_to_floor:

Number(

surveyData.geometry?.drop_to_floor

)

|| null,


setup_distance:

Number(

surveyData.geometry?.setup_distance

)

|| null,


vertical_lift:

Number(

surveyData.geometry?.vertical_lift

)

|| null,


hose_distance:

Number(

surveyData.geometry?.hose_distance

)

|| null,


access_path_width:

Number(

surveyData.geometry?.access_path_width

)

|| null,


scaffolding_needed:
surveyData.geometry?.scaffolding_needed,

crane_available:
surveyData.geometry?.crane_available,

opening_height:
Number(
    surveyData.geometry?.opening_height
) || null,



access_support:
surveyData.geometry?.access_support,

customer_support:
surveyData.geometry?.customer_support,


// ====================================
// SECTION D
// ====================================

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

air_supply_available:
surveyData.safety?.air_supply_available,

power_distance:
Number(
    surveyData.safety?.power_distance
) || null,

// ====================================
// SECTION E
// ====================================

discharge_pit_dimension:

surveyData.pump?.discharge_pit_dimension,

discharge_medium:
surveyData.pump?.discharge_medium,

disposal_route:
surveyData.pump?.disposal_route,

disposal_responsibility:
surveyData.pump?.disposal_responsibility,

discharge_point_distance:
Number(
    surveyData.pump?.discharge_point_distance
) || null,

hose_route_bends:
Number(
    surveyData.pump?.hose_route_bends
) || null,


// ====================================
// SECTION G
// ====================================

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

className="survey-btn save-btn"

disabled={!canSubmit}

onClick={submitSurvey}

>

Submit Survey

</button>


</div>

);

}