import SurveySummary from "./SurveySummary";

import SurveyWorkspace from "./SurveyWorkspace";

import OpsReviewSummary from "./OpsReviewSummary";

import TechnoCommercialApprovalSummary from "./TechnoCommercialApprovalSummary";

import QuoteCommercialSummary from "./QuoteCommercialSummary";

import CommercialApprovalSummary from "./CommercialApprovalSummary";
// ====================================
// COMPONENT
// ====================================

export default function WorkspaceContent({

    activeTab,

    onTabChange,

    reload,

    enquiry,

    customer,

    survey,

    opsSelection,

    opsScoring,

    dewatering,

    quote

}){

    switch(

        activeTab

    ){

        case "survey":

            return(

                <SurveySummary

                    enquiry={enquiry}

                    survey={survey}

                    reload={reload}

                />

            );

        case "ops-review":

            return(

                <OpsReviewSummary

                    enquiry={enquiry}

                    opsSelection={opsSelection}

                    opsScoring={opsScoring}

                    dewatering={dewatering}

                    reload={reload}

                />

            );

        case "techno-commercial-approval":

            return(

                <TechnoCommercialApprovalSummary

                    enquiry={enquiry}

                    opsSelection={opsSelection}

                    quote={quote}

                    reload={reload}

                />

            );

        case "quote-commercial":

            return(

                <QuoteCommercialSummary

                    enquiry={enquiry}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

        case "commercial-approval":

            return(

                <CommercialApprovalSummary

                    enquiry={enquiry}

                    survey={survey}

                    opsSelection={opsSelection}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

        case "po":

            return(

                <div>

                    PO Placeholder

                </div>

            );

        case "job-created":

            return(

                <div>

                    Job Created Placeholder

                </div>

            );

        case "execution":

            return(

                <div>

                    Execution / Job Placeholder

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