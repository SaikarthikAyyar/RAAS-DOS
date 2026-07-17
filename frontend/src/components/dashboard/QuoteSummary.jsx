// ====================================
// COMPONENT
// ====================================

import "./Dashboard.css";

export default function QuoteSummary({

    summary,

    onApprove,

    onRevision,

    isCustomer = false

}){

    if(!summary){

        return null;

    }

    return(

        <div className="dashboard-summary-card">

            <div className="dashboard-summary-header">

                <h3>

                    Techno Commercial Quote

                </h3>

            </div>

            <div className="dashboard-summary-grid">

                <SummaryCard
                    title="Quote ID"
                    value={`Q-${summary.quote_id}`}
                />

                <SummaryCard
                    title="Revision"
                    value={summary.revision}
                />

                <SummaryCard
                    title="Workflow"
                    value={summary.workflow_status}
                />

                <SummaryCard
                    title="Machine"
                    value={summary.recommended_machine}
                />

                <SummaryCard
                    title="Configuration"
                    value={summary.service_configuration}
                />

                <SummaryCard
                    title="Pump Package"
                    value={summary.pump_hose_package}
                />

                <SummaryCard
                    title="Dewatering"
                    value={summary.dewatering_method}
                />

                <SummaryCard
                    title="Approval Gate"
                    value={summary.approval_gate}
                />

                <SummaryCard
                    title="Cleaning Quote"
                    value={`₹ ${summary.cleaning_quote}`}
                />

                <SummaryCard
                    title="Dewatering Add-on"
                    value={`₹ ${summary.dewatering_addon}`}
                />

                <SummaryCard
                    title="Budgetary Value"
                    value={`₹ ${summary.combined_budgetary_value}`}
                />

            </div>

            {

                isCustomer &&

                summary.workflow_status === "CUSTOMER_REVIEW" &&

                <div className="dashboard-action-row">

                    <button

                        className="dashboard-primary-action"

                        onClick={onApprove}

                    >

                        Approve Quote

                    </button>

                    <button

                        className="dashboard-secondary-action"

                        onClick={onRevision}

                    >

                        Request Revision

                    </button>

                </div>

            }

        </div>

    );

}

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

                {value ?? "-"}

            </div>

        </div>

    );

}