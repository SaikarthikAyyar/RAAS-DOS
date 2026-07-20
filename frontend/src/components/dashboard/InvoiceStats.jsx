import "./Dashboard.css";

export default function InvoiceStats({ stats }){

    if(!stats){

        return null;

    }

    const cards = [

        {

            title:"Jobs",

            value:stats.job_count ?? 0

        },

        {

            title:"Invoices",

            value:stats.invoice_count ?? 0

        },

        {

            title:"Machines Deployed",

            value:stats.machine_count ?? 0

        },

        {

            title:"Personnel Deployed",

            value:stats.personnel_count ?? 0

        }

    ];

    return(

        <div className="dashboard-stats">

            {

                cards.map((card,index)=>(

                    <div

                        key={index}

                        className="dashboard-stat-card"

                    >

                        <div className="dashboard-stat-value">

                            {card.value}

                        </div>

                        <div className="dashboard-stat-title">

                            {card.title}

                        </div>

                    </div>

                ))

            }

        </div>

    );

}