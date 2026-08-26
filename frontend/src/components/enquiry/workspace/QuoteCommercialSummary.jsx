import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";

import useApprovalStanding from "../../../hooks/useApprovalStanding";

import { buildActor } from "../../../utils/actor";

import { computeGateStatus, computeStageOnly } from "../../../utils/gateStatus";

import { formatApiError } from "../../../utils/apiError";

import {
    getQuoteHistory,
    updateInternalExtra,
    updateValidTill,
    flagQuoteRevisionRequested,
    saveQuoteCommercialDecision
} from "../../../services/technoCommercialQuoteService";

import {
    requestApproval
} from "../../../services/enquiryWorkspaceService";

import FieldTooltip from "../../shared/FieldTooltip";

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

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

    reload

}){

    const navigate = useNavigate();

    const { user, hasTask } = useAuth();

    const standing = useApprovalStanding(enquiry?.id, user?.id);

    const [history, setHistory] = useState([]);

    const [requestingRevision, setRequestingRevision] = useState(false);

    const [extraEnabled, setExtraEnabled] = useState(false);
    const [extraAmount, setExtraAmount] = useState("");
    const [extraNote, setExtraNote] = useState("");
    const [savingExtra, setSavingExtra] = useState(false);

    const [validTill, setValidTill] = useState("");
    const [savingValidTill, setSavingValidTill] = useState(false);

    const [showPreview, setShowPreview] = useState(false);

    const [decisionNote, setDecisionNote] = useState("");
    const [deciding, setDeciding] = useState(false);

    const [error, setError] = useState("");

    const [requesting, setRequesting] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");

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
                extraEnabled ? extraNote : null,
                enquiry?.id,
                buildActor(user)
            );

            reload();

        }

        catch(err){

            console.error(err);
            setError(formatApiError(err, "Unable to save internal addition."));

        }

        finally{

            setSavingExtra(false);

        }

    }

    async function handleSaveValidTill(){

        setSavingValidTill(true);
        setError("");

        try{

            await updateValidTill(quote.id, validTill || null, enquiry?.id, buildActor(user));

            reload();

        }

        catch(err){

            console.error(err);
            setError(formatApiError(err, "Unable to save valid-till date."));

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

    // A revision request only makes sense while the case is genuinely
    // still sitting at Quote & Commercial - once it's moved on (or was
    // sent back to Ops Review already), this "task" button must grey
    // out too, not just the Approve/Send-back decision buttons below
    // it. Firing this from a stale, already-passed tab would silently
    // flag revision_requested on a quote a later stage has already
    // acted on, retroactively blocking that later stage's own decision.
    const revisionStageGate = computeStageOnly(enquiry, "QUOTE_COMMERCIAL_REVIEW");

    async function handleRequestRevision(){

        if(!revisionStageGate.canRequest){
            setError(revisionStageGate.reason || "This case has moved past Quote & Commercial.");
            return;
        }

        setRequestingRevision(true);
        setError("");

        try{

            await flagQuoteRevisionRequested(quote.id, user?.name, enquiry?.id, buildActor(user));

            reload();

        }

        catch(err){

            console.error(err);
            setError(formatApiError(err, "Unable to request a revision."));

        }

        finally{

            setRequestingRevision(false);

        }

    }

    // Real, server-re-verified gate: stage must genuinely be
    // QUOTE_COMMERCIAL_REVIEW right now AND the logged-in user must
    // hold real quote_commercial hub standing - no typed name, identity
    // comes purely from being logged in.
    const gate = computeGateStatus(
        enquiry,
        "QUOTE_COMMERCIAL_REVIEW",
        standing?.quote_commercial,
        "Quote & Commercial",
        standing?.hub_name
    );

    const canDecide = gate.canDecide && !quote.revision_requested;

    const decisionDisabledReason =
        quote.revision_requested
            ? "Save a new quote version first."
            : gate.reason;

    // "Please review this" ping - anyone can request it, gated only on
    // the case genuinely being at this gate's stage right now.
    const requestGate = computeStageOnly(enquiry, "QUOTE_COMMERCIAL_REVIEW");

    async function handleRequestApproval(){

        if(!requestGate.canRequest){
            setRequestMessage(requestGate.reason || "Approval cannot be requested right now.");
            return;
        }

        setRequesting(true);
        setRequestMessage("");

        try{

            const result = await requestApproval(enquiry?.id, "quote_commercial", buildActor(user));

            setRequestMessage(`Requested approval from ${result.requested_to} approver(s).`);

        }

        catch(err){

            console.error(err);
            setRequestMessage(formatApiError(err, "Unable to request approval."));

        }

        finally{

            setRequesting(false);

        }

    }

    async function handleDecision(status){

        if(!canDecide){
            setError(decisionDisabledReason || "You are not authorized to record this decision.");
            return;
        }

        const confirmMessage =
            status === "Approved"
                ? "Approve and send this case to Commercial Approval? Once approved, Request Revision and this quote's own fields here can't be edited again unless the case is sent back to Quote & Commercial."
                : "Send this case back to Ops Review? Request Revision and this quote's own fields here won't be editable again until the case reaches Quote & Commercial once more - but Ops Review will become editable again immediately.";

        if(!window.confirm(confirmMessage)){
            return;
        }

        setDeciding(true);
        setError("");

        try{

            await saveQuoteCommercialDecision(
                quote.id,
                status,
                decisionNote,
                enquiry?.id,
                buildActor(user)
            );

            reload();

        }

        catch(err){

            console.error(err);
            setError(formatApiError(err, "Unable to save the decision."));

        }

        finally{

            setDeciding(false);

        }

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

            <div className="survey-summary-card" data-guide-id="qc-breakdown" style={{position:"relative"}}>

                <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-breakdown" floating/>

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
                    <FieldTooltip text="An internal-only extra amount (e.g. commission) added on top of the quoted value - not shown to the customer."/>
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

                    {hasTask("enquiry-tab-quote-commercial", "save_internal_addition") && (
                        <span data-guide-id="qc-save-internal-addition" style={{display:"inline-flex", alignItems:"center"}}>
                        <button
                            className="survey-action-button"
                            onClick={handleSaveExtra}
                            disabled={savingExtra}
                        >
                            {savingExtra ? "Saving..." : "Save internal addition"}
                        </button>
                        <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-save-internal-addition"/>
                        </span>
                    )}

                    {hasTask("enquiry-tab-quote-commercial", "preview_customer_quote") && (
                        <span data-guide-id="qc-preview" style={{display:"inline-flex", alignItems:"center"}}>
                        <button
                            className="survey-action-button"
                            onClick={()=>setShowPreview(v=>!v)}
                        >
                            {showPreview ? "Hide" : "Preview"} customer-facing quote
                        </button>
                        <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-preview"/>
                        </span>
                    )}

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

            <div className="survey-summary-card" data-guide-id="qc-valid-till" style={{position:"relative"}}>

                <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-valid-till" floating/>

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
                        <span className="survey-summary-label">Valid till<FieldTooltip text="The date this quote's pricing expires and would need to be re-generated."/></span>
                        <span className="survey-summary-value">
                            <input
                                type="date"
                                value={validTill || ""}
                                onChange={e=>setValidTill(e.target.value)}
                                style={{marginRight:8}}
                            />
                            {hasTask("enquiry-tab-quote-commercial", "save_valid_till") && (
                                <span data-guide-id="qc-save-valid-till" style={{display:"inline-flex", alignItems:"center"}}>
                                <button
                                    className="survey-action-button"
                                    onClick={handleSaveValidTill}
                                    disabled={savingValidTill}
                                >
                                    {savingValidTill ? "Saving..." : "Save"}
                                </button>
                                <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-save-valid-till"/>
                                </span>
                            )}
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

                <h3 className="survey-summary-title">Revise &amp; approve</h3>

                {
                    quote.revision_requested && (

                        <p className="survey-empty" style={{color:"#b45309"}}>
                            Revision requested by {quote.revision_requested_by} on{" "}
                            {quote.revision_requested_date} - go to Sales Survey,
                            Ops Selector, or the Quotes module, make your changes,
                            and save a new quote version. Approving here is
                            blocked until then.
                        </p>

                    )
                }

                <div className="survey-actions" style={{flexWrap:"wrap", gap:8}}>

                    {hasTask("enquiry-tab-quote-commercial", "open_quotes_module") && (
                        <span data-guide-id="qc-open-quotes-module" style={{display:"inline-flex", alignItems:"center"}}>
                        <button
                            className="survey-action-button"
                            onClick={handleOpenQuotesModule}
                            disabled={!requestGate.canRequest}
                            title={!requestGate.canRequest ? requestGate.reason : "Generate a new quote revision from there."}
                        >
                            Open Quotes Module
                        </button>
                        <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-open-quotes-module"/>
                        </span>
                    )}



                    {hasTask("enquiry-tab-quote-commercial", "request_revision") && (
                        <span data-guide-id="qc-request-revision" style={{display:"inline-flex", alignItems:"center"}}>
                        <button
                            className="survey-action-button survey-action-button-danger"
                            onClick={handleRequestRevision}
                            disabled={requestingRevision || quote.revision_requested || !revisionStageGate.canRequest}
                            title={!revisionStageGate.canRequest ? revisionStageGate.reason : undefined}
                        >
                            {
                                requestingRevision
                                    ? "Requesting..."
                                    : quote.revision_requested
                                        ? "Revision already requested"
                                        : "Request Revision"
                            }
                        </button>
                        <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-request-revision"/>
                        </span>
                    )}

                </div>

                <h4 className="ops-subheading" style={{marginTop:14}}>Quote &amp; Commercial decision</h4>

                <div className="ops-override-form" style={{marginTop:4}}>

                    <input
                        placeholder="Note (optional)"
                        value={decisionNote}
                        onChange={e=>setDecisionNote(e.target.value)}
                    />

                </div>

                {decisionDisabledReason && <div className="survey-empty" style={{marginTop:8}}>{decisionDisabledReason}</div>}
                {requestMessage && <div className="survey-empty" style={{marginTop:8}}>{requestMessage}</div>}

                <div className="survey-actions" style={{flexWrap:"wrap", gap:8, marginTop:8}}>

                    <span data-guide-id="qc-request-approval" style={{display:"inline-flex", alignItems:"center"}}>
                    <button
                        className="survey-action-button"
                        onClick={handleRequestApproval}
                        disabled={requesting || !requestGate.canRequest}
                        title={!requestGate.canRequest ? requestGate.reason : "Notify every Quote & Commercial approver for this hub"}
                    >
                        {requesting ? "Requesting..." : "Request Approval"}
                    </button>
                    <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-request-approval"/>
                    </span>

                    <span data-guide-id="qc-decision" style={{display:"inline-flex", alignItems:"center", gap:8}}>

                    {hasTask("enquiry-tab-quote-commercial", "proceed_to_commercial_approval") && (
                        <button
                            className="survey-action-button survey-action-button-orange"
                            onClick={()=>handleDecision("Approved")}
                            disabled={deciding || !canDecide}
                            title={!canDecide ? decisionDisabledReason : undefined}
                        >
                            {deciding ? "Saving..." : "Approve & Send to Commercial Approval"}
                        </button>
                    )}

                    {hasTask("enquiry-tab-quote-commercial", "request_revision") && (
                        <button
                            className="survey-action-button survey-action-button-danger"
                            onClick={()=>handleDecision("Sent back")}
                            disabled={deciding || !canDecide}
                            title={!canDecide ? decisionDisabledReason : undefined}
                        >
                            {deciding ? "Saving..." : "Send Back to Ops Review"}
                        </button>
                    )}

                    <ComponentExplainerIcon tabId="quote-commercial" componentId="qc-decision"/>

                    </span>

                </div>

            </div>

        </div>

    );

}
