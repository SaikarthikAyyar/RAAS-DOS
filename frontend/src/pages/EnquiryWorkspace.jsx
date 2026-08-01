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

                enquiry={enquiry}

                customer={customer}

                survey={survey}

            />

        </div>

    );

}