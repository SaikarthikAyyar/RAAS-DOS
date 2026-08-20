import SurveySummaryCard from "./SurveySummaryCard";

import DeploymentPlanCard from "./DeploymentPlanCard";

import OpsReviewDecisionCard from "./OpsReviewDecisionCard";

import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { useAuth } from "../../../contexts/AuthContext";

import { buildActor } from "../../../utils/actor";

// "Open Ops Selector" lives inside OpsReviewDecisionCard now, alongside the
// other decision buttons. This handler is only needed here for the
// no-ops-selection-yet fallback further below.

import {
    saveOpsOverride
} from "../../../services/opsSelectorService";

import {
    getQuote
} from "../../../services/technoCommercialQuoteService";

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

export default function OpsReviewSummary({

    enquiry,

    opsSelection,

    opsScoring = [],

    dewatering,

    reload

}){

    const navigate = useNavigate();

    const { hasTask, user } = useAuth();

    const [overrideMachine, setOverrideMachine] = useState("");

    const [overrideReason, setOverrideReason] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    // Lifted here (Phase 27) rather than fetched independently by
    // OpsReviewDecisionCard and DeploymentPlanCard - both need to know
    // "does a quote already exist, and what does it snapshot" (the
    // former for its quoteReady gate, the latter for its own
    // has-anything-changed comparison), so one fetch feeds both.
    const [quote, setQuote] = useState(null);

    useEffect(()=>{

        if(!opsSelection?.id){
            setQuote(null);
            return;
        }

        let cancelled = false;

        getQuote(opsSelection.id)
            .then(data=>{

                if(!cancelled){
                    setQuote(data?.id ? data : null);
                }

            })
            .catch(()=>{

                if(!cancelled){
                    setQuote(null);
                }

            });

        return ()=>{ cancelled = true; };

        // Depends on the whole opsSelection reference (not individual
        // fields) - a fresh reload() at the workspace level always
        // produces a new object, which is exactly the signal needed to
        // re-check whether a new quote now exists / has changed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[opsSelection]);

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

    async function handleSaveOverride(){

        if(!overrideMachine || !overrideReason.trim()){

            setError("Choose a machine and enter a reason before saving.");

            return;

        }

        setSaving(true);

        setError("");

        try{

            await saveOpsOverride(

                opsSelection.id,

                overrideMachine,

                overrideReason,

                enquiry.id,

                buildActor(user)

            );

            reload();

        }

        catch(err){

            console.error(err);

            setError("Unable to save override.");

        }

        finally{

            setSaving(false);

        }

    }

    const finalMachine =
        opsSelection?.override_machine || opsSelection?.recommended_machine;

    function isSelectedRow(row){

        return (

            finalMachine===row.machine.code ||
            finalMachine===row.machine.name

        );

    }

    return(

        <div className="survey-summary-grid">

            {

                opsSelection && (
                <>

            {/* ==================================== */}
            {/* ALGORITHM RECOMMENDATION              */}
            {/* fieldRows + override form + scoring   */}
            {/* table, all in ONE card - matches the  */}
            {/* wireframe's opsReviewTab() layout      */}
            {/* ==================================== */}

            <div className="survey-summary-card ops-recommendation-card" data-guide-id="ops-review-scoring" style={{position:"relative"}}>

                <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-scoring" floating/>

                <h3 className="survey-summary-title">

                    Algorithm Recommendation

                </h3>

                <div className="survey-summary-body">

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Doability</span>
                        <span className="survey-summary-value">{opsSelection.doability ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Recommended Machine</span>
                        <span className="survey-summary-value">{opsSelection.recommended_machine ?? "-"}</span>
                    </div>

                    {

                        opsSelection.override_machine && (
                        <>

                            <div className="survey-summary-row">
                                <span className="survey-summary-label">Human Override</span>
                                <span className="survey-summary-value">{opsSelection.override_machine}</span>
                            </div>

                            <div className="survey-summary-row">
                                <span className="survey-summary-label">Override Reason</span>
                                <span className="survey-summary-value">{opsSelection.override_reason}</span>
                            </div>

                        </>
                        )

                    }

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Final Machine</span>
                        <span className="survey-summary-value">{finalMachine ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Suggested Pump / Hose Package</span>
                        <span className="survey-summary-value">{opsSelection.pump_hose_package ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Accessories</span>
                        <span className="survey-summary-value">{opsSelection.accessories ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Dewatering Method</span>
                        <span className="survey-summary-value">{dewatering?.recommended_dewatering_method ?? "Not assessed"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Dewatering Gate</span>
                        <span className="survey-summary-value">{dewatering?.dewatering_commitment_decision ?? "Not assessed"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Suggested Execution Days</span>
                        <span className="survey-summary-value">{opsSelection.execution_days ?? "-"}</span>
                    </div>

                    <div className="survey-summary-row">
                        <span className="survey-summary-label">Approval Gate</span>
                        <span className="survey-summary-value">{opsSelection.approval_gate ?? "-"}</span>
                    </div>

                </div>

                {/* ==================================== */}
                {/* OVERRIDE MACHINE FORM                 */}
                {/* ==================================== */}

                {

                    opsScoring.length > 0 && (

                        <div className="ops-override-form" data-guide-id="ops-review-override" style={{position:"relative"}}>

                            <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-override" floating/>

                            <h4 className="ops-subheading">Override Machine</h4>

                            {error && <div className="survey-empty">{error}</div>}

                            <select

                                value={overrideMachine}

                                onChange={e=>setOverrideMachine(e.target.value)}

                            >

                                <option value="">Choose machine...</option>

                                {

                                    opsScoring.map(row=>(

                                        <option

                                            key={row.machine.code}

                                            value={row.machine.code}

                                        >

                                            {row.machine.code} - {row.machine.name}

                                        </option>

                                    ))

                                }

                            </select>

                            <input

                                placeholder="Reason for override (goes into the audit trail)"

                                value={overrideReason}

                                onChange={e=>setOverrideReason(e.target.value)}

                            />

                            {hasTask("enquiry-tab-ops-review", "save_ops_override") && (

                                <button

                                    className="survey-action-button survey-action-button-danger"

                                    onClick={handleSaveOverride}

                                    disabled={saving}

                                >

                                    {saving ? "Saving..." : "Save Override"}

                                </button>

                            )}

                        </div>

                    )

                }

                {/* ==================================== */}
                {/* MACHINE SCORING                       */}
                {/* ==================================== */}

                {

                    opsScoring.length > 0 && (

                        <>

                            <h4 className="ops-subheading">Machine Scoring</h4>

                            <table className="ops-scoring-table">

                                <thead>

                                    <tr>

                                        <th>Machine</th>
                                        <th>Access</th>
                                        <th>Material</th>
                                        <th>Job</th>
                                        <th>Volume</th>
                                        <th>Environment</th>
                                        <th>Debris</th>
                                        <th>Hub Fit</th>
                                        <th>Total</th>
                                        <th>Rank</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        opsScoring.map(row=>(

                                            <tr

                                                key={row.machine.code}

                                                className={

                                                    row.rank===1
                                                        ? "ops-scoring-top"
                                                        : ""

                                                }

                                            >

                                                <td>

                                                    {row.machine.code}

                                                    {

                                                        isSelectedRow(row) && (

                                                            <span className="workspace-header-pill blue" style={{marginLeft:6}}>

                                                                Selected

                                                            </span>

                                                        )

                                                    }

                                                </td>

                                                <td>{row.access_score}</td>
                                                <td>{row.material_score}</td>
                                                <td>{row.job_score}</td>
                                                <td>{row.volume_score}</td>
                                                <td>{row.environment_score}</td>
                                                <td>{row.debris_score}</td>
                                                <td>{row.hub_fit_score}</td>
                                                <td><b>{row.total_score}</b></td>
                                                <td>{row.rank}</td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                            <p className="survey-empty" style={{fontSize:"11.5px", marginTop:8}}>

                                Access checks opening dimensions plus vertical-lift/crane/power fit
                                against each machine's limits. Material and Job scores reward
                                machines whose preferred material/job-type lists match the survey.
                                Environment scores hazard/pH/temperature compatibility, Debris
                                compares tolerance vs. the site's debris level, and Hub Fit checks
                                whether the machine is stationed at the nearest hub.

                            </p>

                        </>

                    )

                }

            </div>

            <DeploymentPlanCard

                enquiry={enquiry}

                opsSelection={opsSelection}

                opsScoring={opsScoring}

                finalMachine={finalMachine}

                quote={quote}

                reload={reload}

            />

            <OpsReviewDecisionCard

                enquiry={enquiry}

                opsSelection={opsSelection}

                quote={quote}

                reload={reload}

            />

            <SurveySummaryCard

                title="Mid-job Amendment"

                className="ops-amendment-card"

                actions={

                    <>

                        <p className="survey-empty">No amendment raised yet.</p>

                        <p className="survey-empty" style={{fontSize:"11.5px", marginTop:8}}>

                            Amendments route back through Ops Review to
                            Techno-Commercial to Commercial Approval. Not
                            built yet - there is no amendment model in the
                            backend.

                        </p>

                    </>

                }

            />

                </>

                )

            }

            {

                !opsSelection && (

                    <SurveySummaryCard
                        title="No Ops Selection Yet"
                        actions={

                            <div className="survey-actions">

                                <p className="survey-empty">

                                    Run the ops engine from the Ops Selector
                                    page to generate a recommendation for
                                    this enquiry.

                                </p>

                                {hasTask("enquiry-tab-ops-review", "open_ops_selector") && (

                                    <span data-guide-id="ops-review-open-selector" style={{display:"inline-flex", alignItems:"center"}}>

                                    <button

                                        className="survey-action-button"

                                        onClick={handleOpenOpsSelector}

                                    >

                                        Open Ops Selector

                                    </button>

                                    <ComponentExplainerIcon tabId="ops-review" componentId="ops-review-open-selector"/>

                                    </span>

                                )}

                            </div>

                        }
                    />

                )

            }

        </div>

    );

}
