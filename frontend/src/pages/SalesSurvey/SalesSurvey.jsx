// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import { useRef } from "react";

import { ArrowUp } from "lucide-react";

import {

    useLocation

} from "react-router-dom";

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

updateMediaFiles,

metrics,

canSubmit,

errors,

touched,

touchField

}

=

useSalesSurvey();

const [submitAttempted, setSubmitAttempted] = useState(false);

// ====================================
// SCROLL-TO-TOP BUTTON
// Shows once the user has scrolled past the top cards, so it isn't
// just sitting there redundantly when the top of the page (where it
// scrolls back to) is already in view.
// ====================================

const [showScrollTop, setShowScrollTop] = useState(false);

const pageRef = useRef(null);

useEffect(()=>{

    const scrollContainer = pageRef.current?.closest(".app-content");

    if(!scrollContainer){
        return;
    }

    function handleScroll(){
        setShowScrollTop(scrollContainer.scrollTop > 300);
    }

    scrollContainer.addEventListener("scroll", handleScroll);

    return ()=>scrollContainer.removeEventListener("scroll", handleScroll);

}, []);

function scrollToTop(){

    const scrollContainer = pageRef.current?.closest(".app-content");

    scrollContainer?.scrollTo({ top:0, behavior:"smooth" });

}





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

const location = useLocation();

const {

    enquiryId,

    customerRequestId,

    salesSurveyId

} = location.state || {};


useEffect(() => {

    async function initializeSurvey(){

        try{

            if(!customerRequestId){

                return;

            }

            setSelectedCustomer(

                customerRequestId

            );

            const surveys =

                await getCustomerSurveys(

                    customerRequestId

                );

            setCustomerSurveys(

                surveys

            );

            if(salesSurveyId){

                const survey =

                    await getCustomerSurvey(

                        customerRequestId,

                        salesSurveyId

                    );

                setSelectedSurvey(

                    salesSurveyId

                );

                setSurveyData(

                    survey

                );

            }

            else{

                const prefill =

                    await getSalesPrefill(

                        customerRequestId

                    );

                setSurveyData(

                    prefill

                );

            }

        }

        catch(error){

            console.log(error);

        }

    }

    initializeSurvey();

},

[

    customerRequestId,

    salesSurveyId

]);







// ====================================
// UI
// ====================================

return(

<div className="sales-survey-page" ref={pageRef}>


<div className="survey-completion-card">

    <span>Progress:</span>

    <strong>{metrics.completion}%</strong>

</div>


<SurveyProgress/>


<SurveySummary

metrics={metrics}

/>


<SectionA_Customer

surveyData={surveyData}

updateSection={updateSection}

customers={[

{

id:selectedCustomer,

company_name:surveyData.customer?.company_name

}

]}

selectedCustomer={selectedCustomer}

setSelectedCustomer={()=>{}}

customerSurveys={customerSurveys}

selectedSurvey={selectedSurvey}

setSelectedSurvey={setSelectedSurvey}

errors={errors}

touched={touched}

touchField={touchField}

submitAttempted={submitAttempted}

/>


<SectionB_JobSludge

surveyData={surveyData}

updateSection={updateSection}

errors={errors}

touched={touched}

touchField={touchField}

submitAttempted={submitAttempted}

/>


<SectionC_Geometry

surveyData={surveyData}

updateSection={updateSection}

metrics={metrics}

errors={errors}

touched={touched}

touchField={touchField}

submitAttempted={submitAttempted}

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

updateMediaFiles={updateMediaFiles}

/>


<SectionH_Media

customerRequestId={selectedCustomer}

/>


<SurveyActions

surveyData={surveyData}

metrics={metrics}

canSubmit={canSubmit}

customerRequestId={selectedCustomer}

enquiryId={enquiryId}

salesSurveyId={salesSurveyId}

onBlockedSubmit={()=>setSubmitAttempted(true)}

/>


{

    showScrollTop && (

        <button

            type="button"

            className="survey-scroll-top-btn"

            aria-label="Scroll to top"

            onClick={scrollToTop}

        >

            <ArrowUp size={20}/>

        </button>

    )

}


</div>

)

}