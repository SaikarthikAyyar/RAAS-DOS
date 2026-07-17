// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";


// ====================================
// COMPONENT
// ====================================

export default function EnquirySummary({

    enquiry

}){

    if(!enquiry){

        return(

            <div className="dashboard-summary-card">

                <h3>

                    Enquiry Information

                </h3>

                <p>

                    No enquiry selected.

                </p>

            </div>

        );

    }

    return(

        <div className="dashboard-summary-card">

            <div className="dashboard-summary-header">

                <h3>

                    Enquiry Information

                </h3>

            </div>

            <table className="dashboard-enquiry-table">

                <thead>

                    <tr>

                        <th>Enquiry</th>

                        <th>Customer</th>

                        <th>Sender</th>

                        <th>Receiver</th>

                        <th>Task</th>

                        <th>Module</th>

                        <th>Status</th>

                        <th>Created</th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td>

                            ENQ-{enquiry.id}

                        </td>

                        <td>

                            CR-{enquiry.customer_request_id}

                        </td>

                        <td>

                            {enquiry.sender_role}

                        </td>

                        <td>

                            {enquiry.receiver_role}

                        </td>

                        <td>

                            {enquiry.requested_task}

                        </td>

                        <td>

                            {enquiry.current_module}

                        </td>

                        <td>

                            {enquiry.workflow_status}

                        </td>

                        <td>

                            {

                                enquiry.created_at
                                    ? new Date(

                                        enquiry.created_at

                                    ).toLocaleString()

                                    : "-"

                            }

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    );

}