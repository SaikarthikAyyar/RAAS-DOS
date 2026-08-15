import { useNavigate } from "react-router-dom";

import { STAGE_LABELS } from "../../data/workflowStages";

import { useAuth } from "../../contexts/AuthContext";

import { generateQuoteReleaseUrl } from "../../services/quotesModuleService";

const STAGE_ORDER = Object.keys(STAGE_LABELS);

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

function stageClass(stage){

    if(stage==="QUOTE_RELEASED" || stage==="PO_RECEIVED" || stage==="JOB_CREATION" || stage==="EXECUTION" || stage==="COMPLETED"){
        return "quotes-status quotes-status-approved";
    }

    if(stage==="COMMERCIAL_APPROVAL" || stage==="TECHNO_COMMERCIAL_APPROVAL"){
        return "quotes-status quotes-status-revision";
    }

    return "quotes-status quotes-status-default";

}

export default function QuotesTable({

    items,

    loading,

    error

}){

    const navigate = useNavigate();

    const { user } = useAuth();

    function handleOpen(item){

        if(!item.enquiry_id){
            return;
        }

        navigate(

            `/enquiries/workspace/${item.enquiry_id}`,

            { state:{ initialTab:"quote-commercial" } }

        );

    }

    if(loading){

        return <div className="quotes-loading">Loading quotes...</div>;

    }

    if(error){

        return <div className="quotes-error">{error}</div>;

    }

    return (

        <div className="quotes-card">

            <div className="quotes-table">

                <table>

                    <thead>
                        <tr>
                            <th>Quote ID</th>
                            <th>Customer</th>
                            <th>Range</th>
                            <th>Stage</th>
                            <th>PO</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            items.length ? items.map(item=>{

                                const stageIndex = STAGE_ORDER.indexOf(item.enquiry_stage);
                                const quoteReleasedIndex = STAGE_ORDER.indexOf("QUOTE_RELEASED");
                                const canGenerateRelease = item.enquiry_stage && stageIndex >= quoteReleasedIndex;

                                return (

                                <tr key={item.id}>

                                    <td>
                                        QT-{item.enquiry_id ?? item.ops_selection_id}-v{item.revision_number}
                                    </td>

                                    <td>{item.customer_name ?? "-"}</td>

                                    <td>
                                        {inr(item.combined_budgetary_value_min)} - {inr(item.combined_budgetary_value_max)}
                                    </td>

                                    <td>
                                        <span className={stageClass(item.enquiry_stage)}>
                                            {STAGE_LABELS[item.enquiry_stage] || item.enquiry_stage || "-"}
                                        </span>
                                    </td>

                                    <td>-</td>

                                    <td style={{display:"flex", gap:8, alignItems:"center"}}>

                                        {
                                            item.enquiry_id ? (

                                                <button

                                                    className="quotes-open-btn"

                                                    onClick={()=>handleOpen(item)}

                                                >

                                                    Open →

                                                </button>

                                            ) : (

                                                <span className="quotes-loading" style={{padding:0}}>-</span>

                                            )
                                        }

                                        {
                                            canGenerateRelease && (

                                                <a

                                                    className="quotes-open-btn"

                                                    href={generateQuoteReleaseUrl(item.id, user?.name)}

                                                    title="Generate the quote release document for this quote (uses the active Quote Template, with this enquiry's real tank/machine and rate data)"

                                                >

                                                    Generate Quote Release

                                                </a>

                                            )
                                        }

                                    </td>

                                </tr>

                                );

                            }) : (

                                <tr>
                                    <td colSpan={6} className="quotes-empty">No quotes match.</td>
                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
