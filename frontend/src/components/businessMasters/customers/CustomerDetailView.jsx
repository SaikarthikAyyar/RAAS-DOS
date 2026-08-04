import { useNavigate } from "react-router-dom";


// ====================================
// FORMATTERS
// Matches the wireframe's INR() — ₹ + rounded, en-IN grouping.
// ====================================

function formatINR(value){

    if(value===null || value===undefined) return "—";

    return "₹" + Math.round(Number(value)).toLocaleString("en-IN");

}

function followUpPill(bucket){

    if(bucket==="overdue") return <span className="bm-pill bm-pill-red">Overdue</span>;

    if(bucket==="today") return <span className="bm-pill bm-pill-amber">Today</span>;

    return <span className="bm-pill bm-pill-gray">Upcoming</span>;

}


// ====================================
// CSV EXPORT (client-side, matches
// wireframe's exportCustomerCSV())
// ====================================

function downloadCSV(filename, headers, rows){

    const escapeCell = value=>{

        const text = value===null || value===undefined ? "" : String(value);

        return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;

    };

    const csv = [

        headers.map(escapeCell).join(","),

        ...rows.map(row=>row.map(escapeCell).join(","))

    ].join("\n");

    const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}


// ====================================
// COMPONENT
// Matches customerDetail(): grid cols2 (1.3fr/.7fr), left card =
// company + contacts + assets, right card (single) = next
// follow-up + linked orders.
// ====================================

export default function CustomerDetailView({

    detail,

    loading,

    onBack,

    onAddContact,

    onSetFollowUp,

    onSendReminder

}){

    const navigate = useNavigate();

    if(loading || !detail){

        return(

            <>

            <button className="bm-backlink" onClick={onBack}>← Back</button>

            <p className="bm-muted" style={{marginTop:12}}>Loading customer...</p>

            </>

        );

    }

    function handleExportAssets(){

        const rows = detail.assets.map(a=>[

            detail.company_name,

            a.division,

            a.plant,

            a.department,

            a.name,

            a.cleaning_frequency,

            a.next_due

        ]);

        downloadCSV(

            detail.company_name.replace(/\s/g, "_")+"_assets.csv",

            ["Company","Division","Plant","Department","Asset","Frequency","Next due"],

            rows

        );

    }

    return(

        <>

        <button className="bm-backlink" onClick={onBack}>← Back</button>

        <div className="bm-detail-grid">

            <div className="bm-card">

                <h3>{detail.company_name}</h3>

                <div className="bm-field-row">
                    <span>Category</span>
                    <b>{detail.category || "—"}</b>
                </div>

                <div className="bm-field-row">
                    <span>Industry</span>
                    <b>{detail.industry || "—"}</b>
                </div>

                <div className="bm-field-row">
                    <span>Region</span>
                    <b>{detail.region || "—"}</b>
                </div>

                <div className="bm-field-row">
                    <span>Owner</span>
                    <b>{detail.owner || "—"}</b>
                </div>

                <h4>

                    Contacts

                    <button className="bm-btn bm-btn-xs" onClick={onAddContact}>+ Add</button>

                </h4>

                <table>

                    <thead>
                        <tr><th>Name</th><th>Email</th><th>Phone</th></tr>
                    </thead>

                    <tbody>

                        {

                            detail.contacts.length===0 ? (

                                <tr><td colSpan={3} className="bm-muted">None yet.</td></tr>

                            ) : detail.contacts.map(k=>(

                                <tr key={k.id}>

                                    <td>{k.name}{k.designation ? ` (${k.designation})` : ""}</td>

                                    <td>{k.email || "—"}</td>

                                    <td>{k.phone || "—"}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <h4>

                    Assets on file

                    <span className="bm-pill bm-pill-gray">read-only — added from Survey</span>

                </h4>

                <table>

                    <thead>
                        <tr><th>Division</th><th>Plant</th><th>Department</th><th>Asset</th><th>Next due</th><th>Last verified</th></tr>
                    </thead>

                    <tbody>

                        {

                            detail.assets.length===0 ? (

                                <tr><td colSpan={6} className="bm-muted">No assets registered yet.</td></tr>

                            ) : detail.assets.map(a=>(

                                <tr key={a.id}>

                                    <td>{a.division || "—"}</td>

                                    <td>{a.plant || "—"}</td>

                                    <td>{a.department || "—"}</td>

                                    <td>{a.name || "—"}</td>

                                    <td>{a.next_due || "—"}</td>

                                    <td>{a.last_verified ? `${a.last_verified} (${a.verified_by || "—"})` : "—"}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <button

                    className="bm-btn bm-btn-ghost"

                    style={{marginTop:8}}

                    onClick={handleExportAssets}

                >

                    ⬇ Export this customer

                </button>

            </div>

            <div className="bm-card">

                <h3>Next follow-up</h3>

                {

                    detail.next_follow_up_date ? (

                        <>

                        <div className="bm-field-row">
                            <span>Date</span>
                            <b>{followUpPill(detail.follow_up_bucket)} {detail.next_follow_up_date}</b>
                        </div>

                        <div className="bm-field-row">
                            <span>Note</span>
                            <b>{detail.next_follow_up_note || "—"}</b>
                        </div>

                        </>

                    ) : (

                        <p className="bm-muted">None scheduled.</p>

                    )

                }

                <div style={{marginTop:10, display:"flex", gap:8}}>

                    <button className="bm-btn" onClick={onSetFollowUp}>Set / update</button>

                    <button className="bm-btn bm-btn-primary" onClick={onSendReminder}>Send reminder</button>

                </div>

                <h4>Linked orders</h4>

                <table>

                    <thead>
                        <tr><th>Enquiry</th><th>Stage</th><th>Value</th><th></th></tr>
                    </thead>

                    <tbody>

                        {

                            detail.linked_enquiries.length===0 ? (

                                <tr><td colSpan={4} className="bm-muted">None yet.</td></tr>

                            ) : detail.linked_enquiries.map(e=>(

                                <tr key={e.id}>

                                    <td>#{e.id}</td>

                                    <td>{e.stage}</td>

                                    <td>{formatINR(e.value)}</td>

                                    <td>

                                        <button

                                            className="bm-backlink"

                                            onClick={()=>navigate(`/enquiries/workspace/${e.id}`)}

                                        >

                                            Open →

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

        </>

    );

}
