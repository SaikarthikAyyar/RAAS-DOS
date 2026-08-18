import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";

import useApprovalStanding from "../../../hooks/useApprovalStanding";

import { buildActor } from "../../../utils/actor";

import { computeGateStatus } from "../../../utils/gateStatus";

import {
    saveOpsReviewDecision
} from "../../../services/opsSelectorService";

import {
    getQuote
} from "../../../services/technoCommercialQuoteService";

export default function OpsReviewDecisionCard({

    enquiry,

    opsSelection,

    reload

}){

    const navigate = useNavigate();

    const { user, hasTask } = useAuth();

    const standing = useApprovalStanding(enquiry?.id, user?.id);

    const [quoteReady, setQuoteReady] = useState(false);

    const [reviewNote, setReviewNote] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    useEffect(()=>{

        let cancelled = false;

        getQuote(opsSelection.id)
            .then(data=>{

                if(!cancelled){
                    setQuoteReady(Boolean(data?.id));
                }

            })
            .catch(()=>{

                if(!cancelled){
                    setQuoteReady(false);
                }

            });

        return ()=>{ cancelled = true; };

    },[opsSelection.id]);

    function handleOpenOpsSelector(){

        localStorage.setItem(

            "ops_selector_customer_request_id",

            enquiry.customer_request_id

        );

        localStorage.setItem(

            "ops_selector_sales_survey_id",

            enquiry.sales_survey_id

        );

        localStorage.setItem(

            "ops_selector_enquiry_id",

            enquiry.id

        );

        navigate(

            "/ops-selector"

        );

    }

    // Real, server-re-verified gate: stage must genuinely be OPS_REVIEW
    // right now AND the logged-in user must hold real ops_review hub
    // standing - no typed name anymore, identity comes purely from
    // being logged in. Once a decision has moved the stage on, this
    // same gate correctly greys the buttons out instead of leaving
    // them clickable.
    const gate = computeGateStatus(
        enquiry,
        "OPS_REVIEW",
        standing?.ops_review,
        "Ops Review",
        standing?.hub_name
    );

    const canDecide = gate.canDecide;

    async function handleDecision(status, nextStage){

        if(!canDecide){

            setError(gate.reason || "You are not authorized to record this decision.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await saveOpsReviewDecision(

                opsSelection.id,

                status,

                reviewNote,

                enquiry.id,

                buildActor(user)

            );

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

    const status = opsSelection.review_status ?? "Pending";

    let pillClass = "gray";

    if(status==="Approved") pillClass = "blue";

    if(status==="Sent back") pillClass = "red";

    return(

        <div className="survey-summary-card ops-decision-card">

            <h3 className="survey-summary-title">

                Ops Review Decision

            </h3>

            <div className="survey-summary-body">

                <div className="survey-summary-row">
                    <span className="survey-summary-label">Status</span>
                    <span className={`workspace-header-pill ${pillClass}`}>{status}</span>
                </div>

                <div className="survey-summary-row">
                    <span className="survey-summary-label">Reviewed by / date</span>
                    <span className="survey-summary-value">

                        {

                            opsSelection.reviewed_date
                                ? `${opsSelection.reviewed_by} on ${opsSelection.reviewed_date}`
                                : "Not yet reviewed"

                        }

                    </span>
                </div>

            </div>

            {

                opsSelection.review_note && (

                    <p className="survey-empty" style={{marginTop:8}}>

                        {opsSelection.review_note}

                    </p>

                )

            }

            <div className="ops-override-form" style={{marginTop:12}}>

                <input

                    placeholder="Note (e.g. Machine, pump and manpower confirmed workable)"

                    value={reviewNote}

                    onChange={e=>setReviewNote(e.target.value)}

                />

            </div>

            {gate.reason && <div className="survey-empty" style={{marginTop:8}}>{gate.reason}</div>}

            {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

            <div className="survey-actions" style={{marginTop:12}}>

                <button

                    type="button"

                    className="survey-action-button survey-create-button"

                    disabled

                    title="Fleet calendar is not built yet - no tentative/confirmed hold tracking exists in the backend."

                >

                    Open Fleet Calendar

                </button>

                {

                    quoteReady ? (

                        <button

                            className="survey-action-button survey-action-button-orange"

                            onClick={()=>handleDecision("Approved")}

                            disabled={saving || !canDecide}

                            title={!canDecide ? gate.reason : undefined}

                        >

                            {saving ? "Saving..." : "Approve & Send to Quote & Commercial"}

                        </button>

                    ) : (

                        <span className="survey-empty" style={{alignSelf:"center"}}>

                            Generate the quote above before approving.

                        </span>

                    )

                }

                <button

                    className="survey-action-button survey-action-button-danger"

                    onClick={()=>handleDecision("Sent back", "SALES_SURVEY")}

                    disabled={saving || !canDecide}

                    title={!canDecide ? gate.reason : undefined}

                >

                    {saving ? "Saving..." : "Send Back to Sales"}

                </button>

                {hasTask("enquiry-tab-ops-review", "open_ops_selector") && (

                    <button

                        type="button"

                        className="survey-action-button"

                        onClick={handleOpenOpsSelector}

                    >

                        Open Ops Selector

                    </button>

                )}

            </div>

        </div>

    );

}
