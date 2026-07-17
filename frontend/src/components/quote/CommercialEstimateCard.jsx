import {

    saveQuote

} from "../../services/technoCommercialQuoteService";

export default function CommercialEstimateCard({

    quote,

    setQuote,

    selectedOps,

    onSubmitApproval

}){


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

        const savedQuote =

            await saveQuote({

                ops_selection_id:Number(

                    selectedOps

                )

            });

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

    <div style={{textAlign:"right"}}>

        <input
            type="number"
            className="quote-input"
            value={quote.cleaning_quote ?? ""}
            onChange={(e)=>
                setQuote({
                    ...quote,
                    cleaning_quote:Number(e.target.value)
                })
            }
        />

    </div>

</div>

<div className="quote-table-row">

    <div className="quote-label">
        Dewatering Add-on
    </div>

    <div style={{textAlign:"right"}}>

        <input
            type="number"
            className="quote-input"
            value={quote.dewatering_addon ?? ""}
            onChange={(e)=>
                setQuote({
                    ...quote,
                    dewatering_addon:Number(e.target.value)
                })
            }
        />

    </div>

</div>

<div className="quote-table-row">

    <div className="quote-label">
        Combined Budgetary Value
    </div>

    <div style={{textAlign:"right"}}>

        <input
            type="number"
            className="quote-input"
            value={quote.total_quote ?? ""}
            onChange={(e)=>
                setQuote({
                    ...quote,
                    total_quote:Number(e.target.value)
                })
            }
        />

    </div>

</div>

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