import {

    useCallback,

    useEffect,

    useState

} from "react";

import {

    useParams,

    useLocation

} from "react-router-dom";

import {

    getEnquiry

} from "../services/enquiryWorkspaceService";

import {

    getCustomerRequest

} from "../services/customerService";

import {

    getCustomerSurvey,

    getSalesPrefill

} from "../services/salesSurveyService";

import {

    getAsset

} from "../services/customerMasterService";

import {

    getOpsSelection,

    getOpsScoring

} from "../services/opsSelectorService";

import {

    getDewateringByOpsSelection

} from "../services/dewateringService";

import {

    getQuote

} from "../services/technoCommercialQuoteService";

import "../components/enquiry/workspace/EnquiryWorkspace.css";

import WorkspaceHeader from "../components/enquiry/workspace/WorkspaceHeader";
import WorkflowStepper from "../components/enquiry/workspace/WorkflowStepper";
import WorkflowTabs from "../components/enquiry/workspace/WorkflowTabs";
import WorkspaceContent from "../components/enquiry/workspace/WorkspaceContent";



export default function EnquiryWorkspace() {

    const {

        enquiryId

    } = useParams();

    const location = useLocation();

    console.log(

        "[Workspace] Enquiry ID:",

        enquiryId

    );

    // Temporary placeholder.
    // In Phase 2 this will come from React Router state.
    const [enquiry, setEnquiry] = useState(null);

    const [customer, setCustomer] = useState(null);

    const [survey, setSurvey] = useState(null);

    const [prefillData, setPrefillData] = useState(null);

    const [assetProfile, setAssetProfile] = useState(null);

    const [opsSelection, setOpsSelection] = useState(null);

    const [opsScoring, setOpsScoring] = useState([]);

    const [dewatering, setDewatering] = useState(null);

    const [quote, setQuote] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");




    const loadEnquiry = useCallback(

        async()=>{

                console.log(

                    "[Workspace] Loading Enquiry:",

                    enquiryId

                );

                try{

                    const response = await getEnquiry(

                        enquiryId

                    );

                    console.log(

                        "[Workspace] Response:",

                        response

                    );

                    setEnquiry(

                        response

                    );

                    const customerData = await getCustomerRequest(

                        response.customer_request_id

                    );

                    setCustomer(

                        customerData

                    );

                    if (response.sales_survey_id) {

                        const surveyData = await getCustomerSurvey(
                            response.customer_request_id,
                            response.sales_survey_id
                        );

                        setSurvey(surveyData);

                    }

                    else {

                        const prefill = await getSalesPrefill(
                            response.customer_request_id
                        );

                        setPrefillData(prefill);

                    }

                    if (response.asset_id) {

                        const assetData = await getAsset(
                            response.asset_id
                        );

                        setAssetProfile(assetData);

                    }

                    if (response.ops_selector_id) {

                        const opsData = await getOpsSelection(
                            response.ops_selector_id
                        );

                        setOpsSelection(opsData);

                        const scoringData = await getOpsScoring(
                            response.ops_selector_id
                        );

                        setOpsScoring(scoringData);

                        const dewateringData = await getDewateringByOpsSelection(
                            response.ops_selector_id
                        );

                        setDewatering(dewateringData);

                        const quoteData = await getQuote(
                            response.ops_selector_id
                        );

                        setQuote(quoteData?.id ? quoteData : null);

                    }

                }

                catch(error){

                    console.error(

                        error

                    );

                    setError(

                        "Unable to load enquiry."

                    );

                }

                finally{

                    setLoading(

                        false

                    );

                }

        },

        [

            enquiryId

        ]

    );

    useEffect(

        ()=>{

            loadEnquiry();

        },

        [

            loadEnquiry

        ]

    );

    const [activeTab, setActiveTab] = useState(

        location.state?.initialTab || "survey"

    );

    if(

        loading

    ){

        return(

            <div>

                Loading enquiry...

            </div>

        );

    }

    if(

        error

    ){

        return(

            <div>

                {error}

            </div>

        );

    }

    return (

        <div className="enquiry-workspace">

            <WorkspaceHeader
                enquiry={enquiry}
                customer={customer}
            />

            <WorkflowStepper

                currentStage={enquiry.stage}

            />

            <WorkflowTabs

                activeTab={activeTab}

                onTabChange={setActiveTab}

            />

            <WorkspaceContent

                activeTab={activeTab}

                onTabChange={setActiveTab}

                reload={loadEnquiry}

                enquiry={enquiry}

                customer={customer}

                survey={survey}

                prefillData={prefillData}

                assetProfile={assetProfile}

                opsSelection={opsSelection}

                opsScoring={opsScoring}

                dewatering={dewatering}

                quote={quote}

            />

        </div>

    );

}