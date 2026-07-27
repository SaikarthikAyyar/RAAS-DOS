import { useEffect, useState } from "react";

import ExecutionSummary
from "../components/execution/ExecutionSummary";

import Phase1Mobilisation
from "../components/execution/Phase1Mobilisation";

import Phase2Execution
from "../components/execution/Phase2Execution";

import Phase3Demobilisation
from "../components/execution/Phase3Demobilisation";

import {

    getCustomerLiveOrder,

    getCustomerExecutionIds

}

from "../services/customerLiveOrderService";


export default function CustomerLiveOrder(){

    const [

        customerRequestId,

        setCustomerRequestId

    ] = useState("");

    const [

        invoice,

        setInvoice

    ] = useState(null);

    const [

        customerIds,

        setCustomerIds

    ] = useState([]);

    useEffect(()=>{

        loadCustomerIds();

    },[]);



    async function loadExecution(){

        if(!customerRequestId){

            return;

        }

        try{

            const response = await getCustomerLiveOrder(

                customerRequestId

            );

            setInvoice(response);

        }

        catch(error){

            console.error(error);

        }

    }

    


    if(

        !invoice ||

        !invoice.execution

    ){

        return(

            <div className="customer-live-order-page">

                <h1>

                    Customer Live Order

                </h1>

                <div
                    style={{
                        display:"flex",
                        gap:"12px",
                        marginBottom:"20px"
                    }}
                >

                    <input

                        type="number"

                        placeholder="Customer Request ID"

                        value={customerRequestId}

                        onChange={e=>

                            setCustomerRequestId(

                                e.target.value

                            )

                        }

                    />

                    <button

                        onClick={loadExecution}

                    >

                        Load Execution

                    </button>

                </div>

                <p>

                    No active execution found.

                </p>

            </div>

        );

    }




    const execution =

        invoice.execution;


    return(

        <div className="customer-live-order-page">

            <h1>

                Customer Live Order

            </h1>

            <div className="dashboard-section">

                <ExecutionSummary

                    execution={execution}

                />

            </div>

            {

                execution.current_phase === "PHASE_1" && (

                    <div className="dashboard-section">

                        <Phase1Mobilisation

                            execution={execution}

                            refreshExecution={()=>{}}

                            readOnly={true}

                        />

                    </div>

                )

            }

            {

                execution.current_phase === "PHASE_2" && (

                    <div className="dashboard-section">

                        <Phase2Execution

                            execution={execution}

                            refreshExecution={()=>{}}

                            readOnly={true}

                        />

                    </div>

                )

            }

            {

                execution.current_phase === "PHASE_3" && (

                    <div className="dashboard-section">

                        <Phase3Demobilisation

                            execution={execution}

                            refreshExecution={()=>{}}

                            readOnly={true}

                        />

                    </div>

                )

            }

        </div>

    );

}