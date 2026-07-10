// ====================================
// COMMERCIAL ESTIMATE
// ====================================

export default function CommercialEstimateCard({

quote,
onSubmitApproval

}){

return(

<div className="quote-card">

<div className="quote-card-header">

<h2>

Commercial Estimate

</h2>

</div>


<div className="quote-table">

<div className="quote-table-header">

<div>

Line Item

</div>

<div>

INR Value

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Cleaning Quote

</div>

<div className="quote-value">

₹ {quote.cleaning_quote.toLocaleString()}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Dewatering Add-on

</div>

<div className="quote-value">

₹ {quote.dewatering_addon.toLocaleString()}

</div>

</div>


<div className="quote-table-row">

<div className="quote-label">

Combined Budgetary Value

</div>

<div className="quote-commercial-total">

₹ {quote.combined_budgetary_value.toLocaleString()}

</div>

</div>

</div>

<div className="quote-actions">

<button

className="quote-primary-btn"

onClick={

onSubmitApproval

}

>

Submit for Approval

</button>

</div>

</div>

);

}