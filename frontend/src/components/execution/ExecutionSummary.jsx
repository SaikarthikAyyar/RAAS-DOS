// ====================================
// IMPORTS
// ====================================

import "./Execution.css";


// ====================================
// EXECUTION SUMMARY
// ====================================

export default function ExecutionSummary({

    execution

}){

    if(!execution){

        return null;

    }

    return(

        <div className="execution-card">

            <h2 className="execution-section-title">

                Execution Summary

            </h2>

            <div className="execution-summary-grid">

                <div className="execution-summary-item">

                    <span>

                        Execution ID

                    </span>

                    <strong>

                        {execution.id}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Job ID

                    </span>

                    <strong>

                        {execution.job_creation_id}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Customer Request

                    </span>

                    <strong>

                        {execution.customer_request_id}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Workflow

                    </span>

                    <strong>

                        {execution.workflow_status}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Current Phase

                    </span>

                    <strong>

                        {execution.current_phase}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Current Activity

                    </span>

                    <strong>

                        {execution.current_activity || "-"}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Transport Status

                    </span>

                    <strong>

                        {execution.transport_status}

                    </strong>

                </div>

                <div className="execution-summary-item">

                    <span>

                        Delay

                    </span>

                    <strong>

                        {execution.delay_days} Days

                    </strong>

                </div>

            </div>

            <br/>

            <div className="execution-progress">

                <div

                    className="execution-progress-fill"

                    style={{

                        width:`${execution.execution_progress}%`

                    }}

                />

            </div>

            <div
                style={{
                    marginTop:"10px",
                    textAlign:"right",
                    fontWeight:"700"
                }}
            >

                {execution.execution_progress}%

            </div>

        </div>

    );

}