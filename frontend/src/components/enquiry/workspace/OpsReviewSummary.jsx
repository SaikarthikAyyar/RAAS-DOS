import SurveySummaryCard from "./SurveySummaryCard";

import DeploymentPlanCard from "./DeploymentPlanCard";

import OpsReviewDecisionCard from "./OpsReviewDecisionCard";

import { useNavigate } from "react-router-dom";

import { useState } from "react";

// "Open Ops Selector" lives inside OpsReviewDecisionCard now, alongside the
// other decision buttons. This handler is only needed here for the
// no-ops-selection-yet fallback further below.

import {
    saveOpsOverride
} from "../../../services/opsSelectorService";

export default function OpsReviewSummary({

    enquiry,

    opsSelection,

    opsScoring = [],

    dewatering,

    reload

}){

    const navigate = useNavigate();

    const [overrideMachine, setOverrideMachine] = useState("");

    const [overrideReason, setOverrideReason] = useState("");

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

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

                overrideReason

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

            <div className="survey-summary-card ops-recommendation-card">

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

                        <div className="ops-override-form">

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

                            <button

                                className="survey-action-button survey-action-button-danger"

                                onClick={handleSaveOverride}

                                disabled={saving}

                            >

                                {saving ? "Saving..." : "Save Override"}

                            </button>

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
                                                <td><b>{row.total_score}</b></td>
                                                <td>{row.rank}</td>

                                            </tr>

                                        ))

                                    }

                                </tbody>

                            </table>

                            <p className="survey-empty" style={{fontSize:"11.5px", marginTop:8}}>

                                Access checks opening dimensions against each machine's
                                minimum width/height. Material and Job scores reward machines
                                whose preferred material/job-type lists match the survey.

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

                reload={reload}

            />

            <OpsReviewDecisionCard

                enquiry={enquiry}

                opsSelection={opsSelection}

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

                                <button

                                    className="survey-action-button"

                                    onClick={handleOpenOpsSelector}

                                >

                                    Open Ops Selector

                                </button>

                            </div>

                        }
                    />

                )

            }

        </div>

    );

}
