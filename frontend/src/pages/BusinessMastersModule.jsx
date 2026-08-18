import {

    useState,

    useEffect,

    useCallback

} from "react";

import * as XLSX from "xlsx";

import "../components/businessMasters/BusinessMasters.css";

import { businessMastersTabs } from "../data/businessMastersTabs";

import CustomerListView from "../components/businessMasters/customers/CustomerListView";
import CustomerDetailView from "../components/businessMasters/customers/CustomerDetailView";
import NewCustomerModal from "../components/businessMasters/customers/NewCustomerModal";
import EditCustomerModal from "../components/businessMasters/customers/EditCustomerModal";
import AddContactModal from "../components/businessMasters/customers/AddContactModal";
import SetFollowUpModal from "../components/businessMasters/customers/SetFollowUpModal";
import SendReminderModal from "../components/businessMasters/customers/SendReminderModal";
import ServiceConfigTab from "../components/businessMasters/serviceConfig/ServiceConfigTab";
import DewateringMethodsTab from "../components/businessMasters/dewatering/DewateringMethodsTab";
import AccessoriesTab from "../components/businessMasters/accessories/AccessoriesTab";
import CommercialRulesTab from "../components/businessMasters/rules/CommercialRulesTab";
import LookupListsTab from "../components/businessMasters/lookupLists/LookupListsTab";
import EmailTemplatesTab from "../components/businessMasters/emailTemplates/EmailTemplatesTab";
import QuoteTemplatesTab from "../components/businessMasters/quoteTemplates/QuoteTemplatesTab";
import HubsTab from "../components/businessMasters/hubs/HubsTab";
import MachinesTab from "../components/businessMasters/machines/MachinesTab";
import PumpsTab from "../components/businessMasters/pumps/PumpsTab";

import {

    getCustomers,

    createCustomer,

    getCustomerDetail,

    addContact,

    setFollowUp,

    updateCustomerOwner,

    updateCustomer,

    deleteCustomer,

    deleteAsset,

    getCustomersReport

} from "../services/customerMasterService";

import { exportTab } from "../services/businessMastersExportService";

import { getUsers } from "../services/administrationUsersService";

import { useAuth } from "../contexts/AuthContext";

import { useRemarkPrompt } from "../hooks/useRemarkPrompt";

import { buildActor } from "../utils/actor";


// ====================================
// CUSTOMERS TAB
// Holds its own selectedCustomerId (list <-> 360) exactly like the
// wireframe's mastersCustomers()/customerDetail() toggle.
// ====================================

