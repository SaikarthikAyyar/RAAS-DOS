// ====================================
// COMPONENT
// ====================================

export default function SurveySummaryCard({

    title,

    fields

}){

    return(

        <div className="survey-summary-card">

            <div className="survey-summary-card-header">

                <h3>

                    {title}

                </h3>

            </div>

            <div className="survey-summary-card-body">

                {

                    fields.map(

                        field=>(

                            <div

                                key={field.label}

                                className="survey-summary-row"

                            >

                                <div className="survey-summary-label">

                                    {field.label}

                                </div>

                                <div className="survey-summary-value">

                                    {

                                        field.value ??

                                        "—"

                                    }

                                </div>

                            </div>

                        )

                    )

                }

            </div>

        </div>

    );

}