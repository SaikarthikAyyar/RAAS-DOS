import FieldTooltip from "../shared/FieldTooltip";

// ====================================
// COMPONENT
// ====================================

export default function OpsDaysManpower({

    opsData,

    updateField

}){

    return(

        <div className="ops-card">

            <div className="ops-header">

                <h2>

                    Days & Manpower

                </h2>

            </div>

            <div className="ops-table">

                <div className="ops-table-header">

                    <div>

                        Parameter

                    </div>

                    <div>

                        Output

                    </div>

                    <div>

                        Unit

                    </div>

                </div>

                <Row

                    label="Mobilisation"

                    field="mobilisation_days"

                    value={opsData.mobilisation_days}

                    unit="day"

                    updateField={updateField}

                    tooltip="Estimated days to transport equipment to site and prepare for the job."

                />

                <Row

                    label="Setup"

                    field="setup_days"

                    value={opsData.setup_days}

                    unit="day"

                    updateField={updateField}

                    tooltip="Estimated days to position and configure equipment on-site before execution begins."

                />

                <Row

                    label="Execution"

                    field="execution_days"

                    value={opsData.execution_days}

                    unit="days"

                    updateField={updateField}

                    tooltip="Estimated days to actually carry out the cleaning work."

                />

                <Row

                    label="Demobilisation"

                    field="demob_days"

                    value={opsData.demob_days}

                    unit="day"

                    updateField={updateField}

                    tooltip="Estimated days to pack up and remove equipment from site after the job."

                />

                <Row

                    label="Total Job Days"

                    field="total_job_days"

                    value={opsData.total_job_days}

                    unit="days"

                    updateField={updateField}

                    tooltip="The sum of mobilisation, setup, execution, and demobilisation days."

                />

                <TextRow

                    label="Manpower"

                    field="manpower_required"

                    value={opsData.manpower_required}

                    unit="-"

                    updateField={updateField}

                    tooltip="The crew/personnel required to carry out this job."

                />

            </div>

        </div>

    );

}


// ====================================
// NUMBER ROW
// ====================================

function Row({

    label,

    field,

    value,

    unit,

    updateField,

    tooltip

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}
                <FieldTooltip text={tooltip}/>

            </div>

            <div className="ops-value">

                <input

                    className="ops-input"

                    type="number"

                    value={value ?? 0}

                    onChange={(event)=>{

                        updateField(

                            field,

                            Number(

                                event.target.value

                            )

                        );

                    }}

                />

            </div>

            <div className="ops-unit">

                {unit}

            </div>

        </div>

    );

}


// ====================================
// TEXT ROW
// ====================================

function TextRow({

    label,

    field,

    value,

    unit,

    updateField,

    tooltip

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}
                <FieldTooltip text={tooltip}/>

            </div>

            <div className="ops-value">

                <input

                    className="ops-input"

                    type="text"

                    value={value ?? ""}

                    onChange={(event)=>{

                        updateField(

                            field,

                            event.target.value

                        );

                    }}

                />

            </div>

            <div className="ops-unit">

                {unit}

            </div>

        </div>

    );

}