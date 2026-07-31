// ====================================
// COMPONENT
// ====================================

export default function SurveyWorkspace({

    survey

}){

    if(

        !survey

    ){

        return(

            <div className="survey-empty">

                No Sales Survey Available.

            </div>

        );

    }

    function renderSection(

        title,

        data

    ){

        return(

            <div className="survey-card">

                <h3>

                    {title}

                </h3>

                {

                    Object.entries(

                        data

                    ).length===0

                    ?

                    (

                        <div>

                            No Data

                        </div>

                    )

                    :

                    Object.entries(

                        data

                    ).map(

                        ([key,value])=>(

                            <div

                                key={key}

                                className="survey-field"

                            >

                                <span className="survey-label">

                                    {

                                        key

                                            .replaceAll(

                                                "_",

                                                " "

                                            )

                                    }

                                </span>

                                <span className="survey-value">

                                    {

                                        value===null ||

                                        value===""

                                            ?

                                            "—"

                                            :

                                            String(

                                                value

                                            )

                                    }

                                </span>

                            </div>

                        )

                    )

                }

            </div>

        );

    }

    return(

        <div className="survey-workspace">

            {

                renderSection(

                    "Customer Details",

                    survey.customer

                )

            }

            {

                renderSection(

                    "Job & Sludge Details",

                    survey.job

                )

            }

            {

                renderSection(

                    "Geometry",

                    survey.geometry

                )

            }

            {

                renderSection(

                    "Safety",

                    survey.safety

                )

            }

            {

                renderSection(

                    "Pump Details",

                    survey.pump

                )

            }

            {

                renderSection(

                    "Dewatering",

                    survey.dewatering

                )

            }

            {

                renderSection(

                    "Insights",

                    survey.insights

                )

            }

            <div className="survey-card">

                <h3>

                    Observations

                </h3>

                <div>

                    Not Available

                </div>

            </div>

            <div className="survey-card">

                <h3>

                    Media

                </h3>

                <div>

                    Not Available

                </div>

            </div>

        </div>

    );

}