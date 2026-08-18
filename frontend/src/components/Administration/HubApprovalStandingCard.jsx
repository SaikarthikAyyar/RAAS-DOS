import { useEffect, useState } from "react";

import { getHubs } from "../../services/hubsService";

import "./RoleNavigationMatrix.css";

// ====================================
// READ-ONLY: who holds real approval standing per hub
// Purely a display of what the Hubs tab (Business Masters) already
// sets - no write path here. Reuses GET /hubs, already enriched with
// ops_owners/quote_commercial_approvers (Phase 21C/22), so no new
// endpoint needed.
// ====================================

export default function HubApprovalStandingCard(){

    const [hubs, setHubs] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        getHubs()
            .then(data=>setHubs(data ?? []))
            .catch(err=>console.error(err))
            .finally(()=>setLoading(false));

    }, []);

    return(

        <div className="role-nav-matrix-wrap">

            <div className="role-nav-matrix-header">

                <h3 style={{margin:0, fontSize:14.5}}>Hub Approval Standing</h3>

            </div>

            <p className="role-nav-matrix-hint">
                Who currently holds real Ops Review and Quote &amp; Commercial approval standing for each hub.
                Set from Business Masters &rarr; Hubs, shown here read-only.
            </p>

            {
                loading ? (
                    <p className="role-nav-matrix-status">Loading...</p>
                ) : hubs.length===0 ? (
                    <p className="role-nav-matrix-status">No hubs yet.</p>
                ) : (

                    <div className="role-nav-matrix-scroll">

                        <table className="role-nav-matrix-table">

                            <thead>

                                <tr>
                                    <th className="role-nav-matrix-sticky-col">Hub</th>
                                    <th>Region</th>
                                    <th>Ops Review owners</th>
                                    <th>Quote &amp; Commercial approvers</th>
                                </tr>

                            </thead>

                            <tbody>

                                {
                                    hubs.map(h=>(

                                        <tr key={h.id}>

                                            <td className="role-nav-matrix-sticky-col">
                                                <div className="role-nav-matrix-role-name">{h.hub_name}</div>
                                            </td>

                                            <td className="role-nav-matrix-cell">{h.region || "—"}</td>

                                            <td className="role-nav-matrix-cell">
                                                {h.ops_owners?.length ? h.ops_owners.map(o=>o.name).join(", ") : "—"}
                                            </td>

                                            <td className="role-nav-matrix-cell">
                                                {h.quote_commercial_approvers?.length ? h.quote_commercial_approvers.map(o=>o.name).join(", ") : "—"}
                                            </td>

                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    </div>

                )
            }

        </div>

    );

}
