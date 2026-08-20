import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

// ====================================
// TECHNO-COMMERCIAL REVIEW (Phase 22)
// Renamed from "Techno-Commercial Approval" - this tab is no longer
// an approval gate (that responsibility folded into Ops Review's own
// decision, with the real hub-gated approval now living on the
// Quote & Commercial tab instead). Purely a read-only display of the
// same commercial breakdown snapshot Ops Review's Deployment Plan
// card generates, always viewable whenever a quote exists, regardless
// of current stage.
// ====================================

export default function TechnoCommercialReviewSummary({

    opsSelection,

    quote

}){

    if(!quote?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">

                    <h3 className="survey-summary-title">Techno-Commercial Review</h3>

                    <p className="survey-empty">

                        Quote not generated yet - go to Ops Review and save
                        the deployment plan first.

                    </p>

                </div>

            </div>

        );

    }

    let pillClass = "gray";

    if(quote.quote_commercial_status==="Approved") pillClass = "blue";

    const rows = [

        { label:"Mobilisation", min:quote.mobilisation_cost_min, max:quote.mobilisation_cost_max },
        { label:"Setup / Access", min:quote.setup_cost_min, max:quote.setup_cost_max },
        { label:"Execution (machine)", min:quote.execution_cost_min, max:quote.execution_cost_max },
        { label:"Pump Addon", min:quote.pump_addon_cost_min, max:quote.pump_addon_cost_max },
        { label:"Documentation Buffer", min:quote.documentation_buffer, max:quote.documentation_buffer },
        { label:"Access Support Buffer", min:quote.access_support_buffer, max:quote.access_support_buffer },
        { label:"Dewatering Add-on", min:quote.dewatering_addon_min, max:quote.dewatering_addon_max }

    ];

    return(

        <div className="survey-summary-grid">

            <div className="survey-summary-card ops-recommendation-card" data-guide-id="tcr-bifurcation-table" style={{position:"relative"}}>

                <ComponentExplainerIcon tabId="techno-commercial-approval" componentId="tcr-bifurcation-table" floating/>

                <h3 className="survey-summary-title">

                    Techno-Commercial Review

                </h3>

                <p className="survey-empty">

                    Read-only view of the technical package and the
                    auto-generated quote range - approval now happens
                    together with Ops Review's own decision, and again
                    at the Quote & Commercial gate.

                </p>

                <div className="survey-summary-body">

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Quote &amp; Commercial Status</span>
                        <span className={`workspace-header-pill ${pillClass}`}>{quote.quote_commercial_status ?? "Pending"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Ops Review Status</span>
                        <span className="survey-summary-value">{opsSelection?.review_status ?? "Pending"}</span>
                    </div>

                </div>

                <h4 className="ops-subheading">Full Bifurcation (Min-Max Range)</h4>

                <table className="ops-scoring-table">

                    <thead>
                        <tr>
                            <th>Line</th>
                            <th>Min</th>
                            <th>Max</th>
                        </tr>
                    </thead>

                    <tbody>

                        {

                            rows.map(row=>(

                                <tr key={row.label}>
                                    <td>{row.label}</td>
                                    <td>{inr(row.min)}</td>
                                    <td>{inr(row.max)}</td>
                                </tr>

                            ))

                        }

                        <tr>
                            <td><b>Direct Cost Subtotal</b></td>
                            <td><b>{inr(quote.direct_cost_min)}</b></td>
                            <td><b>{inr(quote.direct_cost_max)}</b></td>
                        </tr>

                        <tr>
                            <td>Overhead</td>
                            <td>{inr(quote.overhead_cost_min)}</td>
                            <td>{inr(quote.overhead_cost_max)}</td>
                        </tr>

                        <tr>
                            <td>Contingency</td>
                            <td>{inr(quote.contingency_cost_min)}</td>
                            <td>{inr(quote.contingency_cost_max)}</td>
                        </tr>

                        <tr>
                            <td>Margin ({Math.round((quote.margin_percentage ?? 0) * 100)}%)</td>
                            <td>{inr(quote.margin_value_min)}</td>
                            <td>{inr(quote.margin_value_max)}</td>
                        </tr>

                        <tr className="ops-scoring-top">
                            <td><b>TECHNO-COMMERCIAL RANGE</b></td>
                            <td><b>{inr(quote.combined_budgetary_value_min)}</b></td>
                            <td><b>{inr(quote.combined_budgetary_value_max)}</b></td>
                        </tr>

                    </tbody>

                </table>

                {

                    quote.quote_commercial_note && (

                        <p className="survey-empty" style={{marginTop:8}}>{quote.quote_commercial_note}</p>

                    )

                }

            </div>

        </div>

    );

}
