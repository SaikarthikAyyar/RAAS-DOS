// ====================================
// IMPORTS
// ====================================

import "./Execution.css";

// Matches Phase1Mobilisation.jsx/Phase3Demobilisation.jsx's own map -
// the underlying value is derived server-side, this is display only.
const TRANSPORT_STATUS_LABELS = {
    WAITING: "Not started",
    IN_TRANSIT: "In transit",
    REACHED: "Reached",
    COMPLETED: "Completed"
};


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

                        {TRANSPORT_STATUS_LABELS[execution.transport_status] || execution.transport_status}

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
                    marginTop:"6px",
                    textAlign:"right",
                    fontWeight:"700",
                    fontSize:"12px",
                    color:"var(--ink)"
                }}
            >

                {execution.execution_progress}%

            </div>

        </div>

    );

}