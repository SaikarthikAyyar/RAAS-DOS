// ====================================
// COMPONENT
// ====================================

export default function OpsActions({

saveOps

}){

return(

<div className="ops-card">

<div className="ops-header">

<h2>

Ops Next Action

</h2>

</div>

<p className="ops-action-text">

Ops must approve machine, pump, manpower and
job plan before execution.

</p>

<button

className="ops-primary-btn"

onClick={saveOps}

>

Open Dewatering Gate

</button>

<button

className="ops-secondary-btn"

>

Approve Without Dewatering

</button>

<button

className="ops-secondary-btn"

onClick={saveOps}

>

Save Ops Selection

</button>

</div>

);

}