// ====================================
// IMPORTS
// ====================================

import {

createSalesSurvey

}

from "../../services/salesSurveyService";

import {

    updateModuleReference

}

from "../../services/enquiryWorkspaceService";

import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";

// ====================================
// COMPONENT
// ====================================

export default function SurveyActions({

surveyData,

metrics,

canSubmit,

customerRequestId,

enquiryId,

salesSurveyId,

onBlockedSubmit

}){

const { user: currentUser } = useAuth();

const navigate = useNavigate();


async function submitSurvey(){

if(!canSubmit){

    onBlockedSubmit?.();

    alert("Please fix the highlighted fields before submitting.");

    return;

}

try{





const payload={


customer_request_id:

Number(

customerRequestId

),

sales_survey_id:

salesSurveyId,

actor:
currentUser ? {
    user_id: currentUser.id,
    name: currentUser.name,
    role: currentUser.role
} : null,


survey_date:

surveyData.customer?.survey_date
||
new Date()
.toISOString()
.slice(0, 10),

plant_site_location:

surveyData.customer?.plant_site_location,

nearest_hub:
surveyData.customer?.nearest_hub,

urgency:
surveyData.customer?.urgency,

surveyed_by:
surveyData.customer?.surveyed_by,

survey_trigger:
surveyData.customer?.survey_trigger,

repeat_potential:
surveyData.customer?.repeat_potential,

tentative_start_date:
surveyData.customer?.tentative_start_date,

tentative_end_date:
surveyData.customer?.tentative_end_date,


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

abrasiveness:
surveyData.job?.abrasiveness,

permit_required:
surveyData.job?.permit_required,

flowability:
surveyData.job?.flowability,


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

opening_height:
Number(
    surveyData.geometry?.opening_height
) || null,

access_type:
surveyData.geometry?.access_type,

equipment_nearby:
surveyData.geometry?.equipment_nearby,

tank_location:
surveyData.geometry?.tank_location,

setup_complexity:
surveyData.geometry?.setup_complexity,


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

target_flow:
Number(surveyData.pump?.target_flow) || null,

suction_depth:
Number(surveyData.pump?.suction_depth) || null,

discharge_distance:
Number(surveyData.pump?.discharge_distance) || null,

discharge_height:
Number(surveyData.pump?.discharge_height) || null,

debris_present:
surveyData.pump?.debris_present,

ph_condition:
surveyData.pump?.ph_condition,

pump_power_source:
surveyData.pump?.pump_power_source,

pump_risk:
surveyData.pump?.pump_risk,

effective_work_hours:
Number(surveyData.pump?.effective_work_hours) || null,


// ====================================
// SECTION F
// ====================================

dewatering_required:
surveyData.dewatering?.dewatering_required,

dewatering_volume:
Number(surveyData.dewatering?.dewatering_volume) || null,

inlet_moisture:
Number(surveyData.dewatering?.inlet_moisture) || null,

target_final_moisture:
Number(surveyData.dewatering?.target_final_moisture) || null,

expected_final_form:
surveyData.dewatering?.expected_final_form,

visible_free_water:
surveyData.dewatering?.visible_free_water,

natural_settling:
surveyData.dewatering?.natural_settling,

oily_emulsified:
surveyData.dewatering?.oily_emulsified,

space_available:
surveyData.dewatering?.space_available,

filtrate_route:
surveyData.dewatering?.filtrate_route,

moisture_guarantee:
surveyData.dewatering?.moisture_guarantee,

cake_handling_scope:
surveyData.dewatering?.cake_handling_scope,

filtrate_route_detail:
surveyData.dewatering?.filtrate_route_detail,

polymer_allowed:
surveyData.dewatering?.polymer_allowed,

commitment:
surveyData.dewatering?.commitment,


// ====================================
// SECTION G
// ====================================

customer_pain_point:

surveyData.insights?.customer_pain,

shutdown_window:
surveyData.insights?.shutdown_window,

completion_deadline:
surveyData.insights?.completion_deadline,

current_method:
surveyData.insights?.current_method,

budget_known:
surveyData.insights?.budget_known,

budget_estimate:
Number(surveyData.insights?.budget_estimate) || null,

decision_maker:
surveyData.insights?.decision_maker,

billing_address:
surveyData.insights?.billing_address

};


const survey = await createSalesSurvey(

    payload

);

if(

    !salesSurveyId

    &&

    enquiryId

){

    await updateModuleReference(

        enquiryId,

        "sales_survey_id",

        survey.id

    );

}

// ====================================
// MEDIA
// Files picked in Section G's "Photos / Videos" uploader are now
// uploaded immediately on pick (see SectionG_Insights.jsx), not
// deferred to here - nothing left to do for media at submit time.
// ====================================

// If this survey was reached from a specific enquiry's Workspace
// (Fill/Edit Survey), land back there on the Survey tab so the user
// immediately sees the read-only summary reflect what they just
// saved - instead of staying on this bare form with just an alert.
// The fully-standalone entry (no enquiryId in state) has no
// workspace to return to, so it keeps the alert-only behavior.
if(enquiryId){

    navigate(`/enquiries/workspace/${enquiryId}`, {
        state:{ initialTab:"survey" }
    });

}
else{

    alert(
        "Sales Survey Saved"
    );

}

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

onClick={submitSurvey}

>

Submit Survey

</button>


</div>

);

}