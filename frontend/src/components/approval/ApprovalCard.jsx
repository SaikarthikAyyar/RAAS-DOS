// ====================================
// APPROVAL CARD
// ====================================

export default function ApprovalCard({

    approval,

    onApprove

}){

    console.log(

        "\n========== APPROVAL CARD =========="

    );

    console.log(

        "Quote:",

        approval.quote_id

    );

    console.log(

        "Customer:",

        approval.customer

    );

    console.log(

        "Summary:",

        approval.summary

    );

    console.log(

        "Quote Value:",

        approval.quote_value

    );

    console.log(

        "Flag:",

        approval.flag

    );

    console.log(

        "===================================\n"

    );

    return(

        <div className="approval-card">

            <div className="approval-card-header">

                <div className="approval-title">

                    Q-{approval.quote_id}

                </div>

                <div className="approval-flag">

                    {approval.flag}

                </div>

            </div>

            <div className="approval-body">

                <div className="approval-field">

                    <span>

                        Customer

                    </span>

                    <strong>

                        {approval.customer}

                    </strong>

                </div>

                <div className="approval-field">

                    <span>

                        Techno-Commercial Summary

                    </span>

                    <strong>

                        {approval.summary}

                    </strong>

                </div>

                <div className="approval-field">

                    <span>

                        Quote Value

                    </span>

                    <strong>

                        ₹ {(approval.quote_value ?? 0).toLocaleString()}

                    </strong>

                </div>

            </div>

            <div className="approval-actions">

                <button

                    className="approval-button"

                    onClick={()=>{

                        console.log(

                            "Approve Pressed:",

                            approval.quote_id

                        );

                        onApprove(

                            approval.quote_id

                        );

                        alert("Approved successfully.");

                    }}

                >

                    Approve

                </button>

            </div>

        </div>

    );

}