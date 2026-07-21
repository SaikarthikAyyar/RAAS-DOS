// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";

// ====================================
// COMPONENT
// ====================================

export default function QuoteSummary({

    summary

}){

    if(!summary){

        return null;

    }

    return(

        <div className="dashboard-summary-card">

            <div className="dashboard-summary-header">

                <h3>

                    OPS Summary (Quote Pending)

                </h3>

            </div>

            <div className="dashboard-summary-grid">

                <div className="dashboard-summary-item">

                    <span>

                        Quote ID

                    </span>

                    <strong>

                        QT-{summary.quote_id}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Revision

                    </span>

                    <strong>

                        {summary.revision}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Workflow

                    </span>

                    <strong>

                        {summary.workflow_status}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Recommended Machine

                    </span>

                    <strong>

                        {summary.recommended_machine}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Service Configuration

                    </span>

                    <strong>

                        {summary.service_configuration}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Pump Hose Package

                    </span>

                    <strong>

                        {summary.pump_hose_package}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Dewatering Method

                    </span>

                    <strong>

                        {summary.dewatering_method}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Approval Gate

                    </span>

                    <strong>

                        {summary.approval_gate}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Cleaning Quote

                    </span>

                    <strong>

                        ₹ {summary.cleaning_quote}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Dewatering Add-on

                    </span>

                    <strong>

                        ₹ {summary.dewatering_addon}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Combined Budgetary Value

                    </span>

                    <strong>

                        ₹ {summary.combined_budgetary_value}

                    </strong>

                </div>

            </div>

        </div>

    );

}