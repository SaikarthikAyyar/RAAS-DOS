import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    getQuoteHistory,
    updateInternalExtra,
    updateValidTill,
    flagQuoteRevisionRequested
} from "../../../services/technoCommercialQuoteService";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

function formatDate(value){

    if(!value) return "-";

    return value.slice(0, 10);

}

export default function QuoteCommercialSummary({

    enquiry,

    quote,

    onTabChange,

    reload

}){

    const navigate = useNavigate();

    const [history, setHistory] = useState([]);

    const [revisionRequestedBy, setRevisionRequestedBy] = useState("");
    const [requestingRevision, setRequestingRevision] = useState(false);

    const [extraEnabled, setExtraEnabled] = useState(false);
    const [extraAmount, setExtraAmount] = useState("");
    const [extraNote, setExtraNote] = useState("");
    const [savingExtra, setSavingExtra] = useState(false);

    const [validTill, setValidTill] = useState("");
    const [savingValidTill, setSavingValidTill] = useState(false);

    const [showPreview, setShowPreview] = useState(false);

    const [error, setError] = useState("");

    useEffect(()=>{

        if(!quote?.id){
            return;
        }

        setExtraEnabled(!!quote.internal_extra_enabled);
        setExtraAmount(quote.internal_extra_amount ?? "");
        setExtraNote(quote.internal_extra_note ?? "");
        setValidTill(quote.valid_till ?? "");

        async function loadHistory(){

            try{

                const rows = await getQuoteHistory(quote.ops_selection_id);

                setHistory(rows);

            }

            catch(err){

                console.error(err);

            }

        }

        loadHistory();

    }, [quote?.id]);

    if(!quote?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">

                    <h3 className="survey-summary-title">Quote & Commercial</h3>

                    <p className="survey-empty">
                        Quote not yet generated - complete Survey, run the
                        algorithm, and save the Ops Deployment Plan first.
                    </p>

                </div>

            </div>

        );

    }

    const totalWithExtra =
        (quote.combined_budgetary_value_min ?? 0) +
        (extraEnabled ? Number(extraAmount) || 0 : 0);

    const totalWithExtraMax =
        (quote.combined_budgetary_value_max ?? 0) +
        (extraEnabled ? Number(extraAmount) || 0 : 0);

    async function handleSaveExtra(){

        setSavingExtra(true);
        setError("");

        try{

            await updateInternalExtra(
                quote.id,
                extraEnabled,
                extraEnabled ? (Number(extraAmount) || 0) : null,
                extraEnabled ? extraNote : null
            );

            reload();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to save internal addition.");

        }

        finally{

            setSavingExtra(false);

        }

    }

    async function handleSaveValidTill(){

        setSavingValidTill(true);
        setError("");

        try{

            await updateValidTill(quote.id, validTill || null);

            reload();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to save valid-till date.");

        }

        finally{

            setSavingValidTill(false);

        }

    }

    function handleOpenQuotesModule(){

        navigate("/quote", {
            state:{
                opsSelectionId: quote.ops_selection_id,
                enquiryId: enquiry?.id
            }
        });

    }

    async function handleRequestRevision(){

        if(!revisionRequestedBy.trim()){

            setError("Enter your name before requesting a revision.");
            return;

        }

        setRequestingRevision(true);
        setError("");

        try{

            await flagQuoteRevisionRequested(quote.id, revisionRequestedBy);

            reload();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to request a revision.");

        }

        finally{

            setRequestingRevision(false);

        }

    }

    function handleProceedToCommercialApproval(){

        if(quote.revision_requested){
            return;
        }

        onTabChange?.("commercial-approval");

    }

    const lines = [

        { label:"Mobilisation", min:quote.mobilisation_cost_min, max:quote.mobilisation_cost_max },
        { label:"Setup / Access", min:quote.setup_cost_min, max:quote.setup_cost_max },
        { label:"Execution (machine)", min:quote.execution_cost_min, max:quote.execution_cost_max },
        { label:"Pump Addon", min:quote.pump_addon_cost_min, max:quote.pump_addon_cost_max },
        { label:"Documentation Buffer", min:quote.documentation_buffer, max:quote.documentation_buffer },
        { label:"Access Support Buffer", min:quote.access_support_buffer, max:quote.access_support_buffer },
        { label:"Overhead", min:quote.overhead_cost_min, max:quote.overhead_cost_max },
        { label:"Contingency", min:quote.contingency_cost_min, max:quote.contingency_cost_max },
        { label:"Margin", min:quote.margin_value_min, max:quote.margin_value_max },
        { label:"Dewatering Add-on", min:quote.dewatering_addon_min, max:quote.dewatering_addon_max }

    ];

    const quoteCode = `QT-${enquiry?.id ?? "?"}-v${quote.revision_number ?? 1}`;

    return(

        <div className="quote-commercial-grid">

            <div className="survey-summary-card">

                <h3 className="survey-summary-title">
                    Commercial breakdown
                    <span className="workspace-header-pill gray" style={{marginLeft:8}}>
                        v{quote.revision_number ?? 1}
                    </span>
                </h3>

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
                            lines.map(line=>(
                                <tr key={line.label}>
                                    <td>{line.label}</td>
                                    <td>{inr(line.min)}</td>
                                    <td>{inr(line.max)}</td>
                                </tr>
                            ))
                        }

                        <tr className="ops-scoring-top">
                            <td><b>Range</b></td>
                            <td><b>{inr(quote.combined_budgetary_value_min)}</b></td>
                            <td><b>{inr(quote.combined_budgetary_value_max)}</b></td>
                        </tr>

                    </tbody>

                </table>

                <h4 className="ops-subheading">Internal-only addition</h4>

                <label style={{display:"flex", alignItems:"center", gap:8, fontWeight:700}}>
                    <input
                        type="checkbox"
                        checked={extraEnabled}
                        onChange={e=>setExtraEnabled(e.target.checked)}
                    />
                    Add internal amount (commission / other)
                </label>

                <div className="ops-override-form" style={{marginTop:8}}>

                    <input
                        type="number"
                        placeholder="Amount (INR)"
                        value={extraAmount}
                        disabled={!extraEnabled}
                        onChange={e=>setExtraAmount(e.target.value)}
                    />

                    <input
                        placeholder="Note"
                        value={extraNote}
                        disabled={!extraEnabled}
                        onChange={e=>setExtraNote(e.target.value)}
                    />

                </div>

                <div className="survey-actions" style={{marginTop:10}}>

                    <button
                        className="survey-action-button"
                        onClick={handleSaveExtra}
                        disabled={savingExtra}
                    >
                        {savingExtra ? "Saving..." : "Save internal addition"}
                    </button>

                    <button
                        className="survey-action-button"
                        onClick={()=>setShowPreview(v=>!v)}
                    >
                        {showPreview ? "Hide" : "Preview"} customer-facing quote
                    </button>

                </div>

                {
                    showPreview && (

                        <div className="survey-summary-card" style={{marginTop:12, border:"2px solid #f97316"}}>

                            <h4 className="ops-subheading">
                                Customer-facing quote (final number only, no breakdown)
                            </h4>

                            <div className="survey-summary-row">
                                <span className="survey-summary-label">Total quoted value (GST extra as applicable)</span>
                                <span className="survey-summary-value">
                                    {inr(totalWithExtra)} - {inr(totalWithExtraMax)}
                                </span>
                            </div>

                        </div>

                    )
                }

                <div style={{marginTop:14, paddingTop:14, borderTop:"1px dashed #e5e7eb"}}>

                    {
                        quote.released ? (

                            <span className="workspace-header-pill green">
                                Released by {quote.released_by} on {quote.released_date}
                            </span>

                        ) : (

                            <p className="survey-empty">
                                A quote is released via the "Accept and Generate Quote
                                Release" action on the Commercial Approval tab.
                            </p>

                        )
                    }

                </div>

                {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

            </div>

            <div className="survey-summary-card">

                <h3 className="survey-summary-title">Decision, linked PO & history</h3>

                <div className="survey-summary-body">

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Status</span>
                        <span className="survey-summary-value">{quote.workflow_status ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Quote ID</span>
                        <span className="survey-summary-value">{quoteCode}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Valid till</span>
                        <span className="survey-summary-value">
                            <input
                                type="date"
                                value={validTill || ""}
                                onChange={e=>setValidTill(e.target.value)}
                                style={{marginRight:8}}
                            />
                            <button
                                className="survey-action-button"
                                onClick={handleSaveValidTill}
                                disabled={savingValidTill}
                            >
                                {savingValidTill ? "Saving..." : "Save"}
                            </button>
                        </span>
                    </div>

                </div>

                <h4 className="ops-subheading">Linked PO</h4>

                <p className="survey-empty">No PO yet.</p>

                <h4 className="ops-subheading">Version history</h4>

                <table className="ops-scoring-table">

                    <thead>
                        <tr>
                            <th>V</th>
                            <th>By</th>
                            <th>Date</th>
                            <th>Reason</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            history.length ? history.map(row=>(

                                <tr key={row.id}>
                                    <td>{row.revision_number}</td>
                                    <td>{row.created_by ?? "-"}</td>
                                    <td>{formatDate(row.created_on)}</td>
                                    <td>{row.revision_reason ?? "-"}</td>
                                </tr>

                            )) : (

                                <tr>
                                    <td colSpan={4} className="survey-empty">No prior revisions.</td>
                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

            <div className="survey-summary-card" style={{gridColumn:"1 / -1"}}>

                <h3 className="survey-summary-title">Revise &amp; proceed</h3>

                {
                    quote.revision_requested && (

                        <p className="survey-empty" style={{color:"#b45309"}}>
                            Revision requested by {quote.revision_requested_by} on{" "}
                            {quote.revision_requested_date} - go to Sales Survey,
                            Ops Selector, or the Quotes module, make your changes,
                            and save a new quote version. Proceeding to Commercial
                            Approval is blocked until then.
                        </p>

                    )
                }

                <div className="survey-actions" style={{flexWrap:"wrap", gap:8}}>

                    <button
                        className="survey-action-button"
                        onClick={handleOpenQuotesModule}
                    >
                        Open Quotes Module
                    </button>

                    <input
                        placeholder="Your name"
                        value={revisionRequestedBy}
                        onChange={e=>setRevisionRequestedBy(e.target.value)}
                        style={{maxWidth:160}}
                    />

                    <button
                        className="survey-action-button survey-action-button-danger"
                        onClick={handleRequestRevision}
                        disabled={requestingRevision || quote.revision_requested}
                    >
                        {
                            requestingRevision
                                ? "Requesting..."
                                : quote.revision_requested
                                    ? "Revision already requested"
                                    : "Request Revision"
                        }
                    </button>

                    <button
                        className="survey-action-button survey-action-button-orange"
                        onClick={handleProceedToCommercialApproval}
                        disabled={!!quote.revision_requested}
                        title={
                            quote.revision_requested
                                ? "Save a new quote version first"
                                : ""
                        }
                    >
                        Proceed to Commercial Approval
                    </button>

                </div>

            </div>

        </div>

    );

}
