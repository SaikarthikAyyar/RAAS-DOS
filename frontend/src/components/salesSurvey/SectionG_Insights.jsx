// ====================================
// IMPORTS
// ====================================

import { shutdownOptions } from "../../data/salesSurveyOptions";


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

                            insights.shutdownWindow

                            || ""

                        }

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "shutdownWindow",

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

                            insights.deadline

                            || ""

                        }

                        onChange={(e)=>

                            updateSection(

                                "insights",

                                "deadline",

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