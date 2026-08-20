// ====================================
// IMPORTS
// ====================================

import { useEffect, useState } from "react";

import "../../components/dashboard/overview/DashboardOverview.css";

import { getDashboardOverview, getPipelineSnapshot } from "../../services/dashboardOverviewService";

import KpiTileGrid from "../../components/dashboard/overview/KpiTileGrid";
import FollowUpsCard from "../../components/dashboard/overview/FollowUpsCard";
import PipelineByStageCard from "../../components/dashboard/overview/PipelineByStageCard";
import AgingCard from "../../components/dashboard/overview/AgingCard";
import RecentCasesTable from "../../components/dashboard/overview/RecentCasesTable";

import { STAGE_LABELS } from "../../data/workflowStages";


// ====================================
// CSV EXPORT
// Same local-helper convention already used by EnquiryModuleFrontPage/
// BusinessMastersModule - not a shared utility, matching how every
// other export button in this app is built.
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
// ====================================

export default function AdminDashboard(){

    const [overview, setOverview] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [exporting, setExporting] = useState(false);

    useEffect(()=>{

        let cancelled = false;

        setLoading(true);

        getDashboardOverview()
            .then(data=>{ if(!cancelled) setOverview(data); })
            .catch(err=>{
                console.error(err);
                if(!cancelled) setError("Unable to load the dashboard.");
            })
            .finally(()=>{ if(!cancelled) setLoading(false); });

        return ()=>{ cancelled = true; };

    }, []);

    async function handleExport(){

        setExporting(true);

        try{

            const snapshot = await getPipelineSnapshot();

            const rows = snapshot.map(c=>[

                `ENQ-${c.enquiry_id}`,
                c.customer_name || "",
                STAGE_LABELS[c.stage] || c.stage,
                c.value ?? 0,
                c.status || ""

            ]);

            downloadCSV(
                "RAAS_DOS_Pipeline_Snapshot.csv",
                ["Enquiry", "Customer", "Stage", "Value", "Status"],
                rows
            );

        }catch(err){

            console.error(err);
            alert("Unable to export the pipeline snapshot.");

        }finally{

            setExporting(false);

        }

    }

    return(

        <div className="ovw-page">

            <div className="ovw-title">

                <div>
                    <h1>Business overview</h1>
                    <p>Cross-functional snapshot across the business.</p>
                </div>

                <button
                    type="button"
                    className="ovw-btn-primary"
                    onClick={handleExport}
                    disabled={!overview || exporting}
                >
                    {exporting ? "Exporting..." : "Export pipeline snapshot"}
                </button>

            </div>

            {loading && <p className="ovw-empty">Loading dashboard...</p>}

            {error && <p className="ovw-empty">{error}</p>}

            {
                overview && (

                    <>

                        <KpiTileGrid kpis={overview.kpi_tiles}/>

                        <div className="ovw-grid-3">
                            <FollowUpsCard followUps={overview.follow_ups}/>
                            <PipelineByStageCard pipelineByStage={overview.pipeline_by_stage}/>
                            <AgingCard agingCases={overview.aging_cases}/>
                        </div>

                        <RecentCasesTable recentCases={overview.recent_cases}/>

                    </>

                )
            }

        </div>

    );

}
