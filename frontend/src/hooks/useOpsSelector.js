// ====================================
// IMPORTS
// ====================================

import {

useEffect,

useState,

useCallback

}

from "react";

import {

    getOpsPrefill,

    saveOpsSelector

}

from "../services/opsSelectorService";


// ====================================
// HOOK
// ====================================

export default function useOpsSelector(){

    const salesSurveyId = Number(

        localStorage.getItem(

            "ops_selector_sales_survey_id"

        )

    );

    const customerRequestId = Number(

        localStorage.getItem(

            "ops_selector_customer_request_id"

        )

    );

    const enquiryId = Number(

        localStorage.getItem(

            "ops_selector_enquiry_id"

        )

    );

    const [

        opsData,

        setOpsData

    ] = useState({

        inputs:{},

        customer_request_id:

            customerRequestId,

        sales_survey_id:

            salesSurveyId,

        enquiry_id:

            enquiryId,

        doability:"",

        service_configuration:"",

        recommended_machine:"",

        pump_hose_package:"",

        accessories:"",

        mobilisation_days:0,

        setup_days:0,

        execution_days:0,

        demob_days:0,

        total_job_days:0,

        manpower_required:"",

        approval_gate:"",

        internal_next_action:"",

        selection_reason:""

    });


    // ====================================
    // LOAD PREFILL
    // ====================================




    // ====================================
    // LOAD PREFILL
    // ====================================

    const loadPrefill = useCallback(async()=>{

        try{

            const data = await getOpsPrefill(

                salesSurveyId

            );

            setOpsData({

                ...data,

                customer_request_id: customerRequestId,

                sales_survey_id: salesSurveyId,

                enquiry_id: enquiryId

            });

        }

        catch(error){

            console.log(error);

        }

    },[
        salesSurveyId,
        customerRequestId,
        enquiryId
    ]);

    useEffect(()=>{

        if(!salesSurveyId){

            return;

        }

        loadPrefill();

    },[
        salesSurveyId,
        loadPrefill
    ]);


    // ====================================
    // UPDATE FIELD
    // ====================================

    function updateField(

        field,

        value

    ){

        setOpsData(

            previous=>({

                ...previous,

                [field]:

                    value

            })

        );

    }


    // ====================================
    // SAVE
    // ====================================

    async function saveOps(){

        try{

            const payload = {

                ...opsData,

                sales_survey_id: salesSurveyId,

                customer_request_id: customerRequestId,

                enquiry_id: enquiryId,

                // Convert accessories only if needed
                accessories:
                    Array.isArray(opsData.accessories)
                        ? opsData.accessories.join(", ")
                        : typeof opsData.accessories === "object"
                        && opsData.accessories !== null
                            ? Object.values(opsData.accessories).join(", ")
                            : (opsData.accessories ?? ""),

                total_job_days:
                    Number(opsData.mobilisation_days || 0) +
                    Number(opsData.setup_days || 0) +
                    Number(opsData.execution_days || 0) +
                    Number(opsData.demob_days || 0)

            };

            console.log(payload);

            const response = await saveOpsSelector(payload);

            if(response.detail){

                alert(response.detail);

                return;

            }

            alert("Ops Selection Saved Successfully.");

        }

        catch(error){

            console.log(error);

            alert("Unable to save Ops Selection.");

        }

    }


    // ====================================
    // RETURN
    // ====================================

    return{

        opsData,

        updateField,

        saveOps

    };

}