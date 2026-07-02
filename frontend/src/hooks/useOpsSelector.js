// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import {

getOpsSurveys,

getOpsPrefill,

saveOpsSelector

}

from "../services/opsSelectorService";


// ====================================
// HOOK
// ====================================

export default function useOpsSelector(){

const[

surveys,

setSurveys

]=

useState(

[]

);


const[

selectedSurvey,

setSelectedSurvey

]=

useState(

""

);


const[

opsData,

setOpsData

]=

useState({

inputs:{},

doability:"",

service_configuration:"",

recommended_machine:"",

pump_hose_package:"",

accessories:"",

mobilisation_days:0,

setup_days:0,

execution_days:0,

demob_days:0,

total_job_days:0,

manpower_required:"",

approval_gate:"",

internal_next_action:"",

selection_reason:""

});


// ====================================
// LOAD SURVEYS
// ====================================

useEffect(

()=>{

loadSurveys();

},

[]

);


// ====================================
// LOAD PREVIEW
// ====================================

useEffect(

()=>{

if(

!selectedSurvey

){

return;

}

loadPrefill(

selectedSurvey

);

},

[

selectedSurvey

]

);


// ====================================
// LOAD SURVEYS
// ====================================

async function loadSurveys(){

try{

const data=

await getOpsSurveys();

setSurveys(

data

);

}

catch(error){

console.log(

error

);

}

}


// ====================================
// LOAD PREFILL
// ====================================

async function loadPrefill(

salesSurveyId

){

try{

const data=

await getOpsPrefill(

salesSurveyId

);

setOpsData(

data

);

}

catch(error){

console.log(

error

);

}

}


// ====================================
// SAVE
// ====================================

async function saveOps(){

try{

const response=

await saveOpsSelector({

sales_survey_id:

selectedSurvey

});

if(

response.detail

){

alert(

response.detail

);

return;

}

alert(

"Ops Selection Saved Successfully."

);

}

catch(error){

console.log(

error

);

if(

error.detail

){

alert(

error.detail

);

}

else{

alert(

"Unable to save Ops Selection."

);

}

}

}


// ====================================
// RETURN
// ====================================

return{

surveys,

selectedSurvey,

setSelectedSurvey,

opsData,

saveOps

};

}