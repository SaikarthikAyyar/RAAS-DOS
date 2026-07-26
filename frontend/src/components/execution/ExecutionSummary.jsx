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

        <div
            style={{

                border:"1px solid #444",

                borderRadius:"8px",

                padding:"20px",

                marginBottom:"20px",

                background:"#1f1f1f",

                color:"#ffffff"

            }}
        >

            <h2>

                Execution Summary

            </h2>

            <hr/>

            <p>

                <strong>Execution ID :</strong>

                {" "}

                {execution.id}

            </p>

            <p>

                <strong>Job ID :</strong>

                {" "}

                {execution.job_creation_id}

            </p>

            <p>

                <strong>Customer Request :</strong>

                {" "}

                {execution.customer_request_id}

            </p>

            <p>

                <strong>Workflow :</strong>

                {" "}

                {execution.workflow_status}

            </p>

            <p>

                <strong>Current Phase :</strong>

                {" "}

                {execution.current_phase}

            </p>

            <p>

                <strong>Execution Progress :</strong>

                {" "}

                {execution.execution_progress}%

            </p>

            <p>

                <strong>Current Activity :</strong>

                {" "}

                {execution.current_activity}

            </p>

            <p>

                <strong>Transport Status :</strong>

                {" "}

                {execution.transport_status}

            </p>

            <p>

                <strong>Planned Start :</strong>

                {" "}

                {execution.planned_start}

            </p>

            <p>

                <strong>Estimated Completion :</strong>

                {" "}

                {execution.estimated_completion}

            </p>

            <p>

                <strong>Actual Completion :</strong>

                {" "}

                {execution.actual_completion}

            </p>

            <p>

                <strong>Delay :</strong>

                {" "}

                {execution.delay_days}

                {" "}days

            </p>

        </div>

    );

}