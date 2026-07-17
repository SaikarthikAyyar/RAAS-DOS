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

                />

                <Row

                    label="Setup"

                    field="setup_days"

                    value={opsData.setup_days}

                    unit="day"

                    updateField={updateField}

                />

                <Row

                    label="Execution"

                    field="execution_days"

                    value={opsData.execution_days}

                    unit="days"

                    updateField={updateField}

                />

                <Row

                    label="Demobilisation"

                    field="demob_days"

                    value={opsData.demob_days}

                    unit="day"

                    updateField={updateField}

                />

                <Row

                    label="Total Job Days"

                    field="total_job_days"

                    value={opsData.total_job_days}

                    unit="days"

                    updateField={updateField}

                />

                <TextRow

                    label="Manpower"

                    field="manpower_required"

                    value={opsData.manpower_required}

                    unit="-"

                    updateField={updateField}

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

    updateField

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}

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

    updateField

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}

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