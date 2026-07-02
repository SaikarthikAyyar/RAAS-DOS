// ====================================
// COMPONENT
// ====================================

export default function OpsDaysManpower({

opsData

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

<div>Parameter</div>

<div>Output</div>

<div>Unit</div>

</div>

<Row
label="Mobilisation"
value={opsData?.mobilisation_days ?? "-"}
unit="day"
/>

<Row
label="Setup"
value={opsData?.setup_days ?? "-"}
unit="day"
/>

<Row
label="Execution"
value={opsData?.execution_days ?? "-"}
unit="days"
/>

<Row
label="Demobilisation"
value={opsData?.demob_days ?? "-"}
unit="day"
/>

<Row
label="Total Job Days"
value={opsData?.total_job_days ?? "-"}
unit="days"
/>

<Row
label="Manpower"
value={
    opsData?.manpower_required != null
        ? `${opsData.manpower_required} Personnel`
        : "-"
}
unit="-"
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

{value}

</div>

<div className="ops-unit">

{unit}

</div>

</div>

);

}