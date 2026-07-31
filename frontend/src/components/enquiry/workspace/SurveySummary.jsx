export default function SurveySummary({

    enquiry,

    customer,

    survey

}){

    if(

        !enquiry?.sales_survey_id

    ){

        return(

            <div className="survey-empty">

                <h2>

                    No Survey Available

                </h2>

                <button>

                    Fill Survey

                </button>

            </div>

        );

    }

    if(

        !survey

    ){

        return(

            <div>

                Loading Survey...

            </div>

        );

    }

    return(

        <div>

            Survey Loaded

        </div>

    );

}