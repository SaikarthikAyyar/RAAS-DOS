import {

    useState,

    useEffect,

    useCallback

} from "react";

import "../components/businessMasters/BusinessMasters.css";

import { businessMastersTabs } from "../data/businessMastersTabs";

import CustomerListView from "../components/businessMasters/customers/CustomerListView";
import CustomerDetailView from "../components/businessMasters/customers/CustomerDetailView";
import NewCustomerModal from "../components/businessMasters/customers/NewCustomerModal";
import AddContactModal from "../components/businessMasters/customers/AddContactModal";
import SetFollowUpModal from "../components/businessMasters/customers/SetFollowUpModal";
import SendReminderModal from "../components/businessMasters/customers/SendReminderModal";
import ServiceConfigTab from "../components/businessMasters/serviceConfig/ServiceConfigTab";
import DewateringMethodsTab from "../components/businessMasters/dewatering/DewateringMethodsTab";
import AccessoriesTab from "../components/businessMasters/accessories/AccessoriesTab";
import CommercialRulesTab from "../components/businessMasters/rules/CommercialRulesTab";
import LookupListsTab from "../components/businessMasters/lookupLists/LookupListsTab";
import EmailTemplatesTab from "../components/businessMasters/emailTemplates/EmailTemplatesTab";
import HubsTab from "../components/businessMasters/hubs/HubsTab";
import MachinesTab from "../components/businessMasters/machines/MachinesTab";
import PumpsTab from "../components/businessMasters/pumps/PumpsTab";

import {

    getCustomers,

    createCustomer,

    getCustomerDetail,

    addContact,

    setFollowUp

} from "../services/customerMasterService";

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

    const [showAddContactModal, setShowAddContactModal] = useState(false);

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);

    const [showReminderModal, setShowReminderModal] = useState(false);

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

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

    return(

        <>

            {

                selectedCustomerId ? (

                    <CustomerDetailView

                        detail={detail}

                        loading={detailLoading}

                        onBack={handleBack}

                        onAddContact={()=>setShowAddContactModal(true)}

                        onSetFollowUp={()=>setShowFollowUpModal(true)}

                        onSendReminder={()=>setShowReminderModal(true)}

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
// CSV EXPORT (client-side, matches wireframe's exportCSV())
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
// PAGE
// Matches renderMasters(): .title + .tabs + tab body.
// ====================================

export default function BusinessMastersModule(){

    const [activeTab, setActiveTab] = useState("customers");

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

    function handleExportCurrentTab(){

        if(activeTab==="customers"){

            if(customersLoading){

                alert("Customers are still loading — try again in a moment.");

                return;

            }

            if(customers.length===0){

                alert("No customers to export yet.");

                return;

            }

            downloadCSV(

                "Customers.csv",

                ["Company","Category","Owner"],

                customers.map(c=>[c.company_name, c.category, c.owner])

            );

            return;

        }

        downloadCSV(

            "Export.csv",

            ["Note"],

            [["Use the tab-specific export for full detail."]]

        );

    }

    return(

        <div className="bm-module">

            <div className="bm-title">

                <div>

                    <h1>Business masters</h1>

                    <p>Every dropdown option in the system lives in Lookup Lists — nothing hardcoded inline.</p>

                </div>

                <button

                    className="bm-btn bm-btn-ghost"

                    onClick={handleExportCurrentTab}

                    disabled={activeTab==="customers" && customersLoading}

                >

                    ⬇ Export current tab

                </button>

            </div>

            <div className="bm-tabs">

                {

                    businessMastersTabs.map(([key, label])=>(

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
