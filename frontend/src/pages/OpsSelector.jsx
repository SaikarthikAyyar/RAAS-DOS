// ====================================
// IMPORTS
// ====================================

import "../components/operations/Operations.css";

import useOpsSelector

from "../hooks/useOpsSelector";

import OpsInputs

from "../components/operations/OpsInputs";

import OpsDecision

from "../components/operations/OpsDecision";

import OpsDaysManpower

from "../components/operations/OpsDaysManpower";

import OpsActions

from "../components/operations/OpsActions";


// ====================================
// COMPONENT
// ====================================

export default function OpsSelector(){

    const{

        opsData,

        updateField,

        saveOps

    } = useOpsSelector();

    return(

        <div className="ops-selector-page">

            {/* ==================================== */}
            {/* HEADER */}
            {/* ==================================== */}

            <div className="ops-page-header">

                <h1 style={{ color: "#ffffff" }}>

                    Ops Selector

                </h1>

                <p>

                    Review the Sales Survey, modify the engineering
                    recommendations if required, and submit the
                    Operations Selection.

                </p>

            </div>


            {/* ==================================== */}
            {/* WORKFLOW INFORMATION */}
            {/* ==================================== */}

            <div className="ops-selector-bar">

                <div className="ops-workflow-chip">

                    <strong>

                        Customer Request :

                    </strong>

                    {" "}

                    CR-

                    {opsData.customer_request_id}

                </div>

                <div className="ops-workflow-chip">

                    <strong>

                        Sales Survey :

                    </strong>

                    {" "}

                    SS-

                    {opsData.sales_survey_id}

                </div>

            </div>


            {/* ==================================== */}
            {/* INPUTS */}
            {/* ==================================== */}

            <div className="ops-grid">

                <OpsInputs

                    inputs={

                        opsData.inputs

                    }

                />

                <OpsDecision

                    opsData={

                        opsData

                    }

                    updateField={

                        updateField

                    }

                />

            </div>


            {/* ==================================== */}
            {/* DAYS / MANPOWER */}
            {/* ==================================== */}

            <div className="ops-grid">

                <OpsDaysManpower

                    opsData={

                        opsData

                    }

                    updateField={

                        updateField

                    }

                />

                <OpsActions

                    saveOps={

                        saveOps

                    }

                />

            </div>

        </div>

    );

}