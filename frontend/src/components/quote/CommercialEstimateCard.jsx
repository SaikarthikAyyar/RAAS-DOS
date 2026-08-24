import { useAuth } from "../../contexts/AuthContext";

import {

    saveQuote

} from "../../services/technoCommercialQuoteService";

import FieldTooltip from "../shared/FieldTooltip";

const MIN_MAX_FIELDS = [

    { label:"Mobilisation", min:"mobilisation_cost_min", max:"mobilisation_cost_max", tooltip:"Cost to transport equipment to and from the site." },
    { label:"Setup / Access", min:"setup_cost_min", max:"setup_cost_max", tooltip:"Cost to set up equipment and any access-support work on-site." },
    { label:"Execution (machine)", min:"execution_cost_min", max:"execution_cost_max", tooltip:"The machine's day-rate cost for the actual cleaning work." },
    { label:"Pump Addon", min:"pump_addon_cost_min", max:"pump_addon_cost_max", tooltip:"Additional cost for pump/hose accessories needed for this job." },
    { label:"Direct Cost Subtotal", min:"direct_cost_min", max:"direct_cost_max", tooltip:"The sum of mobilisation, setup, execution, and pump addon costs." },
    { label:"Overhead", min:"overhead_cost_min", max:"overhead_cost_max", tooltip:"A percentage markup covering indirect business costs." },
    { label:"Contingency", min:"contingency_cost_min", max:"contingency_cost_max", tooltip:"A buffer added to cover unforeseen costs/risks on the job." },
    { label:"Margin Value", min:"margin_value_min", max:"margin_value_max", tooltip:"RAAS-DOS's profit margin on this quote." },
    { label:"Cleaning Quote", min:"cleaning_quote_min", max:"cleaning_quote_max", tooltip:"The total quoted price for the cleaning work, before dewatering." },
    { label:"Dewatering Add-on", min:"dewatering_addon_min", max:"dewatering_addon_max", tooltip:"Additional cost for dewatering the removed material, if required." },
    { label:"Combined Budgetary Value", min:"combined_budgetary_value_min", max:"combined_budgetary_value_max", tooltip:"The final total quoted value, including cleaning and dewatering." }

];

const SINGLE_FIELDS = [

    { label:"Documentation Buffer", key:"documentation_buffer", tooltip:"A fixed allowance added for documentation/reporting effort." },
    { label:"Access Support Buffer", key:"access_support_buffer", tooltip:"A fixed allowance added for extra access-support work." },
    { label:"Margin %", key:"margin_percentage", tooltip:"The profit margin percentage applied to this quote." }

];

export default function CommercialEstimateCard({

    quote,

    setQuote,

    selectedOps,

    enquiryId

}){

const { user } = useAuth();

function updateField(key, value){

    setQuote({
        ...quote,
        [key]: value==="" ? "" : Number(value)
    });

}

async function handleSave(){

    if(

        !selectedOps

    ){

        alert(

            "Select an OPS Selection."

        );

        return;

    }

    try{

        const payload = {

            ops_selection_id: Number(selectedOps),

            enquiry_id: enquiryId,

            created_by: user?.name,

            reason: "Manually saved from Quote page"

        };

        MIN_MAX_FIELDS.forEach(field=>{

            payload[field.min] = quote[field.min]===""||quote[field.min]===undefined ? null : quote[field.min];
            payload[field.max] = quote[field.max]===""||quote[field.max]===undefined ? null : quote[field.max];

        });

        SINGLE_FIELDS.forEach(field=>{

            payload[field.key] = quote[field.key]===""||quote[field.key]===undefined ? null : quote[field.key];

        });

        const savedQuote =

            await saveQuote(payload);

        console.log(

            "Quote Saved",

            savedQuote

        );

        alert(

            "Quote saved successfully."

        );

    }

    catch(error){

        console.error(

            error

        );

        alert(

            "Unable to save quote."

        );

    }

}

return(

<div className="quote-card">

<div className="quote-card-header">

<h2>

Commercial Estimate

</h2>

</div>


<div className="quote-table">

<div className="quote-table-header-3">

<div>Line Item</div>
<div style={{textAlign:"right"}}>Min (INR)</div>
<div style={{textAlign:"right"}}>Max (INR)</div>

</div>

{

    MIN_MAX_FIELDS.map(field=>(

        <div className="quote-table-row-3" key={field.label}>

            <div className="quote-label">{field.label}<FieldTooltip text={field.tooltip}/></div>

            <input
                type="number"
                className="quote-input"
                value={quote[field.min] ?? ""}
                onChange={e=>updateField(field.min, e.target.value)}
            />

            <input
                type="number"
                className="quote-input"
                value={quote[field.max] ?? ""}
                onChange={e=>updateField(field.max, e.target.value)}
            />

        </div>

    ))

}

{

    SINGLE_FIELDS.map(field=>(

        <div className="quote-table-row" key={field.label}>

            <div className="quote-label">{field.label}<FieldTooltip text={field.tooltip}/></div>

            <div style={{textAlign:"right"}}>

                <input
                    type="number"
                    className="quote-input"
                    value={quote[field.key] ?? ""}
                    onChange={e=>updateField(field.key, e.target.value)}
                />

            </div>

        </div>

    ))

}

</div>

<div className="quote-actions">



<button

className="quote-primary-btn"

onClick={handleSave}

>

Save Quote

</button>

</div>

</div>

);

}
