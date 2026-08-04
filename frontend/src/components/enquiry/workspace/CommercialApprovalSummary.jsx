import { useEffect, useState } from "react";

import {
    getApprovalHistory,
    recordCommercialApprovalDecision
} from "../../../services/approvalBoardService";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

function formatDate(value){

    if(!value) return "-";

    return value.slice(0, 10);

}

function pillClassFor(status){

    if(status==="Approved" || status==="APPROVED") return "green";
    if(status==="Rejected" || status==="REJECTED") return "red";
    if(status==="Pending" || !status) return "gray";
    return "blue";

}

export default function CommercialApprovalSummary({

    enquiry,

    survey,

    opsSelection,

    quote,

    onTabChange,

    reload

}){

    const [history, setHistory] = useState([]);

    const [approvedBy, setApprovedBy] = useState("");
    const [note, setNote] = useState("");
    const [finalValue, setFinalValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(()=>{

        if(!quote?.ops_selection_id){
            return;
        }

        async function loadHistory(){

            try{

                const rows = await getApprovalHistory(quote.ops_selection_id);

                setHistory(rows);

            }

            catch(err){

                console.error(err);

            }

        }

        loadHistory();

    }, [quote?.ops_selection_id]);

    useEffect(()=>{

        if(quote?.combined_budgetary_value_min!=null && quote?.combined_budgetary_value_max!=null){

            setFinalValue(prev=>

                prev===""
                    ? String(Math.round((quote.combined_budgetary_value_min + quote.combined_budgetary_value_max)/2))
                    : prev

            );

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quote?.id]);

    if(!quote?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">

                    <h3 className="survey-summary-title">Commercial Approval</h3>

                    <p className="survey-empty">
                        Nothing to review yet - complete Survey, Ops Review,
                        Techno-Commercial Approval, and generate a quote first.
                    </p>

                </div>

            </div>

        );

    }

    const decisionForThisRevision = history.find(row => row.quote_id === quote.id);

    async function handleDecision(decision){

        if(!approvedBy.trim()){

            setError("Enter your name before recording a decision.");
            return;

        }

        if(!note.trim()){

            setError("A note is required - it goes into the decision history.");
            return;

        }

        if(decision==="APPROVED"){

            const value = Number(finalValue);

            if(!finalValue || Number.isNaN(value)){

                setError("Enter a final approved value.");
                return;

            }

            if(
                value < quote.combined_budgetary_value_min ||
                value > quote.combined_budgetary_value_max
            ){

                const proceed = window.confirm(
                    `${inr(value)} is outside the Techno-Commercial range ` +
                    `(${inr(quote.combined_budgetary_value_min)} - ` +
                    `${inr(quote.combined_budgetary_value_max)}). Proceed anyway?`
                );

                if(!proceed) return;

            }

        }

        setSaving(true);
        setError("");

        try{

            await recordCommercialApprovalDecision(

                quote.id,
                decision,
                approvedBy,
                note,
                decision==="APPROVED" ? Number(finalValue) : null,
                enquiry?.id

            );

            reload();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to record the decision.");

        }

        finally{

            setSaving(false);

        }

    }

    function handleSendBack(){

        onTabChange?.("quote-commercial");

    }

    const kpis = [

        { label:"Survey", value: survey ? "Complete" : "Pending" },
        { label:"Ops Review", value: opsSelection?.review_status ?? "Pending" },
        { label:"Techno-Comm.", value: quote.techno_status ?? "Pending" },
        { label:"Quote", value: quote.workflow_status ?? "-" },
        { label:"PO", value: "Not started" }

    ];

    return(

        <div className="survey-summary-grid">

            <div className="survey-summary-card" style={{gridColumn:"1 / -1"}}>

                <h3 className="survey-summary-title">
                    Commercial Approval
                    <span className="workspace-header-pill gray" style={{marginLeft:8}}>
                        Owner: Business Manager
                    </span>
                </h3>

                <div className="ops-recommendation-card" style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:12, marginBottom:14}}>

                    {
                        kpis.map(kpi=>(

                            <div key={kpi.label} style={{textAlign:"center"}}>
                                <div className="survey-summary-label">{kpi.label}</div>
                                <span className={`workspace-header-pill ${pillClassFor(kpi.value)}`}>
                                    {kpi.value}
                                </span>
                            </div>

                        ))
                    }

                </div>

                <div className="survey-summary-row">
                    <span className="survey-summary-label">Techno-Commercial range</span>
                    <span className="survey-summary-value">
                        {inr(quote.combined_budgetary_value_min)} - {inr(quote.combined_budgetary_value_max)}
                    </span>
                </div>

                {
                    quote.final_approved_value!=null && (

                        <div className="survey-summary-row">
                            <span className="survey-summary-label">Final approved value</span>
                            <span className="survey-summary-value">{inr(quote.final_approved_value)}</span>
                        </div>

                    )
                }

                <span
                    style={{cursor:"pointer", color:"#f97316", fontWeight:600}}
                    onClick={()=>onTabChange?.("quote-commercial")}
                >
                    View full commercial breakdown &rarr;
                </span>

                <h4 className="ops-subheading">Decision history</h4>

                <table className="ops-scoring-table">

                    <thead>
                        <tr>
                            <th>Approver</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Note</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            history.length ? history.map(row=>(

                                <tr key={row.id}>
                                    <td>{row.approved_by ?? "-"}</td>
                                    <td>
                                        <span className={`workspace-header-pill ${pillClassFor(row.approval_status)}`}>
                                            {row.approval_status}
                                        </span>
                                    </td>
                                    <td>{formatDate(row.approval_date)}</td>
                                    <td>{row.note ?? "-"}</td>
                                </tr>

                            )) : (

                                <tr>
                                    <td colSpan={4} className="survey-empty">No activity yet.</td>
                                </tr>

                            )
                        }

                    </tbody>

                </table>

                {
                    decisionForThisRevision ? (

                        <p className="survey-empty" style={{marginTop:10}}>
                            This revision (v{quote.revision_number}) already has a
                            recorded decision. Save a new quote version for
                            further review.
                        </p>

                    ) : quote.revision_requested ? (

                        <p className="survey-empty" style={{marginTop:10}}>
                            A revision has been requested on this quote - waiting
                            on a new version before Commercial Approval can act.
                        </p>

                    ) : quote.techno_status !== "Approved" ? (

                        <p className="survey-empty" style={{marginTop:10}}>
                            Waiting on Techno-Commercial Approval.
                        </p>

                    ) : (

                        <>

                            <div className="ops-override-form" style={{marginTop:12}}>

                                <input
                                    placeholder="Your name"
                                    value={approvedBy}
                                    onChange={e=>setApprovedBy(e.target.value)}
                                />

                                <input
                                    placeholder="Note - why this value / decision"
                                    value={note}
                                    onChange={e=>setNote(e.target.value)}
                                />

                                <input
                                    type="number"
                                    placeholder="Final approved value (INR)"
                                    value={finalValue}
                                    onChange={e=>setFinalValue(e.target.value)}
                                />

                            </div>

                            {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

                            <div className="survey-actions" style={{marginTop:10}}>

                                <button
                                    className="survey-action-button survey-action-button-orange"
                                    onClick={()=>handleDecision("APPROVED")}
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Approve (set final value)"}
                                </button>

                                <button
                                    className="survey-action-button survey-action-button-danger"
                                    onClick={()=>handleDecision("REJECTED")}
                                    disabled={saving}
                                >
                                    Reject
                                </button>

                                <button
                                    className="survey-action-button"
                                    onClick={handleSendBack}
                                    disabled={saving}
                                    title="Use Request Revision on the Quote & Commercial tab"
                                >
                                    Send back for review
                                </button>

                            </div>

                        </>

                    )
                }

            </div>

        </div>

    );

}
