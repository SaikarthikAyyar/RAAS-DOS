// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import "../../components/salesSurvey/SalesSurvey.css";

import useSalesSurvey from "../../hooks/useSalesSurvey";

import {

getSalesPrefill,

getCustomers

}

from "../../services/salesSurveyService";

import SurveySummary

from "../../components/salesSurvey/SurveySummary";

import SurveyProgress

from "../../components/salesSurvey/SurveyProgress";

import SurveyActions

from "../../components/salesSurvey/SurveyActions";

import SectionA_Customer

from "../../components/salesSurvey/SectionA_Customer";

import SectionB_JobSludge

from "../../components/salesSurvey/SectionB_JobSludge";

import SectionC_Geometry

from "../../components/salesSurvey/SectionC_Geometry";

import SectionD_Safety

from "../../components/salesSurvey/SectionD_Safety";

import SectionE_Pump

from "../../components/salesSurvey/SectionE_Pump";

import SectionF_Dewatering

from "../../components/salesSurvey/SectionF_Dewatering";

import SectionG_Insights

from "../../components/salesSurvey/SectionG_Insights";

import SectionH_Media

from "../../components/salesSurvey/SectionH_Media";


// ====================================
// COMPONENT
// ====================================

export default function SalesSurvey(){


const {

surveyData,

setSurveyData,

updateSection,

metrics,

canSubmit

}

=

useSalesSurvey();


const [

customers,

setCustomers

]

=

useState(

[]

);


const [

selectedCustomer,

setSelectedCustomer

]

=

useState(

""

);


// ====================================
// LOAD CUSTOMER LIST
// ====================================

useEffect(

()=>{

async function loadCustomers(){

try{

const data=

await getCustomers();

setCustomers(

data

);

}

catch(error){

console.log(

error

);

}

}


loadCustomers();

},

[]

);


// ====================================
// LOAD SALES PREFILL
// ====================================

useEffect(

()=>{


if(

!selectedCustomer

){

return;

}


async function loadPrefill(){

try{


const prefill=

await getSalesPrefill(

selectedCustomer

);


setSurveyData(

prefill

);

}

catch(error){

console.log(

error

);

}

}


loadPrefill();

},

[

selectedCustomer

]

);


// ====================================
// UI
// ====================================

return(

<div className="sales-survey-page">


<SurveyProgress/>


<SectionA_Customer

surveyData={surveyData}

updateSection={updateSection}

customers={customers}

selectedCustomer={selectedCustomer}

setSelectedCustomer={setSelectedCustomer}

/>


<SectionB_JobSludge

surveyData={surveyData}

updateSection={updateSection}

/>


<SectionC_Geometry

surveyData={surveyData}

updateSection={updateSection}

metrics={metrics}

/>


<SectionD_Safety

surveyData={surveyData}

updateSection={updateSection}

/>


<SectionE_Pump

surveyData={surveyData}

updateSection={updateSection}

/>


<SectionF_Dewatering

surveyData={surveyData}

updateSection={updateSection}

/>


<SectionG_Insights

surveyData={surveyData}

updateSection={updateSection}

/>


<SectionH_Media

customerRequestId={selectedCustomer}

/>


<SurveySummary

metrics={metrics}

completion={metrics.completion}

/>


<SurveyActions

surveyData={surveyData}

metrics={metrics}

canSubmit={canSubmit}

customerRequestId={selectedCustomer}

/>


</div>

)

}