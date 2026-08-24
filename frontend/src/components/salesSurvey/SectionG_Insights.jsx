// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import LookupSelect from "../shared/LookupSelect";

import FieldTooltip from "../shared/FieldTooltip";

import { uploadMedia } from "../../services/customerMediaService";


// ====================================
// COMPONENT
// ====================================

export default function SectionG_Insights({

    surveyData,

    updateSection,

    updateMediaFiles,

    customerRequestId,

    onMediaUploaded

}) {

    const [uploading, setUploading] = useState(false);

    const insights =

        surveyData?.insights || {};



    // ====================================
    // MEDIA COUNTS
    // ====================================

    const files =

        insights.mediaFiles || [];


    const photoCount =

        files.filter(

            file =>

            file.type.startsWith(

                "image"

            )

        ).length;


    const videoCount =

        files.filter(

            file =>

            file.type.startsWith(

                "video"

            )

        ).length;


    return (

        <div className="survey-card">


            {/* Header */}

            <div className="survey-header">

                <h2>

                    G. Customer Insight & Media

                </h2>



            </div>


            <div className="survey-grid">


                {/* Customer Insight */}

                <div

                    className="survey-field"

                    style={{

                        gridColumn:"1 / span 3"

                    }}

                >

                    <label>

                        Customer pain point / key insight
                        <FieldTooltip text="The main problem or concern the customer has, in their own words - captured during the survey visit."/>

                    </label>

                    <textarea

                        rows={3}

                        value={

                        insights.customer_pain

                        || ""

                        }

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "customer_pain",

                                e.target.value

                            )

                        }

                    />

                </div>


                {/* Shutdown Window */}

                <LookupSelect

                    listKey="shutdown"

                    label="Shutdown Window"

                    value={insights.shutdown_window}

                    section="insights"

                    field="shutdown_window"

                    updateSection={updateSection}

                    tooltip="The window of time the customer's plant/site will be shut down and available for this job."

                />


                {/* Completion Deadline */}

                <div className="survey-field">

                    <label>

                        Completion Deadline
                        <FieldTooltip text="The date the customer expects the job to be fully finished by."/>

                    </label>

                    <input

                        type="date"

                        value={

                            insights.completion_deadline

                            || ""

                        }

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "completion_deadline",

                                e.target.value

                            )

                        }

                    />

                </div>


                {/* Current Method */}

                <LookupSelect

                    listKey="currentMethod"

                    label="Current Method"

                    value={insights.current_method}

                    section="insights"

                    field="current_method"

                    updateSection={updateSection}

                    tooltip="How the customer currently handles this cleaning job, if at all (e.g. manual, another vendor)."

                />


                {/* Budget Known */}

                <LookupSelect

                    listKey="budgetKnown"

                    label="Budget Known"

                    value={insights.budget_known}

                    section="insights"

                    field="budget_known"

                    updateSection={updateSection}

                    tooltip="Whether the customer has already indicated a budget for this job."

                />


                {/* Budget Estimate (INR) - only shown when Budget Known = Yes */}

                {
                    insights.budget_known === "Yes" && (

                        <div className="survey-field">

                            <label>

                                Budget Estimate (INR)
                                <FieldTooltip text="The customer's indicated or estimated budget for this job, in INR."/>

                            </label>

                            <input

                                type="number"

                                value={insights.budget_estimate ?? ""}

                                onChange={(e)=>

                                    updateSection(

                                        "insights",

                                        "budget_estimate",

                                        e.target.value

                                    )

                                }

                            />

                        </div>

                    )
                }


                {/* Decision Maker */}

                <div className="survey-field">

                    <label>

                        Decision Maker
                        <FieldTooltip text="The person at the customer's organisation who will approve/decide on this job."/>

                    </label>

                    <input

                        value={insights.decision_maker || ""}

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "decision_maker",

                                e.target.value

                            )

                        }

                    />

                </div>


                {/* Billing Address */}

                <div

                    className="survey-field"

                    style={{

                        gridColumn:"1 / span 3"

                    }}

                >

                    <label>

                        Billing Address
                        <FieldTooltip text="The address to be used for invoicing this job, if different from the site address."/>

                    </label>

                    <textarea

                        rows={2}

                        value={insights.billing_address || ""}

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "billing_address",

                                e.target.value

                            )

                        }

                    />

                </div>


                {/* Photos / Videos */}

                <div className="survey-field">

                    <label>

                        Photos / Videos
                        <FieldTooltip text="Site photos/videos captured during the survey, to support the assessment and quote."/>

                    </label>


                    <input

                        id="survey-media"

                        type="file"

                        multiple

                        accept="image/*,video/*"

                        disabled={uploading}

                        style={{

                            display:"none"

                        }}

                        onChange={async(e)=>{

                            const picked = Array.from(e.target.files);

                            e.target.value = "";

                            if(picked.length===0){
                                return;
                            }

                            updateMediaFiles(picked);

                            if(!customerRequestId){
                                console.error("No customerRequestId - media staged locally only, will not upload.");
                                return;
                            }

                            const photos = picked.filter(file=>file.type.startsWith("image"));

                            const videos = picked.filter(file=>file.type.startsWith("video"));

                            setUploading(true);

                            try{

                                await uploadMedia(
                                    Number(customerRequestId),
                                    { photos, videos }
                                );

                                onMediaUploaded?.(photos.length, videos.length);

                            }

                            catch(err){

                                console.error(err);

                                alert("Unable to upload media. Please try again.");

                            }

                            finally{

                                setUploading(false);

                            }

                        }}

                    />


                    <label

                        htmlFor="survey-media"

                        className="media-upload-box"

                    >

                        {

                            uploading
                            ?
                            "Uploading..."
                            :
                            files.length===0

                            ?

                            "Upload photos/videos"

                            :

                            `${photoCount} photos, ${videoCount} videos`

                        }

                    </label>

                </div>


            </div>

        </div>

    );

}