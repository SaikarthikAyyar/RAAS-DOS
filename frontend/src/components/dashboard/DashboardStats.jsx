// ====================================
// COMPONENT
// ====================================

import "./Dashboard.css";

export default function DashboardStats({

    stats

}){

    console.log(

        "Dashboard Statistics:",

        stats

    );

    if(

        !stats

    ){

        return(

            <div className="dashboard-placeholder">

                Loading statistics...

            </div>

        );

    }

    return(

        <div className="dashboard-stats">

            <StatCard

                title="Customer Requests"

                value={stats.customer_requests}

            />



            <StatCard

                title="Survey Completed"

                value={stats.survey_completed}

            />

            <StatCard

                title="Ops Completed"

                value={stats.ops_completed}

            />

            <StatCard

                title="Quote Created"

                value={stats.quote_created}

            />

            <StatCard

                title="Job In Progress"

                value={stats.job_in_progress}

            />

        </div>

    );

}


// ====================================
// STAT CARD
// ====================================

function StatCard({

    title,

    value

}){

    return(

        <div className="dashboard-stat-card">

            <div className="dashboard-stat-value">

                {value}

            </div>

            <div className="dashboard-stat-title">

                {title}

            </div>

        </div>

    );

}