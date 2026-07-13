// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";
import { useState } from "react";

import "../components/approval/ApprovalBoard.css";

import ApprovalCard
from "../components/approval/ApprovalCard";

import{

    getApprovalBoard,

    approveQuote

}
from "../services/approvalBoardService";


// ====================================
// PAGE
// ====================================

export default function ApprovalBoard(){

    // ====================================
    // STATE
    // ====================================

    const [

        approvals,

        setApprovals

    ] = useState(

        []

    );



    // ====================================
    // LOAD
    // ====================================

    useEffect(()=>{

        loadApprovalBoard();

    },[]);



    async function loadApprovalBoard(){

        console.log(

            "\n========== APPROVAL BOARD =========="

        );

        console.log(

            "Loading Approval Queue..."

        );

        try{

            const data =

                await getApprovalBoard();

            console.log(

                "Approval Records:",

                data

            );

            console.log(

                "Total Quotes:",

                data.length

            );

            setApprovals(

                data

            );

        }

        catch(error){

            console.error(

                "Approval Board Load Failed:",

                error

            );

        }

        console.log(

            "====================================\n"

        );

    }



    // ====================================
    // APPROVAL PLACEHOLDER
    // ====================================

    async function handleApprove(

        quoteId

    ){

        try{

            console.log(

                "\n========== APPROVAL =========="

            );

            console.log(

                "Approving:",

                quoteId

            );

            await approveQuote(

                quoteId

            );

            console.log(

                "Reloading Approval Board..."

            );

            await loadApprovalBoard();

            console.log(

                "==============================\n"

            );

        }

        catch(

            exception

        ){

            console.log(

                exception

            );

        }

    }



    // ====================================
    // UI
    // ====================================

    return(

        <div className="approval-page">

            <div className="approval-header">

                <h1>

                    Approval Board

                </h1>

                <p>

                    Review and approve completed techno-commercial quotations.

                </p>

            </div>

            <div className="approval-list">

                {

                    approvals.map(

                        approval=>(

                            <ApprovalCard

                                key={

                                    approval.quote_id

                                }

                                approval={

                                    approval

                                }

                                onApprove={

                                    handleApprove

                                }

                            />

                        )

                    )

                }

            </div>

        </div>

    );

}