import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";


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
// SHEET NAME
// Excel sheet names are capped at 31 characters and can't contain
// []:*?/\ — trims and strips those so long/odd company names don't
// break the export.
// ====================================

function sheetName(suffix, companyName){

    // Excel sheet names cap at 31 chars. Truncating the full
    // "{company} - {suffix}" string from the end (the old approach)
    // could cut the suffix off entirely for a long company name,
    // making the Details and Assets sheets collide on the exact same
    // truncated name and crash the export - truncate the company
    // portion instead, so the suffix always survives.
    const cleanCompany = companyName.replace(/[\[\]:*?/\\]/g, "");

    const cleanSuffix = suffix.replace(/[\[\]:*?/\\]/g, "");

    const tail = ` - ${cleanSuffix}`;

    const truncatedCompany = cleanCompany.slice(0, Math.max(31 - tail.length, 0));

    return `${truncatedCompany}${tail}`.slice(0, 31);

}


// ====================================
// EXPORT FORMATTERS
// ====================================

function formatDateTime(value){

    if(!value) return "";

    const parsed = new Date(value);

    return isNaN(parsed) ? value : parsed.toLocaleString();

}

function formatBool(value){

    if(value===null || value===undefined) return "";

    return value ? "Yes" : "No";

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

            <p className="bm-muted" style={{marginTop:12}}>Loading customer...</p>

            <button className="bm-backlink" onClick={onBack}>← Back</button>

            </>

        );

    }

    const SURVEY_PROFILE_COLUMNS = [
        ["material_category", "Survey: Material Category"],
        ["tank_type", "Survey: Tank Type"],
        ["sludge_hardness", "Survey: Sludge Hardness"],
        ["debris_level", "Survey: Debris Level"],
        ["water_visibility", "Survey: Water Visibility"],
        ["hazard_level", "Survey: Hazard Level"],
        ["tank_length", "Survey: Tank Length/Dia (m)"],
        ["tank_width", "Survey: Tank Width (m)"],
        ["tank_depth", "Survey: Sludge Depth (m)"],
        ["opening_length", "Survey: Opening Length (mm)"],
        ["opening_width", "Survey: Opening Width (mm)"],
        ["opening_height", "Survey: Opening Height (mm)"],
        ["height_from_ground", "Survey: Height From Ground (m)"],
        ["drop_to_floor", "Survey: Drop To Floor (m)"],
        ["setup_distance", "Survey: Setup Distance (m)"],
        ["vertical_lift", "Survey: Vertical Lift (m)"],
        ["hose_distance", "Survey: Hose Distance (m)"],
        ["access_path_width", "Survey: Access Path Width (m)"],
        ["access_support", "Survey: Access Support"],
        ["customer_support", "Survey: Customer Support"],
        ["access_type", "Survey: Access Type"],
        ["equipment_nearby", "Survey: Equipment Nearby"],
        ["scaffolding_needed", "Survey: Scaffolding Needed", true],
        ["crane_available", "Survey: Crane Available", true],
        ["tank_location", "Survey: Tank Location"],
        ["setup_complexity", "Survey: Setup Complexity"],
        ["power_available", "Survey: Power Available"],
        ["water_available", "Survey: Water Available", true],
        ["air_supply_available", "Survey: Air Supply Available"],
        ["confined_space", "Survey: Confined Space", true],
        ["ventilation_required", "Survey: Ventilation Required", true],
        ["gas_testing_required", "Survey: Gas Testing Required", true],
        ["ehs_restriction", "Survey: EHS Restriction"],
        ["power_distance", "Survey: Power Distance (m)"],
        ["abrasiveness", "Survey: Abrasiveness"],
        ["ph_condition", "Survey: pH Condition"],
        ["pump_power_source", "Survey: Pump Power Source"],
        ["discharge_medium", "Survey: Discharge Medium"],
        ["disposal_route", "Survey: Disposal Route"],
        ["disposal_responsibility", "Survey: Disposal Responsibility"],
        ["discharge_point_distance", "Survey: Discharge Point Distance (m)"],
        ["last_survey_id", "Survey: Last Survey ID"],
        ["last_survey_date", "Survey: Last Survey Date"]
    ];

    function handleExportCustomer(){

        const detailsSheet = XLSX.utils.aoa_to_sheet([

            ["Field", "Value"],
            ["ID", detail.id],
            ["Company", detail.company_name],
            ["Category", detail.category || ""],
            ["Industry", detail.industry || ""],
            ["Region", detail.region || ""],
            ["Owner", detail.owner || ""],
            ["GST Number", detail.gst_number || ""],
            ["Next Follow-up Date", detail.next_follow_up_date || ""],
            ["Next Follow-up Owner", detail.next_follow_up_owner || ""],
            ["Next Follow-up Note", detail.next_follow_up_note || ""],
            ["Created At", formatDateTime(detail.created_at)],
            ["Updated At", formatDateTime(detail.updated_at)]

        ]);

        const assetRows = (detail.assets || []).map(a=>[

            a.id,
            a.customer_id,
            a.division || "",
            a.plant || "",
            a.department || "",
            a.name || "",
            a.asset_type || "",
            a.cleaning_frequency || "",
            a.last_cleaned || "",
            a.next_due || "",
            a.last_verified || "",
            a.verified_by || "",
            a.observed_material || "",
            a.access_opening_type || "",
            formatBool(a.can_place_equipment_nearby),
            a.pain_point || "",
            ...SURVEY_PROFILE_COLUMNS.map(([key, , isBool])=>{
                const value = a.profile ? a.profile[key] : undefined;
                if(value === undefined || value === null) return "";
                return isBool ? formatBool(value) : value;
            }),
            formatDateTime(a.created_at)

        ]);

        const assetsSheet = XLSX.utils.aoa_to_sheet([

            [
                "ID", "Customer ID", "Division", "Plant", "Department", "Asset",
                "Asset Type", "Cleaning Frequency", "Last Cleaned", "Next Due",
                "Last Verified", "Verified By", "Observed Material",
                "Access Opening Type", "Equipment Nearby Possible", "Pain Point",
                ...SURVEY_PROFILE_COLUMNS.map(([, label])=>label),
                "Created At"
            ],
            ...assetRows

        ]);

        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, detailsSheet, sheetName("Details", detail.company_name));

        XLSX.utils.book_append_sheet(workbook, assetsSheet, sheetName("Assets", detail.company_name));

        XLSX.writeFile(workbook, `${detail.company_name.replace(/\s/g, "_")}_360_Export.xlsx`);

    }

    return(

        <>

        <div className="bm-detail-header">
            <button className="bm-backlink" style={{marginTop:12}} onClick={onBack}>← Back</button>
        </div>
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

                    onClick={handleExportCustomer}

                >

                    ⬇ Export Current Customer

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
