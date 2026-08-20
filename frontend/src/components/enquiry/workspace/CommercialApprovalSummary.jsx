import { useEffect, useState } from "react";

import { useAuth } from "../../../contexts/AuthContext";

import useApprovalStanding from "../../../hooks/useApprovalStanding";

import { buildActor } from "../../../utils/actor";

import { computeGateStatus, computeStageOnly } from "../../../utils/gateStatus";

import {
    getApprovalHistory,
    recordCommercialApprovalDecision,
    sendBackCommercialApproval
} from "../../../services/approvalBoardService";

import {
    requestApproval
} from "../../../services/enquiryWorkspaceService";

import {
    quoteReleaseDownloadUrl,
    getQuoteReleaseDocumentForQuote
} from "../../../services/quoteReleaseService";

import { getEmailTemplates } from "../../../services/emailTemplatesService";

import SendTemplateModal from "../../businessMasters/emailTemplates/SendTemplateModal";

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

const QUOTE_RELEASE_EMAIL_TEMPLATE_NAME = "Quote Release";

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

    const { user, hasTask } = useAuth();

    const standing = useApprovalStanding(enquiry?.id, user?.id);

    const [history, setHistory] = useState([]);

    const [note, setNote] = useState("");
    const [finalValue, setFinalValue] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [requesting, setRequesting] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");

    const [releaseDocument, setReleaseDocument] = useState(null);
    const [quoteReleaseEmailTemplate, setQuoteReleaseEmailTemplate] = useState(null);
    const [showSendModal, setShowSendModal] = useState(false);

    useEffect(()=>{

        if(!quote?.id){
            setReleaseDocument(null);
            return;
        }

        let cancelled = false;

        async function loadReleaseDocument(){

            try{

                const doc = await getQuoteReleaseDocumentForQuote(quote.id);

                if(!cancelled){
                    setReleaseDocument(doc);
                }

            }

            catch(err){

                console.error(err);

            }

        }

        loadReleaseDocument();

        return ()=>{ cancelled = true; };

    }, [quote?.id]);

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
                        Quote &amp; Commercial approval, and generate a quote first.
                    </p>

                </div>

            </div>

        );

    }

    const decisionForThisRevision = history.find(row => row.quote_id === quote.id);

    // Real, server-re-verified gate: stage must genuinely be
    // COMMERCIAL_APPROVAL right now AND the logged-in user must hold
    // real commercial_approval hub standing - no typed name, identity
    // comes purely from being logged in.
    const gate = computeGateStatus(
        enquiry,
        "COMMERCIAL_APPROVAL",
        standing?.commercial_approval,
        "Commercial Approval",
        standing?.hub_name
    );

    const canDecide = gate.canDecide;

    async function handleDecision(decision){

        if(decision==="REJECTED"){

            if(!window.confirm("Reject this quote? The case will be sent back to Ops Review.")){
                return;
            }

        }

        if(!canDecide){

            setError(gate.reason || "You are not authorized to record this decision.");
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

            const result = await recordCommercialApprovalDecision(

                quote.id,
                decision,
                note,
                decision==="APPROVED" ? Number(finalValue) : null,
                enquiry?.id,
                buildActor(user)

            );

            if(result?.quote_release_document_id){

                setReleaseDocument({ id: result.quote_release_document_id });

            }

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

    async function handleSendBack(){

        if(!canDecide){

            setError(gate.reason || "You are not authorized to send this back.");
            return;

        }

        if(!note.trim()){

            setError("A note is required - it goes into the decision history.");
            return;

        }

        setSaving(true);
        setError("");

        try{

            await sendBackCommercialApproval(

                quote.id,
                note,
                enquiry?.id,
                buildActor(user)

            );

            reload();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to send this back.");

        }

        finally{

            setSaving(false);

        }

    }

    // "Please review this" ping - gated on stage-match only (anyone can
    // request it, not just users who already hold standing), unlike
    // the nested visibility rules further below which are about
    // whether a DECISION can be recorded right now.
    const requestGate = computeStageOnly(enquiry, "COMMERCIAL_APPROVAL");

    async function handleRequestApproval(){

        if(!requestGate.canRequest){
            setRequestMessage(requestGate.reason || "Approval cannot be requested right now.");
            return;
        }

        setRequesting(true);
        setRequestMessage("");

        try{

            const result = await requestApproval(enquiry?.id, "commercial_approval", buildActor(user));

            setRequestMessage(`Requested approval from ${result.requested_to} approver(s).`);

        }

        catch(err){

            console.error(err);
            setRequestMessage(err?.detail || "Unable to request approval.");

        }

        finally{

            setRequesting(false);

        }

    }

    async function handleOpenSendModal(){

        try{

            const templates = await getEmailTemplates();

            const template = templates.find(t=>t.name===QUOTE_RELEASE_EMAIL_TEMPLATE_NAME);

            if(!template){

                alert(`No "${QUOTE_RELEASE_EMAIL_TEMPLATE_NAME}" email template found - create one in Business Masters -> Email Templates first.`);
                return;

            }

            setQuoteReleaseEmailTemplate(template);
            setShowSendModal(true);

        }

        catch(err){

            console.error(err);
            alert("Unable to load the Quote Release email template.");

        }

    }

    const kpis = [

        { label:"Survey", value: survey ? "Complete" : "Pending" },
        { label:"Ops Review", value: opsSelection?.review_status ?? "Pending" },
        { label:"Quote & Comm.", value: quote.quote_commercial_status ?? "Pending" },
        { label:"Quote", value: quote.workflow_status ?? "-" },
        { label:"PO", value: "Not started" }

    ];

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

    return(

        <div className="survey-summary-grid">

            <div className="survey-summary-card" style={{gridColumn:"1 / -1", position:"relative"}} data-guide-id="ca-quote-lines">

                <ComponentExplainerIcon tabId="commercial-approval" componentId="ca-quote-lines" floating/>

                <h3 className="survey-summary-title">
                    Commercial Approval
                    <span className="workspace-header-pill gray" style={{marginLeft:8}}>
                        Owner: {
                            standing?.commercial_approval_approvers?.length
                                ? standing.commercial_approval_approvers.join(", ")
                                : "Unassigned"
                        }
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

                <div className="survey-actions" style={{marginBottom:10}} data-guide-id="ca-request-approval">

                    <button
                        className="survey-action-button"
                        onClick={handleRequestApproval}
                        disabled={requesting || !requestGate.canRequest}
                        title={!requestGate.canRequest ? requestGate.reason : "Notify every Commercial Approval approver for this hub"}
                    >
                        {requesting ? "Requesting..." : "Request Approval"}
                    </button>

                    <ComponentExplainerIcon tabId="commercial-approval" componentId="ca-request-approval"/>

                </div>

                {requestMessage && <div className="survey-empty" style={{marginBottom:10}}>{requestMessage}</div>}

                <h4 className="ops-subheading">Finalized quote lines</h4>

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

                {
                    releaseDocument?.id && (

                        <div className="survey-actions" style={{marginTop:10, marginBottom:10}} data-guide-id="ca-release-actions">

                            <ComponentExplainerIcon tabId="commercial-approval" componentId="ca-release-actions"/>

                            {hasTask("enquiry-tab-commercial-approval", "download_quote_document") && (
                                <a
                                    className="survey-action-button"
                                    href={quoteReleaseDownloadUrl(releaseDocument.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Download quote document (.docx)
                                </a>
                            )}

                            {hasTask("enquiry-tab-commercial-approval", "send_quote_release_email") && (
                                <button
                                    className="survey-action-button survey-action-button-orange"
                                    onClick={handleOpenSendModal}
                                >
                                    Send Quote Release Email
                                </button>
                            )}

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

                    ) : quote.quote_commercial_status !== "Approved" ? (

                        <p className="survey-empty" style={{marginTop:10}}>
                            Waiting on Quote &amp; Commercial approval.
                        </p>

                    ) : (

                        <>

                            <div className="ops-override-form" style={{marginTop:12}}>

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

                            {gate.reason && <div className="survey-empty" style={{marginTop:8}}>{gate.reason}</div>}

                            {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

                            <div className="survey-actions" style={{marginTop:10}} data-guide-id="ca-decision">

                                <button
                                    className="survey-action-button survey-action-button-orange"
                                    onClick={()=>handleDecision("APPROVED")}
                                    disabled={saving || !canDecide}
                                    title={!canDecide ? gate.reason : undefined}
                                >
                                    {saving ? "Saving..." : "Accept and Generate Quote Release"}
                                </button>

                                <button
                                    className="survey-action-button survey-action-button-danger"
                                    onClick={()=>handleDecision("REJECTED")}
                                    disabled={saving || !canDecide}
                                    title={!canDecide ? gate.reason : undefined}
                                >
                                    Reject
                                </button>

                                <button
                                    className="survey-action-button"
                                    onClick={handleSendBack}
                                    disabled={saving || !canDecide}
                                    title={!canDecide ? gate.reason : "Use Request Revision on the Quote & Commercial tab"}
                                >
                                    Send back for review
                                </button>

                                <ComponentExplainerIcon tabId="commercial-approval" componentId="ca-decision"/>

                            </div>

                        </>

                    )
                }

            </div>

            {
                showSendModal && quoteReleaseEmailTemplate && (

                    <SendTemplateModal

                        template={quoteReleaseEmailTemplate}

                        onClose={()=>setShowSendModal(false)}

                        requireAttachment

                    />

                )
            }

        </div>

    );

}
