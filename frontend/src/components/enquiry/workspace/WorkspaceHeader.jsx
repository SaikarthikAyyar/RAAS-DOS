// ====================================
// COMPONENT
// ====================================

export default function WorkspaceHeader({

    enquiry,
    customer

}){

    return(

        <div className="workspace-header">

            <div className="workspace-header-title">

                <h2>

                    Enquiry Workspace

                </h2>

            </div>

            <div className="workspace-header-details">

                <div>

                    <strong>Enquiry ID:</strong>

                    {" "}

                    {enquiry?.id ?? "—"}

                </div>

                <div>

                    <strong>Customer:</strong>

                    {" "}

                    {customer?.company_name ?? "—"}

                </div>

                <div>

                    <strong>Current Stage:</strong>

                    {" "}

                    {enquiry?.stage ?? "—"}

                </div>

                <div>

                    <strong>Status:</strong>

                    {" "}

                    {enquiry?.status ?? "—"}

                </div>

                <div>

                    <strong>Owner:</strong>

                    {" "}

                    {enquiry?.owner_role ?? "—"}

                </div>

                <div>

                    <strong>Created:</strong>

                    {" "}

                    {

                        enquiry?.created_at

                            ? new Date(

                                enquiry.created_at

                            ).toLocaleDateString()

                            : "—"

                    }

                </div>

            </div>

        </div>

    );

}