// ====================================
// COMPONENT
// ====================================

export default function OpsDecision({

    opsData,

    updateField

}){

    const approvalOptions = [

        "Proceed",

        "Ops Review",

        "EHS Review",

        "Ops+EHs Review",

        "Engineering Review"



    ];

    return(

        <div className="ops-card">

            <div className="ops-header">

                <h2>

                    Selection Output

                </h2>

            </div>

            <div className="ops-table">

                <div className="ops-table-header">

                    <div>Decision</div>

                    <div>Recommendation</div>

                    <div>Approval</div>

                </div>

                <Row
                    label="Doability"
                    field="doability"
                    approvalField="approval_gate"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                />

                <Row
                    label="Service Configuration"
                    field="service_configuration"
                    approvalField="service_configuration_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                />

                <Row
                    label="Recommended Machine"
                    field="recommended_machine"
                    approvalField="machine_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                />

                <Row
                    label="Pump / Hose Package"
                    field="pump_hose_package"
                    approvalField="pump_hose_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                />

                <Row
                    label="Accessories"
                    field="accessories"
                    approvalField="accessories_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                />

            </div>

        </div>

    );

}


// ====================================
// ROW
// ====================================

function Row({

    label,

    field,

    approvalField,

    opsData,

    updateField,

    options

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}

            </div>

            <div className="ops-value">

                <input

                    className="ops-input"

                    value={opsData[field] ?? ""}

                    onChange={(e)=>

                        updateField(

                            field,

                            e.target.value

                        )

                    }

                />

            </div>

            <div className="ops-unit">

                <select

                    className="ops-select"

                    value={opsData[approvalField] ?? ""}

                    onChange={(e)=>

                        updateField(

                            approvalField,

                            e.target.value

                        )

                    }

                >

                    <option value="">

                        Select

                    </option>

                    {

                        options.map(option=>(

                            <option

                                key={option}

                                value={option}

                            >

                                {option}

                            </option>

                        ))

                    }

                </select>

            </div>

        </div>

    );

}