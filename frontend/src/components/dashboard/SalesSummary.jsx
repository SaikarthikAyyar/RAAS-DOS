// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";

// ====================================
// COMPONENT
// ====================================

export default function SalesSummary({

    summary

}){

    console.log(

        "\n========== SALES SUMMARY COMPONENT =========="

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

                Sales Survey Summary

            </h3>

        </div>

        <div className="dashboard-summary-grid">

            <div className="dashboard-summary-item">

                <span>

                    Survey ID

                </span>

                <strong>

                    SS-{summary.survey_id}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Workflow

                </span>

                <strong>

                    {summary.workflow ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Survey Date

                </span>

                <strong>

                    {summary.survey_date ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Tank Type

                </span>

                <strong>

                    {summary.tank_type ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Job Type

                </span>

                <strong>

                    {summary.job_type ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Material

                </span>

                <strong>

                    {summary.material ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Sludge

                </span>

                <strong>

                    {summary.sludge ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Estimated Volume

                </span>

                <strong>

                    {summary.estimated_volume ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Average Output

                </span>

                <strong>

                    {summary.average_output ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Solids %

                </span>

                <strong>

                    {summary.solids ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Hazard

                </span>

                <strong>

                    {summary.hazard ?? "-"}

                </strong>

            </div>

            <div className="dashboard-summary-item">

                <span>

                    Pumpable

                </span>

                <strong>

                    {

                        summary.pumpable == null

                            ? "-"

                            : String(summary.pumpable)

                    }

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