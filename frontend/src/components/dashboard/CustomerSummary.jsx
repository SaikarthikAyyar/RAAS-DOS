// ====================================
// IMPORTS
// ====================================

import "./Dashboard.css";


// ====================================
// COMPONENT
// ====================================

export default function CustomerSummary({

    summary

}){

    console.log(

        "\n========== CUSTOMER SUMMARY COMPONENT =========="

    );

    console.log(

        summary

    );

    console.log(

        "===============================================\n"

    );

    if(

        !summary

    ){

        return(

            <div className="dashboard-summary-card">

                <h3>

                    Customer Information

                </h3>

                <p>

                    No customer selected.

                </p>

            </div>

        );

    }

    return(

        <div className="dashboard-summary-card">

            <div className="dashboard-summary-header">

                <h3>

                    Customer Information

                </h3>

            </div>

            <div className="dashboard-summary-grid">

                <div className="dashboard-summary-item">

                    <span>

                        Customer ID

                    </span>

                    <strong>

                        CR-

                        {summary.customer_request_id}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Company

                    </span>

                    <strong>

                        {summary.company_name}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Contact

                    </span>

                    <strong>

                        {summary.contact_person}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Phone

                    </span>

                    <strong>

                        {summary.contact_number}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Plant

                    </span>

                    <strong>

                        {summary.plant_site_location}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        City

                    </span>

                    <strong>

                        {summary.nearest_city_hub}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Requirement

                    </span>

                    <strong>

                        {summary.service_requirement}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Urgency

                    </span>

                    <strong>

                        {summary.urgency}

                    </strong>

                </div>

                <div className="dashboard-summary-item">

                    <span>

                        Workflow

                    </span>

                    <strong>

                        {summary.status}

                    </strong>

                </div>

            </div>

        </div>

    );

}