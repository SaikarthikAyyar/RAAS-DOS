export default function SurveySummaryCard({

    title,

    fields = [],

    actions

}){

    return(

        <div className="survey-summary-card">

            <h3 className="survey-summary-title">

                {title}

            </h3>

            {

                actions ? (

                    actions

                ) : (

                    <div className="survey-summary-body">

                        {

                            fields.map(

                                (field,index)=>(

                                    <div

                                        key={index}

                                        className="survey-summary-row"

                                    >

                                        <span className="survey-summary-label">

                                            {field.label}

                                        </span>

                                        <span className="survey-summary-value">

                                            {field.value ?? "—"}

                                        </span>

                                    </div>

                                )

                            )

                        }

                    </div>

                )

            }

        </div>

    );

}