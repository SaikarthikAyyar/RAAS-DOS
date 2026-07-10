// ====================================
// TECHNICAL SUMMARY
// ====================================

export default function TechnicalSummaryCard({

quote

}){

return(

<div className="quote-card">

<div className="quote-card-header">

<h2>

Technical Summary

</h2>

</div>


<div className="quote-table">

<div className="quote-table-header">

<div>

Field

</div>

<div>

Output

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Machine

</div>

<div className="quote-value">

{quote.recommended_machine}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Service Configuration

</div>

<div className="quote-value">

{quote.service_configuration}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Pump / Hose

</div>

<div className="quote-value">

{quote.pump_hose_package}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Dewatering Method

</div>

<div className="quote-value">

{quote.dewatering_method}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Approval Gate

</div>

<div className="quote-value">

{quote.approval_gate}

</div>

</div>

</div>

</div>

);

}