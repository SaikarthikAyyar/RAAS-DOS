// ====================================
// IMPORTS
// ====================================

import { Inbox, Send, Users, ClipboardCheck, FileText, ShoppingCart } from "lucide-react";

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

            value:stats.received_count ?? 0,

            icon:Inbox

        },

        {

            title:"Sent Enquiries",

            value:stats.sent_count ?? 0,

            icon:Send

        },

        {

            title:"Customer Requests",

            value:stats.customer_requests ?? 0,

            icon:Users

        },

        {

            title:"Sales Surveys",

            value:stats.survey_completed ?? 0,

            icon:ClipboardCheck

        },

        {

            title:"Quotes",

            value:stats.quote_created ?? 0,

            icon:FileText

        },

        {
            title:"Purchase Orders",

            value:stats.quote_approved ?? 0,

            icon:ShoppingCart

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

                            icon={card.icon}

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

    value,

    icon:Icon

}){

    return(

        <div className="dashboard-stat-card">

            {Icon && <span className="dashboard-stat-icon"><Icon size={20} strokeWidth={2.25} /></span>}

            <div className="dashboard-stat-value">

                {value}

            </div>

            <div className="dashboard-stat-title">

                {title}

            </div>

        </div>

    );

}