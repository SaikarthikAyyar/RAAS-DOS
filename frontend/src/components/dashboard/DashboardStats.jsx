// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";


// ====================================
// COMPONENT
// ====================================

export default function DashboardStats({

    stats

}){

    if(!stats){

        return(

            <div className="dashboard-placeholder">

                Loading Dashboard...

            </div>

        );

    }

    const cards = [

        {

            title:"Received Enquiries",

            value:stats.received_count ?? 0

        },

        {

            title:"Sent Enquiries",

            value:stats.sent_count ?? 0

        },

        {

            title:"Customer Requests",

            value:stats.customer_requests ?? 0

        },

        {

            title:"Sales Surveys",

            value:stats.survey_completed ?? 0

        },

        {

            title:"Quotes",

            value:stats.quote_created ?? 0

        },

        {

            title:"Jobs",

            value:stats.job_in_progress ?? 0

        }

    ];

    return(

        <div className="dashboard-stats">

            {

                cards.map(

                    (card,index)=>(

                        <StatCard

                            key={index}

                            title={card.title}

                            value={card.value}

                        />

                    )

                )

            }

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