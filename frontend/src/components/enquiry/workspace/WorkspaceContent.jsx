import SurveySummary from "./SurveySummary";

import SurveyWorkspace from "./SurveyWorkspace";
// ====================================
// COMPONENT
// ====================================

export default function WorkspaceContent({

    activeTab,

    enquiry,

    customer,

    survey

}){

    switch(

        activeTab

    ){

        case "survey":

            return(

                <SurveySummary

                    enquiry={enquiry}

                    survey={survey}

                />

            );

        case "ops-review":

            return(

                <div>

                    Ops Review Placeholder

                </div>

            );

        case "techno-commercial":

            return(

                <div>

                    Techno Commercial Placeholder

                </div>

            );

        case "commercial-approval":

            return(

                <div>

                    Commercial Approval Placeholder

                </div>

            );

        case "purchase-order":

            return(

                <div>

                    Purchase Order Placeholder

                </div>

            );

        case "job":

            return(

                <div>

                    Job Placeholder

                </div>

            );

        case "execution":

            return(

                <div>

                    Execution Placeholder

                </div>

            );

        case "audit":

            return(

                <div>

                    Audit Trail Placeholder

                </div>

            );

        default:

            return(

                <div>

                    Survey Placeholder

                </div>

            );

    }

}