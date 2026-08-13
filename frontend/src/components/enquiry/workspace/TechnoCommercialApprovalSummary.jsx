import { useState } from "react";

import {
    saveTechnoApproval
} from "../../../services/technoCommercialQuoteService";

import {
    advanceStageAtLeast,
    setEnquiryStage
} from "../../../services/enquiryWorkspaceService";

import {
    saveOpsReviewDecision
} from "../../../services/opsSelectorService";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

export default function TechnoCommercialApprovalSummary({

    enquiry,

    opsSelection,

    quote,

    reload

}){

    const [approvedBy, setApprovedBy] = useState("");

    const [note, setNote] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    if(!quote?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">

                    <h3 className="survey-summary-title">Techno-Commercial Approval</h3>

                    <p className="survey-empty">

                        Quote not generated yet - go to Ops Review and save
                        the deployment plan first.

                    </p>

                </div>

            </div>

        );

    }

    const opsReviewApproved = opsSelection?.review_status === "Approved";

    async function handleDecision(status, nextStage){

        if(!approvedBy.trim()){

            setError("Enter your name in \"Approved by\" before deciding.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await saveTechnoApproval(

                quote.id,

                status,

                approvedBy,

                note

            );

            if(status==="Approved"){

                await advanceStageAtLeast(enquiry.id, "COMMERCIAL_APPROVAL");

            }
            else{

                await setEnquiryStage(enquiry.id, nextStage);

                // Ops Review must show a clean, unapproved state when the
                // case lands back there - not the stale "Approved" from
                // before this send-back.
                if(opsSelection?.id){

                    await saveOpsReviewDecision(
                        opsSelection.id,
                        "Pending",
                        approvedBy,
                        "Reset - sent back from Techno-Commercial Approval"
                    );

                }

            }

            reload();

        }

        catch(err){

            console.error(err);

            setError(

                err?.detail ||
                "Unable to save the decision."

            );

        }

        finally{

            setSaving(false);

        }

    }

    const status = quote.techno_status ?? "Pending";

    let pillClass = "gray";

    if(status==="Approved") pillClass = "blue";

    if(status==="Sent back") pillClass = "red";

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

            <div className="survey-summary-card ops-recommendation-card">

                <h3 className="survey-summary-title">

                    Techno-Commercial Approval

                </h3>

                <p className="survey-empty">

                    Confirms the technical package and the auto-generated
                    quote range are sound together.

                </p>

                <div className="survey-summary-body">

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Status</span>
                        <span className={`workspace-header-pill ${pillClass}`}>{status}</span>
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

                <div className="survey-summary-row" style={{marginTop:12}}>
                    <span className="survey-summary-label">Approved by / date</span>
                    <span className="survey-summary-value">

                        {

                            quote.techno_approved_date
                                ? `${quote.techno_approved_by} on ${quote.techno_approved_date}`
                                : "Not yet approved"

                        }

                    </span>
                </div>

                {

                    quote.techno_note && (

                        <p className="survey-empty" style={{marginTop:8}}>{quote.techno_note}</p>

                    )

                }

                <div className="ops-override-form" style={{marginTop:12}}>

                    <input
                        placeholder="Approved by (your name)"
                        value={approvedBy}
                        onChange={e=>setApprovedBy(e.target.value)}
                    />

                    <input
                        placeholder="Note (e.g. Technical and commercial package confirmed together)"
                        value={note}
                        onChange={e=>setNote(e.target.value)}
                    />

                </div>

                {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

                <div className="survey-actions" style={{marginTop:12}}>

                    {

                        opsReviewApproved ? (

                            <>

                                <button

                                    className="survey-action-button survey-action-button-orange"

                                    onClick={()=>handleDecision("Approved")}

                                    disabled={saving}

                                >

                                    {saving ? "Saving..." : "Approve & Send to Commercial Approval"}

                                </button>

                                <button

                                    className="survey-action-button survey-action-button-danger"

                                    onClick={()=>handleDecision("Sent back", "OPS_REVIEW")}

                                    disabled={saving}

                                >

                                    {saving ? "Saving..." : "Send Back to Ops Review"}

                                </button>

                            </>

                        ) : (

                            <span className="survey-empty" style={{alignSelf:"center"}}>

                                Waiting on Ops Review to approve first.

                            </span>

                        )

                    }

                </div>

            </div>

        </div>

    );

}
