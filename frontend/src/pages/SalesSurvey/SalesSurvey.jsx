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
// MEDIA UPLOAD FEEDBACK
// A distinct toast (not just the generic "Sales Survey Saved" alert)
// naming what was uploaded, plus a refresh key that forces
// SectionH_Media to refetch immediately - it previously only fetched
// on mount, so newly uploaded files stayed invisible until the user
// navigated away and back into the enquiry.
// ====================================

const [mediaToast, setMediaToast] = useState("");

const [mediaRefreshKey, setMediaRefreshKey] = useState(0);

useEffect(()=>{

    if(!mediaToast) return;

    const timer = setTimeout(()=>setMediaToast(""), 4000);

    return ()=>clearTimeout(timer);

}, [mediaToast]);

function handleMediaUploaded(photoCount, videoCount){

    const parts = [];

    if(photoCount) parts.push(`${photoCount} photo${photoCount===1?"":"s"}`);

    if(videoCount) parts.push(`${videoCount} video${videoCount===1?"":"s"}`);

    if(parts.length){

        setMediaToast(`Uploaded ${parts.join(" and ")}.`);

    }

    setMediaRefreshKey(prev=>prev+1);

}

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

                // The saved-survey payload has no enquiry_created_at
                // field of its own (that's a prefill-only concept) -
                // fetch it alongside so Survey Date's
                // after-the-enquiry validation still applies when
                // editing, not just on first fill.
                const [survey, prefill] = await Promise.all([

                    getCustomerSurvey(
                        customerRequestId,
                        salesSurveyId
                    ),

                    getSalesPrefill(
                        customerRequestId
                    )

                ]);

                setSelectedSurvey(

                    salesSurveyId

                );

                setSurveyData({

                    ...survey,

                    enquiry_created_at: prefill.enquiry_created_at

                });

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

// onBlurCapture (not a per-field onBlur) so leaving ANY field on this
// form - not just the handful that already had their own validation
// wired - is what reveals every still-empty compulsory field's error,
// matching "select a later field and an earlier required one lights
// up" without touching every field's JSX.
<div className="sales-survey-page" ref={pageRef} onBlurCapture={()=>touchField("_form", "_any")}>


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

customerRequestId={selectedCustomer}

onMediaUploaded={handleMediaUploaded}

/>


<SectionH_Media

customerRequestId={selectedCustomer}

mediaRefreshKey={mediaRefreshKey}

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

    mediaToast && (

        <div className="media-upload-toast">

            {mediaToast}

        </div>

    )

}


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