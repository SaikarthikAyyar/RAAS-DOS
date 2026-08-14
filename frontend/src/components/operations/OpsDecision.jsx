// ====================================
// IMPORTS
// ====================================

import { useState, useEffect } from "react";

import { getMachines } from "../../services/machinesService";
import { getPumps } from "../../services/pumpsService";
import { getServiceConfigurations } from "../../services/serviceConfigService";


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

    // ====================================
    // BUSINESS MASTER OPTIONS
    // Recommended Machine / Service Configuration / Pump & Hose Package
    // only ever take values from these three real masters - fetched
    // once here so the row selects below always reflect current data,
    // not a hardcoded/free-typed value.
    // ====================================

    const [machines, setMachines] = useState([]);
    const [serviceConfigurations, setServiceConfigurations] = useState([]);
    const [pumps, setPumps] = useState([]);

    useEffect(()=>{

        getMachines()
            .then(data=>setMachines((data ?? []).filter(m=>m.active)))
            .catch(err=>console.error(err));

        getServiceConfigurations()
            .then(data=>setServiceConfigurations(data ?? []))
            .catch(err=>console.error(err));

        getPumps()
            .then(data=>setPumps((data ?? []).filter(p=>p.active)))
            .catch(err=>console.error(err));

    }, []);

    const machineOptions = machines.map(m=>({
        value: m.name,
        label: `${m.code} - ${m.name}`
    }));

    const serviceConfigOptions = serviceConfigurations.map(sc=>({
        value: sc.code,
        label: `${sc.code} - ${sc.name}`
    }));

    // The selected machine's hose size is baked into every pump option's
    // value, matching the exact "{code} - {name} | {hose_size}" shape
    // the Ops Engine's own build_pump_selection() produces - so picking
    // one here saves the same format a real algorithm run would.
    const selectedMachine = machines.find(
        m => m.name === opsData.recommended_machine || m.code === opsData.recommended_machine
    );
    const hoseSize = selectedMachine?.hose_size || "-";

    const pumpOptions = pumps.map(p=>({
        value: `${p.code} - ${p.name} | ${hoseSize}`,
        label: `${p.code} - ${p.name}`
    }));

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
                    valueOptions={serviceConfigOptions}
                    valuePlaceholder="Choose service configuration..."
                />

                <Row
                    label="Recommended Machine"
                    field="recommended_machine"
                    approvalField="machine_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                    valueOptions={machineOptions}
                    valuePlaceholder="Choose machine..."
                />

                <Row
                    label="Pump / Hose Package"
                    field="pump_hose_package"
                    approvalField="pump_hose_approval"
                    opsData={opsData}
                    updateField={updateField}
                    options={approvalOptions}
                    valueOptions={pumpOptions}
                    valuePlaceholder="Choose pump..."
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

    options,

    valueOptions,

    valuePlaceholder

}){

    return(

        <div className="ops-table-row">

            <div className="ops-label">

                {label}

            </div>

            <div className="ops-value">

                {

                    valueOptions ? (

                        <select

                            className="ops-input"

                            value={opsData[field] ?? ""}

                            onChange={(e)=>

                                updateField(

                                    field,

                                    e.target.value

                                )

                            }

                        >

                            <option value="">

                                {valuePlaceholder ?? "Select"}

                            </option>

                            {

                                valueOptions.map(opt=>(

                                    <option

                                        key={opt.value}

                                        value={opt.value}

                                    >

                                        {opt.label}

                                    </option>

                                ))

                            }

                        </select>

                    ) : (

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

                    )

                }

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
