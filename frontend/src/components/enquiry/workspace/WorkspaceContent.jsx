import SurveySummary from "./SurveySummary";

import SurveyWorkspace from "./SurveyWorkspace";

import OpsReviewSummary from "./OpsReviewSummary";

import TechnoCommercialApprovalSummary from "./TechnoCommercialApprovalSummary";

import QuoteCommercialSummary from "./QuoteCommercialSummary";

import CommercialApprovalSummary from "./CommercialApprovalSummary";

import POSummary from "./POSummary";
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

    prefillData,

    assetProfile,

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

                    prefillData={prefillData}

                    assetProfile={assetProfile}

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

                <POSummary

                    enquiry={enquiry}

                    reload={reload}

                />

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