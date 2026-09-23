// ====================================
// KPI TILE GRID
// Matches the wireframe's own .kpi tile scale exactly (see
// DashboardOverview.css) - not the larger .dashboard-stat-card
// convention the other 4 role dashboards use.
// ====================================

import { Inbox, IndianRupee, Clock, Briefcase, FileClock, AlertTriangle } from "lucide-react";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

export default function KpiTileGrid({ kpis }){

    if(!kpis){
        return null;
    }

    const tiles = [

        { title:"Open Enquiries", value: kpis.open_enquiries, icon: Inbox },
        { title:"Pipeline Value", value: inr(kpis.pipeline_value), icon: IndianRupee },
        { title:"Pending Approval", value: kpis.pending_approval, icon: Clock },
        { title:"Active Jobs", value: kpis.active_jobs, icon: Briefcase },
        { title:"Quote & Commercial Backlog", value: kpis.quote_commercial_backlog, icon: FileClock },
        { title:"Ops Amendments Raised", value: kpis.ops_amendments_raised, icon: AlertTriangle }

    ];

    return(

        <div className="ovw-grid-6">

            {
                tiles.map((tile, i)=>{

                    const Icon = tile.icon;

                    return(

                        <div
                            className="ovw-kpi ui-card-interactive ui-fade-in"
                            key={tile.title}
                            style={{ animationDelay: `${i * 40}ms` }}
                        >
                            <span className="ovw-kpi-icon"><Icon size={17} strokeWidth={2.25} /></span>
                            <b>{tile.value}</b>
                            <span>{tile.title}</span>
                        </div>

                    );

                })
            }

        </div>

    );

}
