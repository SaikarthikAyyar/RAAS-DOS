import { Briefcase, Receipt, Truck, Users } from "lucide-react";

import "./Dashboard.css";

export default function InvoiceStats({ stats }){

    if(!stats){

        return null;

    }

    const cards = [

        {

            title:"Jobs",

            value:stats.job_count ?? 0,

            icon:Briefcase

        },

        {

            title:"Invoices",

            value:stats.invoice_count ?? 0,

            icon:Receipt

        },

        {

            title:"Machines Deployed",

            value:stats.machine_count ?? 0,

            icon:Truck

        },

        {

            title:"Personnel Deployed",

            value:stats.personnel_count ?? 0,

            icon:Users

        }

    ];

    return(

        <div className="dashboard-stats">

            {

                cards.map((card,index)=>{

                    const Icon = card.icon;

                    return(

                        <div

                            key={index}

                            className="dashboard-stat-card"
                        >

                            <span className="dashboard-stat-icon"><Icon size={20} strokeWidth={2.25} /></span>

                            <div className="dashboard-stat-value">

                                {card.value}

                            </div>

                            <div className="dashboard-stat-title">

                                {card.title}

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}