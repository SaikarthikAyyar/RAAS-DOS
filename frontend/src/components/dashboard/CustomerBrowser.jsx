// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";

// ====================================
// COMPONENT
// ====================================

export default function CustomerBrowser({

    enquiries = [],

    customers = [],

    selectedCustomerId,

    setSelectedCustomerId

}){

    const items = enquiries.length > 0

        ? enquiries

        : customers;

    if(items.length === 0){

        return(

            <div className="dashboard-placeholder">

                No pending work.

            </div>

        );

    }

    return(

        <div className="dashboard-workqueue">

            {

                items.map((item)=>{

                    const id =

                        item.enquiry_id ??

                        item.id;

                    const title =

                        item.company_name ??

                        `Customer Request ${id}`;

                    const status =

                        item.workflow_status ??

                        item.status ??

                        "-";

                    const task =

                        item.requested_task ??

                        "Customer Request";

                    return(

                        <div

                            key={id}

                            className={

                                id===selectedCustomerId

                                ?

                                "dashboard-work-item active"

                                :

                                "dashboard-work-item"

                            }

                            onClick={()=>{

                                setSelectedCustomerId(id);

                            }}

                        >

                            <div className="dashboard-work-header">

                                <strong>

                                    {

                                        item.enquiry_id

                                        ?

                                        `ENQ-${id}`

                                        :

                                        `CR-${id}`

                                    }

                                </strong>

                            </div>

                            <div className="dashboard-work-body">

                                <div>

                                    {title}

                                </div>

                                <div>

                                    {task}

                                </div>

                            </div>

                            <div className="dashboard-work-footer">

                                {status}

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}