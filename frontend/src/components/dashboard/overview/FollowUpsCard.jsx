// ====================================
// FOLLOW-UPS CARD
// Sourced from Customer.next_follow_up_date/_owner/_note (Business
// Masters - real, persisted, not a mock) already bucketed
// overdue/today/upcoming server-side.
// ====================================

function pillClassFor(bucket){

    if(bucket==="overdue") return "ovw-pill red";
    if(bucket==="today") return "ovw-pill amber";
    return "ovw-pill blue";

}

function pillLabelFor(bucket){

    if(bucket==="overdue") return "Overdue";
    if(bucket==="today") return "Today";
    return "Upcoming";

}

export default function FollowUpsCard({ followUps = [] }){

    const overdueCount = followUps.filter(f=>f.bucket==="overdue").length;
    const todayCount = followUps.filter(f=>f.bucket==="today").length;
    const upcomingCount = followUps.filter(f=>f.bucket==="upcoming").length;

    return(

        <div className="ovw-card">

            <h3>
                Follow-ups
                <span className="ovw-pill red">{overdueCount} overdue</span>
                <span className="ovw-pill amber">{todayCount} today</span>
                <span className="ovw-pill gray">{upcomingCount} upcoming</span>
            </h3>

            {
                followUps.length===0 ? (

                    <p className="ovw-empty">No follow-ups on file.</p>

                ) : (

                    <table className="ovw-table">

                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Owner</th>
                                <th>Date</th>
                                <th>Note</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                followUps.map(f=>(

                                    <tr key={f.customer_id}>
                                        <td>{f.company_name}</td>
                                        <td>{f.owner || "-"}</td>
                                        <td>
                                            <span className={pillClassFor(f.bucket)} style={{marginRight:6}}>
                                                {pillLabelFor(f.bucket)}
                                            </span>
                                            {f.date}
                                        </td>
                                        <td>{f.note || "-"}</td>
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
