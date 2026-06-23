// ====================================
// ESTIMATED VOLUME
// ====================================

function calculateEstimatedVolume(

    geometry

){

    const length =

    parseFloat(

        geometry.tank_length

    ) || 0;


    const width =

    parseFloat(

        geometry.tank_width

    ) || 0;


    const depth =

    parseFloat(

        geometry.sludge_depth

    ) || 0;


    return (

        length *

        width *

        depth

    ).toFixed(2);

}


// ====================================
// EQUIPMENT REACH
// ====================================

function calculateEquipmentReach(

    geometry

){

    const setup =

    parseFloat(

        geometry.setup_distance

    ) || 0;


    const lift =

    parseFloat(

        geometry.vertical_lift

    ) || 0;


    const discharge =

    parseFloat(

        geometry.discharge_distance

    ) || 0;


    return (

        setup +

        lift +

        discharge

    ).toFixed(1);

}


// ====================================
// PUMPABILITY SCORE
// ====================================

function calculatePumpability(

    job

){

    let score = 0;


    const hardness =

    job.consistency || "";


    const debris =

    job.debris_level || "";


    if(

        hardness==="Free flowing"

    ){

        score +=3;

    }


    if(

        hardness==="Semi-viscous"

    ){

        score +=2;

    }


    if(

        hardness==="Sticky"

    ){

        score +=1;

    }


    if(

        hardness==="Hard settled"

    ){

        score -=1;

    }


    if(

        debris==="Heavy"

    ){

        score -=2;

    }


    if(

        score>=5

    ){

        return "Easy";

    }


    if(

        score>=3

    ){

        return "Moderate";

    }


    if(

        score>=1

    ){

        return "Difficult";

    }


    return "Very Difficult";

}


// ====================================
// RISK SCORE
// ====================================

function calculateRisk(

    job,

    geometry

){

    let score = 0;


    const hazard =

    job.hazard_level || "";


    if(

        hazard==="Medium"

    ){

        score +=2;

    }


    if(

        hazard==="High"

    ){

        score +=3;

    }


    if(

        geometry.confined_space==="Yes"

    ){

        score +=3;

    }


    if(

        geometry.vertical_lift > 10

    ){

        score +=2;

    }


    if(

        score>=7

    ){

        return "High";

    }


    if(

        score>=4

    ){

        return "Medium";

    }


    return "Low";

}


// ====================================
// EXPORT
// ====================================

export function calculateMetrics(

    surveyData

){

    return{

        estimatedVolume:

        calculateEstimatedVolume(

            {

                ...surveyData.geometry,

                sludge_depth:

                surveyData.job.sludge_depth

            }

        ),


        equipmentReach:

        calculateEquipmentReach(

            surveyData.geometry

        ),


        pumpability:

        calculatePumpability(

            surveyData.job

        ),


        risk:

        calculateRisk(

            surveyData.job,

            surveyData.geometry

        )

    }

}