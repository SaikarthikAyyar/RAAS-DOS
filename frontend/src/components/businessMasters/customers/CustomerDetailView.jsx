import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../../contexts/AuthContext";

import { exportCustomer360 } from "../../../services/customerMasterService";

import { formatApiError } from "../../../utils/apiError";


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
// COMPONENT
// Matches customerDetail(): grid cols2 (1.3fr/.7fr), left card =
// company + contacts + assets, right card (single) = next
// follow-up + linked orders.
// ====================================

export default function CustomerDetailView({

    detail,

    loading,

    allUsers,

    onBack,

    onAddContact,

    onSetFollowUp,

    onSendReminder,

    onUpdateOwner,

    onEdit,

    onDelete,

    onDeleteAsset,

    onDeleteContact

}){

    const navigate = useNavigate();

    const { hasTask, user } = useAuth();

    const isAdmin = user?.role === "admin";

    const [editingOwner, setEditingOwner] = useState(false);

    const [ownerDraft, setOwnerDraft] = useState("");

    const [exporting, setExporting] = useState(false);

    useEffect(()=>{

        setOwnerDraft(detail?.owner_user_id || "");

        setEditingOwner(false);

    }, [detail?.id, detail?.owner_user_id]);

    function handleSaveOwner(){

        // Deliberately doesn't close the editor here - onUpdateOwner's
        // remark prompt can be cancelled (same convention as every other
        // Business Masters create/edit flow), in which case nothing
        // should appear to have saved. The effect above closes the
        // editor once `detail.owner_user_id` actually changes after a
        // real save completes and the parent reloads.

        onUpdateOwner(ownerDraft ? Number(ownerDraft) : null);

    }

    if(loading || !detail){

        return(

            <>

            <p className="bm-muted" style={{marginTop:12}}>Loading customer...</p>

            <button className="bm-backlink" onClick={onBack}>← Back</button>

            </>

        );

    }

    async function handleExportCustomer(){

        setExporting(true);

        try{
            await exportCustomer360(detail.id, detail.company_name);
        }
        catch(err){
            alert(formatApiError(err, "Unable to export this customer."));
        }
        finally{
            setExporting(false);
        }

    }

    return(

        <>

        <div className="bm-detail-header">
            <button className="bm-backlink" style={{marginTop:12}} onClick={onBack}>← Back</button>
        </div>
        <div className="bm-detail-grid">

            <div className="bm-card">

                <h3>

                    {detail.company_name}

                    {isAdmin && (

                        <span style={{display:"inline-flex", gap:6, marginLeft:10}}>

                            <button className="bm-btn bm-btn-xs" onClick={onEdit}>Edit</button>

                            <button className="bm-btn bm-btn-xs bm-btn-ghost" style={{color:"#991b1b"}} onClick={onDelete}>Delete</button>

                        </span>

                    )}

                </h3>

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
                    <span>Account Owner</span>
                    {
                        editingOwner ? (
                            <span style={{display:"flex", gap:6, alignItems:"center"}}>
                                <select value={ownerDraft} onChange={e=>setOwnerDraft(e.target.value)}>
                                    <option value="">Select</option>
                                    {(allUsers || []).map(u=>(
                                        <option key={u.id} value={u.id}>{u.name}</option>
                                    ))}
                                </select>
                                <button className="bm-btn bm-btn-xs" onClick={handleSaveOwner}>Save</button>
                                <button className="bm-btn bm-btn-xs bm-btn-ghost" onClick={()=>setEditingOwner(false)}>Cancel</button>
                            </span>
                        ) : (
                            <span style={{display:"flex", gap:6, alignItems:"center"}}>
                                <b>{detail.owner_name || detail.owner || "—"}</b>
                                {hasTask("bm-tab-customers", "reassign_account_owner") && (
                                    <button className="bm-btn bm-btn-xs" onClick={()=>setEditingOwner(true)}>Reassign</button>
                                )}
                            </span>
                        )
                    }
                </div>

                <div className="bm-field-row">
                    <span>Created By</span>
                    <b>{detail.created_by_name || "—"}</b>
                </div>

                <h4>

                    Contacts

                    {hasTask("bm-tab-customers", "add_contact") && (
                        <button className="bm-btn bm-btn-xs" onClick={onAddContact}>+ Add</button>
                    )}

                </h4>

                <table>

                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            {hasTask("bm-tab-customers", "remove_contact") && <th></th>}
                        </tr>
                    </thead>

                    <tbody>

                        {

                            detail.contacts.length===0 ? (

                                <tr>
                                    <td
                                        colSpan={hasTask("bm-tab-customers", "remove_contact") ? 4 : 3}
                                        className="bm-muted"
                                    >
                                        None yet.
                                    </td>
                                </tr>

                            ) : detail.contacts.map(k=>(

                                <tr key={k.id}>

                                    <td>{k.name}{k.designation ? ` (${k.designation})` : ""}</td>

                                    <td>{k.email || "—"}</td>

                                    <td>{k.phone || "—"}</td>

                                    {
                                        hasTask("bm-tab-customers", "remove_contact") && (
                                            <td>
                                                <button
                                                    className="bm-backlink"
                                                    style={{color:"#991b1b"}}
                                                    onClick={()=>onDeleteContact(k.id)}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        )
                                    }

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
                        <tr><th>Division</th><th>Plant</th><th>Department</th><th>Asset</th>{isAdmin && <th></th>}</tr>
                    </thead>

                    <tbody>

                        {

                            detail.assets.length===0 ? (

                                <tr><td colSpan={isAdmin ? 5 : 4} className="bm-muted">No assets registered yet.</td></tr>

                            ) : detail.assets.map(a=>(

                                <tr key={a.id}>

                                    <td>{a.division || "—"}</td>

                                    <td>{a.plant || "—"}</td>

                                    <td>{a.department || "—"}</td>

                                    <td>{a.name || "—"}</td>

                                    {

                                        isAdmin && (

                                            <td>

                                                <button

                                                    className="bm-backlink"

                                                    style={{color:"#991b1b"}}

                                                    onClick={()=>onDeleteAsset(a.id)}

                                                >

                                                    Remove

                                                </button>

                                            </td>

                                        )

                                    }

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                {hasTask("bm-tab-customers", "export_customer_360") && (

                    <button

                        className="bm-btn bm-btn-ghost"

                        style={{marginTop:8}}

                        onClick={handleExportCustomer}

                        disabled={exporting}

                    >

                        {exporting ? "Exporting..." : "⬇ Export Current Customer"}

                    </button>

                )}

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

                    {hasTask("bm-tab-customers", "set_follow_up") && (
                        <button className="bm-btn" onClick={onSetFollowUp}>Set / update</button>
                    )}

                    {hasTask("bm-tab-customers", "send_reminder") && (
                        <button className="bm-btn bm-btn-primary" onClick={onSendReminder}>Send reminder</button>
                    )}

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
