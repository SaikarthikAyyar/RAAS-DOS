// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import "../../components/salesSurvey/SalesSurvey.css";

import useSalesSurvey from "../../hooks/useSalesSurvey";

import {

getSalesPrefill,



getCustomerSurveys,

getCustomerSurvey

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

selectedCustomer,

setSelectedCustomer

]

=

useState(

""

);


const [

customerSurveys,

setCustomerSurveys

]

=

useState(

[]

);


const [

selectedSurvey,

setSelectedSurvey

]

=

useState(

""

);


// ====================================
// LOAD RECEIVED ENQUIRY
// ====================================

useEffect(

()=>{

async function loadSelectedEnquiry(){

try{

const enquiry = JSON.parse(

localStorage.getItem(

"selectedReceivedEnquiry"

)

);

if(

!enquiry

){

return;

}

setSelectedCustomer(

enquiry.customer_request_id

);

const prefill =

await getSalesPrefill(

enquiry.customer_request_id

);

setSurveyData(

prefill

);

const surveys =

await getCustomerSurveys(

enquiry.customer_request_id

);

setCustomerSurveys(

surveys

);

}

catch(error){

console.log(

error

);

}

}

loadSelectedEnquiry();

},

[]

);


// ====================================
// LOAD SALES PREFILL FROM DASHBOARD
// ====================================

useEffect(() => {

    async function loadPrefill() {

        try {

            const customerRequestId =
                localStorage.getItem(
                    "sales_customer_request_id"
                );

            if (!customerRequestId) {

                console.log(
                    "[SalesSurvey] No Customer Request selected."
                );

                return;

            }

            console.log(
                "[SalesSurvey] Customer Request:",
                customerRequestId
            );

            setSelectedCustomer(customerRequestId);

            const prefill =
                await getSalesPrefill(
                    customerRequestId
                );

            setSurveyData(prefill);

            const surveys =
                await getCustomerSurveys(
                    customerRequestId
                );

            setCustomerSurveys(surveys);

            setSelectedSurvey("");

        }

        catch(error){

            console.log(error);

        }

    }

    loadPrefill();

}, []);


// ====================================
// LOAD EXISTING SURVEY
// ====================================

useEffect(

()=>{

if(

!selectedCustomer ||

!selectedSurvey

){

return;

}

async function loadExistingSurvey(){

try{

console.log(

"[SalesSurvey] Loading Existing Survey"

);

console.log(

"[SalesSurvey] Customer:",

selectedCustomer

);

console.log(

"[SalesSurvey] Survey:",

selectedSurvey

);

const survey=

await getCustomerSurvey(

selectedCustomer,

selectedSurvey

);

console.log(

"[SalesSurvey] Existing Survey Loaded"

);

console.log(

survey

);

setSurveyData(

survey

);

console.log(

"[SalesSurvey] Survey State Updated"

);

}

catch(error){

console.log(

error

);

}

}

loadExistingSurvey();

},

[

selectedCustomer,

selectedSurvey

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

customers={[

{

id:selectedCustomer,

company_name:surveyData.company_name

}

]}

selectedCustomer={selectedCustomer}

setSelectedCustomer={()=>{}}

customerSurveys={customerSurveys}

selectedSurvey={selectedSurvey}

setSelectedSurvey={setSelectedSurvey}

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