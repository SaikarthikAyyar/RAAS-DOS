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

                <h1>

                    Ops Selector

                </h1>

                <p>

                    Review the Sales Survey, modify the engineering
                    recommendations if required, and submit the
                    Operations Selection.

                </p>

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