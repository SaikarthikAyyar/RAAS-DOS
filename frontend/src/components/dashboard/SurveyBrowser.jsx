// ====================================
// IMPORTS
// ====================================



import {

    useState

} from "react";

import "./Dashboard.css";


// ====================================
// COMPONENT
// ====================================

export default function SurveyBrowser({

    surveys,

    selectedSurveyId,

    setSelectedSurveyId,

    surveyNavigator,

    startSurveyId,

    setStartSurveyId

}){

    console.log(

        "\n========== SURVEY BROWSER =========="

    );

    console.log(

        "Visible surveys:",

        surveys?.map(

            survey=>survey.id

        )

    );

    console.log(

        "Selected Survey:",

        selectedSurveyId

    );

    console.log(

        "======================================\n"

    );

    const [

        dropdownOpen,

        setDropdownOpen

    ] = useState(

        false

    );

    if(

        !surveys

    ){

        return null;

    }



    function previous(){

        if(

            startSurveyId>1

        ){

            const nextSurvey =

                startSurveyId-1;

            setStartSurveyId(

                nextSurvey

            );

            setSelectedSurveyId(

                nextSurvey

            );

        }

    }

    function next(){

        const nextSurvey =

            startSurveyId+1;

        setStartSurveyId(

            nextSurvey

        );

        setSelectedSurveyId(

            nextSurvey

        );

    }

    return(

        <div className="dashboard-browser">

            <div className="dashboard-browser-top">

                <button

                    className="dashboard-nav-button"

                    onClick={previous}

                >

                    ◀

                </button>

                <div className="dashboard-survey-strip">

                    {

                        surveys.map(

                            survey=>(

                                <button

                                    key={survey.id}

                                    className={

                                        survey.id===selectedSurveyId

                                        ?

                                        "dashboard-survey active"

                                        :

                                        "dashboard-survey"

                                    }

                                    onClick={()=>{

                                        console.log(

                                            "Survey Selected:",

                                            survey.id

                                        );

                                        setSelectedSurveyId(

                                            survey.id

                                        );

                                        setStartSurveyId(

                                            survey.id

                                        );

                                    }}

                                >

                                    SS-{survey.id}

                                </button>

                            )

                        )

                    }

                </div>

                <button

                    className="dashboard-nav-button"

                    onClick={next}

                >

                    ▶

                </button>

            </div>

            <div className="dashboard-browser-bottom">

                <button

                    className="dashboard-dropdown-button"

                    onClick={()=>{

                        setDropdownOpen(

                            !dropdownOpen

                        );

                    }}

                >

                    Survey Request {selectedSurveyId}

                    <span>

                        {dropdownOpen ? "▲" : "▼"}

                    </span>

                </button>

                {

                    dropdownOpen && (

                        <div className="dashboard-dropdown-list">

                            {

                                surveyNavigator.map(

                                    survey=>(

                                        <div

                                            key={survey.id}

                                            className={

                                                survey.id===selectedSurveyId

                                                ?

                                                "dashboard-dropdown-item active"

                                                :

                                                "dashboard-dropdown-item"

                                            }

                                            onClick={()=>{

                                                console.log(

                                                    "Dropdown Survey:",

                                                    survey.id

                                                );

                                                setSelectedSurveyId(

                                                    survey.id

                                                );

                                                setStartSurveyId(

                                                    survey.id

                                                );

                                                setDropdownOpen(

                                                    false

                                                );

                                            }}

                                        >

                                            Site Survey {survey.id}

                                        </div>

                                    )

                                )

                            }

                        </div>

                    )

                }

            </div>

        </div>

    );

}