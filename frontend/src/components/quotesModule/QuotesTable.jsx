import { useNavigate } from "react-router-dom";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

function statusClass(label){

    if(label==="Approved") return "enquiry-status enquiry-status-open";
    if(label==="Rejected") return "enquiry-status enquiry-status-lost";
    if(label==="Revision Requested") return "enquiry-status enquiry-status-archived";
    return "enquiry-status enquiry-status-closed";

}

export default function QuotesTable({

    items,

    loading,

    error

}){

    const navigate = useNavigate();

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

        return <div className="enquiry-loading">Loading quotes...</div>;

    }

    if(error){

        return <div className="enquiry-error">{error}</div>;

    }

    return (

        <div className="enquiry-card">

            <div className="enquiry-table">

                <table>

                    <thead>
                        <tr>
                            <th>Quote ID</th>
                            <th>Customer</th>
                            <th>Range</th>
                            <th>Status</th>
                            <th>PO</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            items.length ? items.map(item=>(

                                <tr key={item.id}>

                                    <td>
                                        QT-{item.enquiry_id ?? item.ops_selection_id}-v{item.revision_number}
                                    </td>

                                    <td>{item.customer_name ?? "-"}</td>

                                    <td>
                                        {inr(item.combined_budgetary_value_min)} - {inr(item.combined_budgetary_value_max)}
                                    </td>

                                    <td>
                                        <span className={statusClass(item.status_label)}>
                                            {item.status_label}
                                        </span>
                                    </td>

                                    <td>-</td>

                                    <td>

                                        {
                                            item.enquiry_id ? (

                                                <button

                                                    className="enquiry-view"

                                                    onClick={()=>handleOpen(item)}

                                                >

                                                    Open →

                                                </button>

                                            ) : (

                                                <span className="enquiry-loading" style={{padding:0}}>-</span>

                                            )
                                        }

                                    </td>

                                </tr>

                            )) : (

                                <tr>
                                    <td colSpan={6} className="enquiry-empty">No quotes match.</td>
                                </tr>

                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
