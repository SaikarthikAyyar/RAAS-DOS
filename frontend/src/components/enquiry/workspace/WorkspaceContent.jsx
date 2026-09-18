import SurveySummary from "./SurveySummary";

import SurveyWorkspace from "./SurveyWorkspace";

import OpsReviewSummary from "./OpsReviewSummary";

import TechnoCommercialReviewSummary from "./TechnoCommercialReviewSummary";

import QuoteCommercialSummary from "./QuoteCommercialSummary";

import CommercialApprovalSummary from "./CommercialApprovalSummary";

import POSummary from "./POSummary";

import JobCreationSummary from "./JobCreationSummary";

import ExecutionWorkspaceSummary from "./ExecutionWorkspaceSummary";
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

    let panel;

    switch(

        activeTab

    ){

        case "survey":

            panel = (

                <SurveySummary

                    enquiry={enquiry}

                    survey={survey}

                    prefillData={prefillData}

                    assetProfile={assetProfile}

                    quote={quote}

                    reload={reload}

                />

            );

            break;

        case "ops-review":

            panel = (

                <OpsReviewSummary

                    enquiry={enquiry}

                    opsSelection={opsSelection}

                    opsScoring={opsScoring}

                    dewatering={dewatering}

                    reload={reload}

                />

            );

            break;

        case "techno-commercial-approval":

            panel = (

                <TechnoCommercialReviewSummary

                    opsSelection={opsSelection}

                    quote={quote}

                />

            );

            break;

        case "quote-commercial":

            panel = (

                <QuoteCommercialSummary

                    enquiry={enquiry}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

            break;

        case "commercial-approval":

            panel = (

                <CommercialApprovalSummary

                    enquiry={enquiry}

                    survey={survey}

                    opsSelection={opsSelection}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

            break;

        case "po":

            panel = (

                <POSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

            break;

        case "job-created":

            panel = (

                <JobCreationSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

            break;

        case "execution":

            panel = (

                <ExecutionWorkspaceSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

            break;

        case "audit":

            panel = (

                <div>

                    Audit Trail Placeholder

                </div>

            );

            break;

        default:

            panel = (

                <div>

                    Survey Placeholder

                </div>

            );

    }

    // Keyed on activeTab so a tab switch remounts this wrapper and
    // re-triggers ui-fade-in - a lightweight cross-fade between panels
    // without a separate animation library.
    return(

        <div className="ui-fade-in" key={activeTab}>

            {panel}

        </div>

    );

}