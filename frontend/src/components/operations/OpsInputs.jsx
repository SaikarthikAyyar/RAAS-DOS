// ====================================
// COMPONENT
// ====================================

export default function OpsInputs({

inputs

}){

return(

<div className="ops-card">

    <div className="ops-header">

        <h2>

            Inputs Pulled From Sales Survey

        </h2>

    </div>

    <div className="ops-table">

        <div className="ops-table-header">

            <div>Input</div>

            <div>Value</div>

            <div>Unit</div>

        </div>

        <Row
            label="Job Type"
            value={inputs?.job_type}
            unit="-"
        />

        <Row
            label="Material Category"
            value={inputs?.material_category}
            unit="-"
        />

        <Row
            label="Estimated Volume"
            value={inputs?.estimated_volume}
            unit="m³"
        />

        <Row
            label="Average Output"
            value={inputs?.average_output}
            unit="m³/hr"
        />

        <Row
            label="Opening Size"
            value={
                inputs?.opening_width &&
                inputs?.opening_height
                ? `${inputs.opening_width} × ${inputs.opening_height}`
                : "-"
            }
            unit="mm"
        />

        <Row
            label="Vertical Lift"
            value={inputs?.vertical_lift}
            unit="m"
        />

        <Row
            label="Hose Distance"
            value={inputs?.hose_distance}
            unit="m"
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

value,

unit

}){

return(

<div className="ops-table-row">

<div className="ops-label">

{label}

</div>

<div className="ops-value">

{value || "-"}

</div>

<div className="ops-unit">

{unit || "-"}

</div>

</div>

);

}