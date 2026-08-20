// ====================================
// KPI TILE GRID
// Matches the wireframe's own .kpi tile scale exactly (see
// DashboardOverview.css) - not the larger .dashboard-stat-card
// convention the other 4 role dashboards use.
// ====================================

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

export default function KpiTileGrid({ kpis }){

    if(!kpis){
        return null;
    }

    const tiles = [

        { title:"Open Enquiries", value: kpis.open_enquiries },
        { title:"Pipeline Value", value: inr(kpis.pipeline_value) },
        { title:"Pending Approval", value: kpis.pending_approval },
        { title:"Active Jobs", value: kpis.active_jobs },
        { title:"Quote & Commercial Backlog", value: kpis.quote_commercial_backlog },
        { title:"Ops Amendments Raised", value: kpis.ops_amendments_raised }

    ];

    return(

        <div className="ovw-grid-6">

            {
                tiles.map(tile=>(

                    <div className="ovw-kpi" key={tile.title}>
                        <b>{tile.value}</b>
                        <span>{tile.title}</span>
                    </div>

                ))
            }

        </div>

    );

}
