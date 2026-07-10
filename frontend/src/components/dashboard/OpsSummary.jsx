// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";

// ====================================
// COMPONENT
// ====================================

export default function OpsSummary({

    summary

}){

    console.log(

        "\n========== OPERATIONS SUMMARY COMPONENT =========="

    );

    console.log(

        summary

    );

    console.log(

        "=============================================\n"

    );

    if(

        !summary

    ){

        return null;

    }

    return(

    <div className="dashboard-summary-card">

        <div className="dashboard-summary-header">

            <h3>

                Operations Survey Summary

            </h3>

        </div>

        <div className="dashboard-summary-grid">

            <div className="dashboard-summary-item">

                <span>

                    Ops ID

                </span>

                <strong>

                    OPS-{summary.survey_id}

                </strong>

            </div>



            <div className="dashboard-summary-item">

                <span>

                    Doability

                </span>

                <strong>

                    {summary.doability ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Service Configuration

                </span>

                <strong>

                    {summary.service_configuration ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Recommended Machine

                </span>

                <strong>

                    {summary.recommended_machine ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Pump Hose Package

                </span>

                <strong>

                    {summary.pump_hose_package ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Accessories

                </span>

                <strong>

                    {summary.accessories ?? "-"}

                </strong>

            </div>



            <div className="dashboard-summary-item">

                <span>

                    Mobilisation Days

                </span>

                <strong>

                    {summary.mobilisation_days ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Setup Days

                </span>

                <strong>

                    {summary.setup_days ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Execution Days

                </span>

                <strong>

                    {summary.execution_days ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Demobilisation Days

                </span>

                <strong>

                    {summary.demob_days ?? "-"}

                </strong>

            </div>


            <div className="dashboard-summary-item">

                <span>

                    Total Job Days

                </span>

                <strong>

                    {summary.total_job_days ?? "-"}

                </strong>

            </div>


            <div className="dashboard-summary-item">

                <span>

                    Manpower Required

                </span>

                <strong>

                    {summary.manpower_required ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Approval Gate

                </span>

                <strong>

                    {summary.approval_gate ?? "-"}

                </strong>

            </div>

        </div>

    </div>

);

}

// ====================================
// CARD
// ====================================

function SummaryCard({

    title,

    value

}){

    return(

        <div className="dashboard-info-card">

            <div className="dashboard-info-title">

                {title}

            </div>

            <div className="dashboard-info-value">

                {

                    value ??

                    "-"

                }

            </div>

        </div>

    );

}