function CustomersTab({

    customers,

    loading,

    error,

    onReload

}){

    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [detail, setDetail] = useState(null);

    const [detailLoading, setDetailLoading] = useState(false);

    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);

    const [showAddContactModal, setShowAddContactModal] = useState(false);

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);

    const [showReminderModal, setShowReminderModal] = useState(false);

    const [allUsers, setAllUsers] = useState([]);

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    useEffect(()=>{

        getUsers()
            .then(setAllUsers)
            .catch(err=>console.error(err));

    }, []);

    const loadDetail = useCallback(async(id)=>{

        setDetailLoading(true);

        try{

            const data = await getCustomerDetail(id);

            setDetail(data);

        }

        catch(err){

            console.error(err);

        }

        finally{

            setDetailLoading(false);

        }

    }, []);

    useEffect(()=>{

        if(selectedCustomerId){

            loadDetail(selectedCustomerId);

        }

    }, [selectedCustomerId, loadDetail]);

    function handleOpenDetail(id){

        setDetail(null);

        setSelectedCustomerId(id);

    }

    function handleBack(){

        setSelectedCustomerId(null);

        setDetail(null);

    }

    async function handleCreateCustomer(payload){

        const remark = await promptForRemark("Creating this customer");

        if(remark===null){
            return;
        }

        await createCustomer({ ...payload, actor:buildActor(user), remark });

        setShowNewCustomerModal(false);

        onReload();

    }

    async function handleAddContact(payload){

        const remark = await promptForRemark("Adding this contact");

        if(remark===null){
            return;
        }

        await addContact(selectedCustomerId, { ...payload, actor:buildActor(user), remark });

        setShowAddContactModal(false);

        loadDetail(selectedCustomerId);

    }

    async function handleSetFollowUp(payload){

        const remark = await promptForRemark("Updating this follow-up");

        if(remark===null){
            return;
        }

        await setFollowUp(selectedCustomerId, { ...payload, actor:buildActor(user), remark });

        setShowFollowUpModal(false);

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleUpdateOwner(ownerUserId){

        const remark = await promptForRemark("Reassigning the Account Owner");

        if(remark===null){
            return;
        }

        await updateCustomerOwner(selectedCustomerId, { owner_user_id:ownerUserId, actor:buildActor(user), remark });

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleEditCustomer(fields){

        const remark = await promptForRemark("Editing this customer");

        if(remark===null){
            return;
        }

        await updateCustomer(selectedCustomerId, { ...fields, actor:buildActor(user), remark });

        setShowEditCustomerModal(false);

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleDeleteCustomer(){

        const remark = await promptForRemark("Deleting this customer");

        if(remark===null){
            return;
        }

        try{

            await deleteCustomer(selectedCustomerId, buildActor(user), remark);

            handleBack();

            onReload();

        }

        catch(err){

            alert(err?.detail || "Unable to delete customer.");

        }

    }

    async function handleDeleteAsset(assetId){

        const remark = await promptForRemark("Removing this asset");

        if(remark===null){
            return;
        }

        try{

            await deleteAsset(assetId, buildActor(user), remark);

            loadDetail(selectedCustomerId);

            onReload();

        }

        catch(err){

            alert(err?.detail || "Unable to delete asset.");

        }

    }

    return(

        <>

            {

                selectedCustomerId ? (

                    <CustomerDetailView

                        detail={detail}

                        loading={detailLoading}

                        allUsers={allUsers}

                        onBack={handleBack}

                        onAddContact={()=>setShowAddContactModal(true)}

                        onSetFollowUp={()=>setShowFollowUpModal(true)}

                        onSendReminder={()=>setShowReminderModal(true)}

                        onUpdateOwner={handleUpdateOwner}

                        onEdit={()=>setShowEditCustomerModal(true)}

                        onDelete={handleDeleteCustomer}

                        onDeleteAsset={handleDeleteAsset}

                    />

                ) : (

                    <CustomerListView

                        customers={customers}

                        loading={loading}

                        error={error}

                        onOpenDetail={handleOpenDetail}

                        onNewCustomer={()=>setShowNewCustomerModal(true)}

                    />

                )

            }

            {

                showNewCustomerModal && (

                    <NewCustomerModal

                        onClose={()=>setShowNewCustomerModal(false)}

                        onCreate={handleCreateCustomer}

                    />

                )

            }

            {

                showEditCustomerModal && detail && (

                    <EditCustomerModal

                        detail={detail}

                        onClose={()=>setShowEditCustomerModal(false)}

                        onSave={handleEditCustomer}

                    />

                )

            }

            {

                showAddContactModal && (

                    <AddContactModal

                        onClose={()=>setShowAddContactModal(false)}

                        onAdd={handleAddContact}

                    />

                )

            }

            {

                showFollowUpModal && (

                    <SetFollowUpModal

                        initialDate={detail?.next_follow_up_date}

                        initialOwner={detail?.next_follow_up_owner}

                        initialNote={detail?.next_follow_up_note}

                        onClose={()=>setShowFollowUpModal(false)}

                        onSave={handleSetFollowUp}

                    />

                )

            }

            {

                showReminderModal && detail && (

                    <SendReminderModal

                        detail={detail}

                        onClose={()=>setShowReminderModal(false)}

                        onSent={()=>{

                            setShowReminderModal(false);

                            alert(`Reminder email sent regarding ${detail.company_name}.`);

                        }}

                    />

                )

            }

            {remarkModal}

        </>

    );

}


// ====================================
// PLACEHOLDER TAB
// Honest "not built yet" - same pattern used for unbuilt Enquiry
// Workspace tabs (PO / Job Created / Execution / Audit Trail).
// ====================================

function PlaceholderTab({ label }){

    return(

        <div className="bm-card">

            <h3>{label}</h3>

            <p className="bm-placeholder">Not built yet.</p>

        </div>

    );

}


// ====================================
// XLSX EXPORT HELPERS
// ====================================

// JSONB array/object columns (Machine.preferred_job_types etc.) come
// back as real arrays/objects - XLSX.utils.json_to_sheet would render
// those as "[object Object]", so flatten them to readable text first.
// Every other value (including raw FK ids and timestamp strings) is
// passed through untouched - the whole point of this export is to
// show the real DB column values, not a display-formatted version.
function sanitizeRowsForExport(rows){

    return rows.map(row=>{

        const clean = {};

        for(const key of Object.keys(row)){

            const value = row[key];

            if(Array.isArray(value)){
                clean[key] = value.join(", ");
            }
            else if(value !== null && typeof value === "object"){
                clean[key] = JSON.stringify(value);
            }
            else{
                clean[key] = value;
            }

        }

        return clean;

    });

}

function downloadWorkbook(workbook, filename){

    XLSX.writeFile(workbook, filename);

}

// Excel sheet names cap at 31 chars and can't contain []:*?/\ -
// same truncation convention already used for the Customer 360 export.
function safeSheetName(name){

    return name.replace(/[\[\]:*?/\\]/g, "").slice(0, 31);

}


// ====================================
// PAGE
// Matches renderMasters(): .title + .tabs + tab body.
// ====================================

export default function BusinessMastersModule(){

    const [activeTab, setActiveTab] = useState("customers");

    const { permissions, hasTask } = useAuth();

    // Phase 21E: which Business Masters tabs this role can even open.
    // Falls back to "all tabs" pre-load, same accommodation already
    // used by WorkflowTabs.jsx for the Enquiry Workspace tab strip.
    const allowedBusinessMastersTabs = permissions?.businessMasterTabs?.length
        ? businessMastersTabs.filter(([key])=>permissions.businessMasterTabs.includes(`bm-tab-${key}`))
        : businessMastersTabs;

    // If the active tab isn't in the allowed set once permissions have
    // actually loaded (not just "still fetching"), the content area
    // must not keep rendering it just because the tab button is
    // hidden - land on the first tab this role can actually open.
    useEffect(()=>{

        if(!permissions?.loaded){
            return;
        }

        if(!allowedBusinessMastersTabs.some(([key])=>key===activeTab)){
            setActiveTab(allowedBusinessMastersTabs[0]?.[0] || null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions?.loaded, permissions?.businessMasterTabs]);

    const [customers, setCustomers] = useState([]);

    const [customersLoading, setCustomersLoading] = useState(true);

    const [customersError, setCustomersError] = useState("");

    const loadCustomers = useCallback(async()=>{

        setCustomersLoading(true);

        setCustomersError("");

        try{

            const response = await getCustomers();

            setCustomers(response.items ?? []);

        }

        catch(err){

            console.error(err);

            setCustomersError("Unable to load customers.");

        }

        finally{

            setCustomersLoading(false);

        }

    }, []);

    useEffect(()=>{

        loadCustomers();

    }, [loadCustomers]);

    const [exporting, setExporting] = useState(false);

    async function handleExportCustomersReport(){

        const report = await getCustomersReport();

        const workbook = XLSX.utils.book_new();

        const summarySheet = XLSX.utils.aoa_to_sheet([

            ["Company", "Industry", "Location", "Account Manager", "Total Enquiries", "Total Closed Jobs", "Invoice Value"],

            ...report.summary.map(r=>[
                r.company, r.industry, r.location, r.account_manager,
                r.total_enquiries, r.total_closed_jobs, r.invoice_value
            ])

        ]);

        const assetsSheet = XLSX.utils.aoa_to_sheet([

            [
                "Company Name", "Asset Name", "Closed Jobs till date (Count)",
                "Open Enquiries (Till PO Received)", "Enquiry Stage",
                "Last Closed Job Date", "Next Follow-up Date", "Invoice Value",
                "Account Manager"
            ],

            ...report.assets.map(r=>[
                r.company_name, r.asset_name, r.closed_jobs_count,
                r.open_enquiries_count, r.enquiry_stage,
                r.last_closed_job_date, r.next_follow_up_date, r.invoice_value,
                r.account_manager
            ])

        ]);

        const contactsSheet = XLSX.utils.aoa_to_sheet([

            [
                "Company Name", "Category", "Industry", "Region", "GST Number",
                "Account Manager", "POC Name", "POC Designation", "POC Email", "POC Phone"
            ],

            ...report.contacts.map(r=>[
                r.company_name, r.category, r.industry, r.region, r.gst_number,
                r.account_manager, r.poc_name, r.poc_designation, r.poc_email, r.poc_phone
            ])

        ]);

        XLSX.utils.book_append_sheet(workbook, summarySheet, "Customer Summary");
        XLSX.utils.book_append_sheet(workbook, assetsSheet, "Assets");
        XLSX.utils.book_append_sheet(workbook, contactsSheet, "Company & POC");

        downloadWorkbook(workbook, "Customers_Report.xlsx");

    }

    async function handleExportSimpleTab(){

        const label = businessMastersTabs.find(([key])=>key===activeTab)?.[1] || activeTab;

        let data;

        try{

            data = await exportTab(activeTab);

        }

        catch(err){

            alert(err?.detail || "Nothing to export for this tab yet.");

            return;

        }

        if(!data.sheets || data.sheets.every(sheet=>sheet.rows.length===0)){

            alert("No data to export for this tab yet.");

            return;

        }

        const workbook = XLSX.utils.book_new();

        data.sheets.forEach(sheet=>{

            const rows = sanitizeRowsForExport(sheet.rows);

            const worksheet = rows.length
                ? XLSX.utils.json_to_sheet(rows)
                : XLSX.utils.aoa_to_sheet([["No rows yet."]]);

            XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName(sheet.name));

        });

        downloadWorkbook(workbook, `${label.replace(/\s+/g, "_")}.xlsx`);

    }

    async function handleExportCurrentTab(){

        setExporting(true);

        try{

            if(activeTab==="customers"){

                if(customersLoading){
                    alert("Customers are still loading — try again in a moment.");
                    return;
                }

                if(customers.length===0){
                    alert("No customers to export yet.");
                    return;
                }

                await handleExportCustomersReport();

            }

            else{

                await handleExportSimpleTab();

            }

        }

        catch(err){

            console.error(err);

            alert("Unable to export this tab right now.");

        }

        finally{

            setExporting(false);

        }

    }

    return(

        <div className="bm-module">

            <div className="bm-title">

                <div>

                    <h1>Business masters</h1>

                    <p>Every dropdown option in the system lives in Lookup Lists — nothing hardcoded inline.</p>

                </div>

                {hasTask(`bm-tab-${activeTab}`, "export_current_tab") && (

                    <button

                        className="bm-btn bm-btn-ghost"

                        onClick={handleExportCurrentTab}

                        disabled={exporting || (activeTab==="customers" && customersLoading)}

                    >

                        {exporting ? "Exporting..." : "⬇ Export current tab"}

                    </button>

                )}

            </div>

            <div className="bm-tabs">

                {

                    allowedBusinessMastersTabs.map(([key, label])=>(

                        <button

                            key={key}

                            className={activeTab===key ? "active" : ""}

                            onClick={()=>setActiveTab(key)}

                        >

                            {label}

                        </button>

                    ))

                }

            </div>

            {

                activeTab==="customers" ? (

                    <CustomersTab

                        customers={customers}

                        loading={customersLoading}

                        error={customersError}

                        onReload={loadCustomers}

                    />

                ) : activeTab==="serviceconfig" ? (

                    <ServiceConfigTab />

                ) : activeTab==="dewatering" ? (

                    <DewateringMethodsTab />

                ) : activeTab==="accessories" ? (

                    <AccessoriesTab />

                ) : activeTab==="rules" ? (

                    <CommercialRulesTab />

                ) : activeTab==="lists" ? (

                    <LookupListsTab />

                ) : activeTab==="emailtemplates" ? (

                    <EmailTemplatesTab />

                ) : activeTab==="quotetemplates" ? (

                    <QuoteTemplatesTab />

                ) : activeTab==="hubs" ? (

                    <HubsTab />

                ) : activeTab==="machines" ? (

                    <MachinesTab />

                ) : activeTab==="pumps" ? (

                    <PumpsTab />

                ) : (

                    <PlaceholderTab

                        label={businessMastersTabs.find(([key])=>key===activeTab)?.[1]}

                    />

                )

            }

        </div>

    );

}
