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

job.sludge_hardness==="Sticky"

||

job.sludge_hardness==="Hard settled"

){

pumpability=

"Difficult";

}


if(

job.sludge_hardness==="Abrasive"

||

job.sludge_hardness==="Fibrous"

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
// SURVEY STRUCTURE
// ====================================

const SURVEY_STRUCTURE = {

    customer: [

        "company_name",
        "plant_site_location",
        "contact_person",
        "contact_number",
        "nearest_hub",
        "urgency",
        "survey_date"

    ],

    job: [

        "job_type",
        "material_category",
        "cleaning_date",
        "cleaning_frequency",
        "sludge_hardness",
        "debris_level",
        "water_visibility",
        "bulk_density",
        "pumpable",
        "large_object_type",
        "hazard_level",
        "ph_min",
        "ph_max",
        "flow_after_agitation",
        "temperature_range",
        "sample_available"

    ],

    geometry: [

        "tank_type",
        "length_dia",
        "width",
        "sludge_depth",
        "estimated_volume",
        "average_output",
        "opening_length",
        "opening_width",
        "height_from_ground",
        "drop_to_floor",
        "setup_distance",
        "vertical_lift",
        "hose_distance",
        "access_path_width",
        "access_support",
        "customer_support"

    ],

    safety: [

        "power_available",
        "water_available",
        "air_supply_available",
        "confined_space",
        "ventilation_required",
        "gas_testing_required",
        "ehs_restriction",
        "power_distance"

    ],

    pump: [

        "target_flow",
        "suction_depth",
        "discharge_distance",
        "discharge_height",
        "debris_present",
        "ph_condition",
        "pump_power_source",
        "discharge_pit_dimension",
        "discharge_medium",
        "disposal_route",
        "disposal_responsibility",
        "discharge_point_distance",
        "hose_route_bends"

    ],

    dewatering: [

        "dewatering_required",
        "dewatering_volume",
        "inlet_moisture",
        "target_final_moisture",
        "expected_final_form",
        "visible_free_water",
        "natural_settling",
        "oily_emulsified",
        "space_available",
        "filtrate_route",
        "moisture_guarantee",
        "cake_handling_scope"

    ],

    insights: [

        "customer_pain",
        "shutdown_window",
        "completion_deadline",
        "photos"

    ]

};


// ====================================
// COMPLETENESS
// ====================================

const totalFields = Object.values(

    SURVEY_STRUCTURE

)

.flat()

.length;


let filledFields = 0;


Object.entries(

    SURVEY_STRUCTURE

).forEach(

    ([section, fields]) => {

        fields.forEach(field => {

            const value = surveyData[section]?.[field];

            if (

                value !== null &&

                value !== undefined &&

                value !== ""

            ) {

                filledFields++;

            }

        });

    }

);











const requiredFields = [

    // Section A
    surveyData.customer?.company_name,
    surveyData.customer?.plant_site_location,
    surveyData.customer?.contact_person,
    surveyData.customer?.contact_number,
    surveyData.customer?.nearest_hub,
    surveyData.customer?.urgency,
    surveyData.customer?.survey_date,

    // Section B
    surveyData.job?.job_type,
    surveyData.job?.material_category,
    surveyData.job?.sludge_hardness,
    surveyData.job?.debris_level,
    surveyData.job?.cleaning_date,
    surveyData.job?.cleaning_frequency,

    // Section C
    surveyData.geometry?.tank_type,
    surveyData.geometry?.length_dia,
    surveyData.geometry?.width,
    surveyData.geometry?.sludge_depth,


];

const canSubmit = requiredFields.every(value =>
    value !== null &&
    value !== undefined &&
    value !== ""
);

const completion = Math.min(
    100,
    Math.round(
        (filledFields / totalFields) * 100
    )
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

metrics,

canSubmit

};

}