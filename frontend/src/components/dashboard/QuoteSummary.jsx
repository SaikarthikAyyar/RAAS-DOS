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

                OPS + Techno Commercial Quote

            </h3>

        </div>

        <div className="dashboard-summary-grid">

            <div className="dashboard-summary-item">
                <span>Quote ID</span>
                <strong>Q-{summary.quote_id}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Revision</span>
                <strong>{summary.revision}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Workflow</span>
                <strong>{summary.workflow_status}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Machine</span>
                <strong>{summary.recommended_machine}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Configuration</span>
                <strong>{summary.service_configuration}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Pump Package</span>
                <strong>{summary.pump_hose_package}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Dewatering</span>
                <strong>{summary.dewatering_method}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Approval Gate</span>
                <strong>{summary.approval_gate}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Cleaning Quote</span>
                <strong>₹ {summary.cleaning_quote}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Dewatering Add-on</span>
                <strong>₹ {summary.dewatering_addon}</strong>
            </div>

            <div className="dashboard-summary-item">
                <span>Budgetary Value</span>
                <strong>₹ {summary.combined_budgetary_value}</strong>
            </div>

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

