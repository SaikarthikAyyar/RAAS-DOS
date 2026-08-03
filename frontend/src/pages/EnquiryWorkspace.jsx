import {

    useEffect,

    useState

} from "react";

import {

    useParams

} from "react-router-dom";

import {

    getEnquiry

} from "../services/enquiryWorkspaceService";

import {

    getCustomerRequest

} from "../services/customerService";

import {

    getCustomerSurvey

} from "../services/salesSurveyService";

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

    console.log(

        "[Workspace] Enquiry ID:",

        enquiryId

    );

    // Temporary placeholder.
    // In Phase 2 this will come from React Router state.
    const [enquiry, setEnquiry] = useState(null);

    const [customer, setCustomer] = useState(null);

    const [survey, setSurvey] = useState(null);

    const [opsSelection, setOpsSelection] = useState(null);

    const [opsScoring, setOpsScoring] = useState([]);

    const [dewatering, setDewatering] = useState(null);

    const [quote, setQuote] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");




    useEffect(

        ()=>{

            async function loadEnquiry(){

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

            }

            loadEnquiry();

        },

        [

            enquiryId

        ]

    );

    const [activeTab, setActiveTab] = useState("survey");

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

                enquiry={enquiry}

                customer={customer}

                survey={survey}

                opsSelection={opsSelection}

                opsScoring={opsScoring}

                dewatering={dewatering}

                quote={quote}

            />

        </div>

    );

}