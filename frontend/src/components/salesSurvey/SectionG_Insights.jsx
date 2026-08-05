// ====================================
// IMPORTS
// ====================================

import { shutdownOptions, currentMethodOptions } from "../../data/salesSurveyOptions";


// ====================================
// COMPONENT
// ====================================

export default function SectionG_Insights({

    surveyData,

    updateSection,

    updateMediaFiles

}) {

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

                <div className="survey-field">

                    <label>

                        Shutdown Window

                    </label>

                    <select

                        value={

                            insights.shutdown_window

                            || ""

                        }

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "shutdown_window",

                                e.target.value

                            )

                        }

                    >

                        <option value="">

                            Select

                        </option>


                        {

                            shutdownOptions.map(

                                item=>(

                                    <option

                                        key={item}

                                        value={item}

                                    >

                                        {item}

                                    </option>

                                )

                            )

                        }

                    </select>

                </div>


                {/* Completion Deadline */}

                <div className="survey-field">

                    <label>

                        Completion Deadline

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

                <div className="survey-field">

                    <label>

                        Current Method

                    </label>

                    <select

                        value={insights.current_method || ""}

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "current_method",

                                e.target.value

                            )

                        }

                    >

                        <option value="">Select</option>

                        {

                            currentMethodOptions.map(

                                item=>(

                                    <option key={item} value={item}>

                                        {item}

                                    </option>

                                )

                            )

                        }

                    </select>

                </div>


                {/* Budget Known */}

                <div className="survey-field">

                    <label>

                        Budget Known

                    </label>

                    <select

                        value={insights.budget_known || ""}

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "budget_known",

                                e.target.value

                            )

                        }

                    >

                        <option value="">Select</option>

                        <option value="Yes">Yes</option>

                        <option value="No">No</option>

                    </select>

                </div>


                {/* Budget Estimate (INR) - only shown when Budget Known = Yes */}

                {
                    insights.budget_known === "Yes" && (

                        <div className="survey-field">

                            <label>

                                Budget Estimate (INR)

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

                    </label>


                    <input

                        id="survey-media"

                        type="file"

                        multiple

                        accept="image/*,video/*"

                        style={{

                            display:"none"

                        }}

                        onChange={(e)=>{

                            updateMediaFiles(

                                Array.from(

                                    e.target.files

                                )

                            );

                        }}

                    />


                    <label

                        htmlFor="survey-media"

                        className="media-upload-box"

                    >

                        {

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