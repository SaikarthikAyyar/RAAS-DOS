// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import "../../components/salesSurvey/SalesSurvey.css";

import useSalesSurvey from "../../hooks/useSalesSurvey";

import {

getSalesPrefill

}

from "../../services/salesSurveyService";

import SurveyProgress from "../../components/salesSurvey/SurveyProgress";

import SurveyActions from "../../components/salesSurvey/SurveyActions";

import SectionA_Customer from "../../components/salesSurvey/SectionA_Customer";

import SectionB_JobSludge from "../../components/salesSurvey/SectionB_JobSludge";

import SectionC_Geometry from "../../components/salesSurvey/SectionC_Geometry";

import SectionD_Safety from "../../components/salesSurvey/SectionD_Safety";

import SectionE_Pump from "../../components/salesSurvey/SectionE_Pump";

import SectionF_Dewatering from "../../components/salesSurvey/SectionF_Dewatering";

import SectionG_Insights from "../../components/salesSurvey/SectionG_Insights";


// ====================================
// COMPONENT
// ====================================

export default function SalesSurvey() {


const {

surveyData,

setSurveyData,

updateSection,

metrics

}

= useSalesSurvey();


// ====================================
// LOAD CUSTOMER PREFILL
// ====================================

useEffect(

()=>{

async function loadPrefill(){

const customerId = localStorage.getItem(

"customerRequestId"

);


if(

!customerId

){

return;

}


const prefill = await getSalesPrefill(

customerId

);


setSurveyData(

prefill

);

}


loadPrefill();

},

[]

);


return(

<div className="sales-survey-page">


<SurveyProgress

metrics={metrics}

/>


<SectionA_Customer

surveyData={surveyData}

updateSection={updateSection}

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


<SurveyActions

surveyData={surveyData}

/>


</div>

);

}