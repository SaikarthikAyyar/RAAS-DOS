import { useNavigate } from "react-router-dom";

import { STAGE_LABELS } from "../../../data/workflowStages";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

// ====================================
// RECENT CASES TABLE
// Most recent active enquiries, linking straight into the real
// Enquiry Workspace - the same route the rest of the app already
// navigates to (/enquiries/workspace/{id}).
// ====================================

export default function RecentCasesTable({ recentCases = [] }){

    const navigate = useNavigate();

    return(

        <div className="ovw-card">

            <h3>Recent cases</h3>

            {
                recentCases.length===0 ? (

                    <p className="ovw-empty">No cases yet.</p>

                ) : (

                    <table className="ovw-table">

                        <thead>
                            <tr>
                                <th>Enquiry</th>
                                <th>Customer</th>
                                <th>Stage</th>
                                <th>Value</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                recentCases.map(c=>(

                                    <tr key={c.enquiry_id}>
                                        <td>#{c.enquiry_id}</td>
                                        <td>{c.customer_name || "-"}</td>
                                        <td>{STAGE_LABELS[c.stage] || c.stage}</td>
                                        <td>{inr(c.value)}</td>
                                        <td>{c.quote_commercial_status || "-"}</td>
                                        <td>
                                            <span
                                                className="ovw-link"
                                                onClick={()=>navigate(`/enquiries/workspace/${c.enquiry_id}`)}
                                            >
                                                Open case →
                                            </span>
                                        </td>
                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );

}
