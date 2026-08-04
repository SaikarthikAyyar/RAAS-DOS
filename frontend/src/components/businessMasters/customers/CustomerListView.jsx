// ====================================
// PILL FOR FOLLOW-UP BUCKET
// Matches the wireframe's pillForFU(): overdue=red, today=amber,
// upcoming=gray.
// ====================================

function followUpPill(bucket){

    if(bucket==="overdue") return <span className="bm-pill bm-pill-red">Overdue</span>;

    if(bucket==="today") return <span className="bm-pill bm-pill-amber">Today</span>;

    return <span className="bm-pill bm-pill-gray">Upcoming</span>;

}


// ====================================
// COMPONENT
// Matches mastersCustomers(): one card, "+ New customer" inline in
// the h3 heading (not a separate page header).
// ====================================

export default function CustomerListView({

    customers,

    loading,

    error,

    onOpenDetail,

    onNewCustomer

}){

    return(

        <div className="bm-card">

            <h3>

                Customer master (CRM)

                <button

                    className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                    onClick={onNewCustomer}

                >

                    + New customer

                </button>

            </h3>

            {

                loading ? (

                    <p className="bm-muted">Loading customers...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : customers.length===0 ? (

                    <p className="bm-muted">No customers yet — create the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Company</th>

                                <th>Category</th>

                                <th>Owner</th>

                                <th>Assets on file</th>

                                <th>Next follow-up</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                customers.map(c=>(

                                    <tr key={c.id}>

                                        <td>{c.company_name}</td>

                                        <td>{c.category || "—"}</td>

                                        <td>{c.owner || "—"}</td>

                                        <td>{c.assets_count}</td>

                                        <td>

                                            {

                                                c.next_follow_up_date ? (

                                                    <>{followUpPill(c.follow_up_bucket)} {c.next_follow_up_date}</>

                                                ) : "—"

                                            }

                                        </td>

                                        <td>

                                            <button

                                                className="bm-backlink"

                                                onClick={()=>onOpenDetail(c.id)}

                                            >

                                                Open 360 →

                                            </button>

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
