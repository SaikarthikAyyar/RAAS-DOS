// ====================================
// STAGE LABELS
// ====================================

const STAGE_LABELS = {

    CUSTOMER_REQUEST: "Customer Request",
    SALES_SURVEY: "Sales Survey",
    OPS_REVIEW: "Ops Review",
    QUOTE_COMMERCIAL_REVIEW: "Quote & Commercial",
    COMMERCIAL_APPROVAL: "Commercial Approval",
    QUOTE_RELEASED: "Quote Released",
    PO_RECEIVED: "PO Received",
    JOB_CREATION: "Job Creation",
    EXECUTION: "Execution",
    COMPLETED: "Completed"

};


// ====================================
// COMPONENT
// ====================================

export default function WorkspaceHeader({

    enquiry,
    customer

}){

    const stageLabel = STAGE_LABELS[enquiry?.stage] ?? enquiry?.stage ?? "-";

    let pillClass = "blue";
    let pillText = stageLabel;

    if(enquiry?.status === "LOST"){
        pillClass = "red";
        pillText = "Lost";
    } else if(enquiry?.status === "ARCHIVED"){
        pillClass = "gray";
        pillText = "Archived";
    }

    const subtitleParts = [

        customer?.plant_site_location,

        customer?.nearest_city_hub
            ? `Hub: ${customer.nearest_city_hub}`
            : null,

        enquiry?.owner_role
            ? `Owner: ${enquiry.owner_role}`
            : null,

        enquiry?.created_at
            ? `Created ${new Date(enquiry.created_at).toLocaleDateString()}`
            : null

    ].filter(Boolean);

    return(

        <div className="workspace-header">

            <div className="workspace-header-title">

                <h2>

                    {enquiry?.id ? `Enquiry #${enquiry.id}` : "Enquiry Workspace"}
                    {" - "}
                    {customer?.company_name ?? "-"}

                </h2>

                <p className="workspace-header-subtitle">

                    {

                        subtitleParts.length
                            ? subtitleParts.join(" · ")
                            : "No customer details available."

                    }

                </p>

            </div>

            <span className={`workspace-header-pill ${pillClass}`}>

                {pillText}

            </span>

        </div>

    );

}
