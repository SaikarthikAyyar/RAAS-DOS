// ====================================
// COMPONENT
// ====================================

export default function OpsDecision({

opsData

}){

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
value={opsData?.doability || "-"}
approval={opsData?.approval_gate || "-"}
/>

<Row
label="Service Configuration"
value={opsData?.service_configuration || "-"}
approval="-"
/>

<Row
label="Machine"
value={opsData?.recommended_machine || "-"}
approval="-"
/>

<Row
label="Pump / Hose"
value={opsData?.pump_hose_package || "-"}
approval="-"
/>

<Row
label="Accessories"
value={opsData?.accessories || "-"}
approval="-"
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

approval

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

{approval}

</div>

</div>

);

}