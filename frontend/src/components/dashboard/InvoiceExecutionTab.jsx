import ExecutionSummary from "../execution/ExecutionSummary";

import Phase1Mobilisation from "../execution/Phase1Mobilisation";

import Phase2Execution from "../execution/Phase2Execution";

import Phase3Demobilisation from "../execution/Phase3Demobilisation";

export default function InvoiceExecutionTab({

    invoice

}){

    if(!invoice){

        return null;

    }

    const execution =

        invoice.execution;

    if(!execution){

        return(

            <div className="dashboard-section">

                <h2>

                    Execution

                </h2>

                <p>

                    No execution has been created for this invoice.

                </p>

            </div>

        );

    }

    return(

        <>

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

        </>

    );

}