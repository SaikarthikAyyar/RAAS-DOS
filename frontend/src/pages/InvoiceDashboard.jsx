import { useEffect, useState } from "react";

import "../components/dashboard/overview/DashboardOverview.css";
import "../components/businessMasters/BusinessMasters.css";

import { getInvoiceDashboardKpi } from "../services/invoiceDashboardService";

import RevenueTab from "../components/invoiceDashboard/RevenueTab";
import DeploymentTab from "../components/invoiceDashboard/DeploymentTab";


function inr(value){
    if(value===null || value===undefined) return "-";
    return "Rs " + Math.round(value).toLocaleString("en-IN");
}


// ====================================
// INVOICE DASHBOARD
// Everything but Total PO revenue is resolved by walking the real
// Enquiry -> Invoice -> Execution -> machine reference chain (Phase 39) -
// no parallel lookups anywhere in this module.
// ====================================

export default function InvoiceDashboard(){

    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("revenue");

    useEffect(()=>{

        (async ()=>{
            setLoading(true);
            const data = await getInvoiceDashboardKpi();
            setKpi(data);
            setLoading(false);
        })();

    }, []);

    const tiles = kpi ? [
        { title: "Total PO Revenue", value: inr(kpi.total_po_revenue) },
        { title: "Expected Invoice Revenue", value: inr(kpi.expected_invoice_revenue) },
        { title: "Collected Invoice Revenue", value: inr(kpi.collected_invoice_revenue) },
        { title: "Total Machines", value: kpi.total_machines },
        { title: "Deployed Machines", value: kpi.deployed_machines }
    ] : [];

    return(

        <div className="ovw-page">

            <div className="ovw-title">
                <div>
                    <h1>Invoice Dashboard</h1>
                    <p>Revenue and machine deployment, resolved live from the real job/execution reference chain.</p>
                </div>
            </div>

            {loading ? (
                <p className="bm-muted">Loading...</p>
            ) : (
                <div className="ovw-grid-6" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
                    {tiles.map(tile=>(
                        <div className="ovw-kpi" key={tile.title}>
                            <b>{tile.value}</b>
                            <span>{tile.title}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="bm-tabs" style={{margin:"16px 0"}}>
                <button
                    className={activeTab==="revenue" ? "active" : ""}
                    onClick={()=>setActiveTab("revenue")}
                >
                    Revenue
                </button>
                <button
                    className={activeTab==="deployment" ? "active" : ""}
                    onClick={()=>setActiveTab("deployment")}
                >
                    Deployment
                </button>
            </div>

            {activeTab==="revenue" ? <RevenueTab/> : <DeploymentTab/>}

        </div>

    );

}
