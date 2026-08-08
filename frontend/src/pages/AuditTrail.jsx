import { useEffect, useState } from "react";

import { useNavigate, useSearchParams } from "react-router-dom";

import * as XLSX from "xlsx";

import "../components/auditTrail/AuditTrail.css";

import { useAuth } from "../contexts/AuthContext";

import {
    getNotifications,
    getNotificationsExport,
    markAllNotificationsRead
} from "../services/notificationsService";

import { NOTIFICATIONS_REFRESH_EVENT } from "../components/layout/Topbar";


// ====================================
// SHEET NAME
// Same 31-char-cap truncation fix used by the Business Masters /
// customer 360 export (CustomerDetailView.jsx's sheetName()).
// ====================================

function sheetName(companyName, enquiryId){

    const cleanCompany = String(companyName || "Unknown").replace(/[\[\]:*?/\\]/g, "");

    const prefix = `Enquiry ${enquiryId} - `;

    const truncatedCompany = cleanCompany.slice(0, Math.max(31 - prefix.length, 0));

    return `${prefix}${truncatedCompany}`.slice(0, 31);

}

function formatDate(value){

    if(!value) return "—";

    const date = new Date(value);

    if(Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day:"2-digit", month:"short", year:"numeric",
        hour:"2-digit", minute:"2-digit"
    });

}


// ====================================
// COMPONENT
// ====================================

export default function AuditTrail(){

    const { user } = useAuth();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [dateFrom, setDateFrom] = useState(searchParams.get("date_from") || "");

    const [dateTo, setDateTo] = useState(searchParams.get("date_to") || "");

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [exporting, setExporting] = useState(false);

    async function loadNotifications(){

        setLoading(true);

        setError("");

        try{

            const data = await getNotifications({
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined,
                userId: user?.id
            });

            setNotifications(data);

        }
        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to load the audit trail.");

        }
        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        loadNotifications();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dateFrom, dateTo, user?.id]);

    // Per-user mark-all-read, fired on every visit (direct nav or via
    // the bell icon) - only affects this user's unread state.
    useEffect(()=>{

        if(!user?.id) return;

        markAllNotificationsRead(user.id)
            .then(()=>{
                window.dispatchEvent(new Event(NOTIFICATIONS_REFRESH_EVENT));
            })
            .catch(err=>console.error("[AuditTrail] mark-all-read failed", err));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const rows = notifications.flatMap(notification=>

        (notification.changes || []).map(change=>({
            key: `${notification.id}-${change.field_name}`,
            enquiryId: notification.enquiry_id,
            customerName: notification.customer_name,
            module: notification.module,
            fieldName: change.field_name,
            previousValue: change.previous_value ?? "—",
            updatedValue: change.updated_value ?? "—",
            userName: notification.user_name,
            date: notification.created_at
        }))

    );

    async function handleExport(){

        setExporting(true);

        try{

            const data = await getNotificationsExport({
                dateFrom: dateFrom || undefined,
                dateTo: dateTo || undefined
            });

            const header = [
                "User name", "User role", "Module",
                "Field changed", "Previous value", "Updated value", "Date"
            ];

            const workbook = XLSX.utils.book_new();

            const cases = data.cases || [];

            const otherRows = data.other || [];

            for(const caseEntry of cases){

                const sheetRows = [
                    header,
                    ...caseEntry.rows.map(row=>[
                        row.user_name, row.user_role, row.module,
                        row.field_name, row.previous_value ?? "", row.updated_value ?? "",
                        row.date ?? ""
                    ])
                ];

                const sheet = XLSX.utils.aoa_to_sheet(sheetRows);

                XLSX.utils.book_append_sheet(
                    workbook, sheet,
                    sheetName(caseEntry.customer_name, caseEntry.enquiry_id)
                );

            }

            if(otherRows.length){

                const sheetRows = [
                    header,
                    ...otherRows.map(row=>[
                        row.user_name, row.user_role, row.module,
                        row.field_name, row.previous_value ?? "", row.updated_value ?? "",
                        row.date ?? ""
                    ])
                ];

                XLSX.utils.book_append_sheet(
                    workbook,
                    XLSX.utils.aoa_to_sheet(sheetRows),
                    "Administration - Other"
                );

            }

            if(!cases.length && !otherRows.length){

                XLSX.utils.book_append_sheet(
                    workbook, XLSX.utils.aoa_to_sheet([header]), "Audit Trail"
                );

            }

            XLSX.writeFile(workbook, "RAAS_DOS_Audit_Trail.xlsx");

        }
        catch(err){

            console.error(err);
            alert("Unable to export the audit trail.");

        }
        finally{

            setExporting(false);

        }

    }

    return(

        <div className="audit-page">

            <div className="audit-title-row">

                <div>

                    <h1 className="audit-header-title">Audit trail</h1>

                    <p className="audit-header-subtitle">Field-level log, enquiry to closure.</p>

                </div>

                <button
                    type="button"
                    className="audit-export-button"
                    onClick={handleExport}
                    disabled={exporting}
                >

                    {exporting ? "Exporting…" : "⬇ Export to Excel"}

                </button>

            </div>

            <div className="audit-filterbar">

                <label>From</label>

                <input
                    type="date"
                    value={dateFrom}
                    onChange={e=>setDateFrom(e.target.value)}
                />

                <label>To</label>

                <input
                    type="date"
                    value={dateTo}
                    onChange={e=>setDateTo(e.target.value)}
                />

                {
                    (dateFrom || dateTo) && (
                        <button type="button" onClick={()=>{ setDateFrom(""); setDateTo(""); }}>
                            Clear
                        </button>
                    )
                }

            </div>

            <div className="audit-card">

                <table className="audit-table">

                    <thead>
                        <tr>
                            <th>Case</th>
                            <th>Customer</th>
                            <th>Module</th>
                            <th>Field</th>
                            <th>From</th>
                            <th>To</th>
                            <th>By</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>

                        {
                            loading ? (

                                <tr className="audit-empty-row">
                                    <td colSpan={8}>Loading…</td>
                                </tr>

                            ) : error ? (

                                <tr className="audit-empty-row">
                                    <td colSpan={8}>{error}</td>
                                </tr>

                            ) : rows.length === 0 ? (

                                <tr className="audit-empty-row">
                                    <td colSpan={8}>No entries.</td>
                                </tr>

                            ) : (

                                rows.map(row=>(

                                    <tr key={row.key}>

                                        <td>
                                            {
                                                row.enquiryId ? (
                                                    <button
                                                        type="button"
                                                        className="audit-backlink"
                                                        onClick={()=>navigate(`/enquiries/workspace/${row.enquiryId}`)}
                                                    >
                                                        #{row.enquiryId}
                                                    </button>
                                                ) : (
                                                    <span className="audit-muted">—</span>
                                                )
                                            }
                                        </td>

                                        <td>{row.customerName || "—"}</td>
                                        <td>{row.module}</td>
                                        <td>{row.fieldName}</td>
                                        <td className="audit-old">{row.previousValue}</td>
                                        <td className="audit-new">{row.updatedValue}</td>
                                        <td>{row.userName}</td>
                                        <td>{formatDate(row.date)}</td>

                                    </tr>

                                ))

                            )
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
