// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";
import { useState } from "react";

import "../components/approval/ApprovalBoard.css";

import ApprovalCard
from "../components/approval/ApprovalCard";



import { useParams } from "react-router-dom";

import {
    getApprovalBoard,
    getApprovalBoardByQuote,
    approveQuote
}
from "../services/approvalBoardService";





// ====================================
// PAGE
// ====================================

export default function ApprovalBoard(){


    const { quoteId } = useParams();

    const [approval,setApproval] = useState(null);

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
    useEffect(() => {

        if (!quoteId) {

            loadApprovalBoard();

        }

    }, [quoteId]);



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



    useEffect(() => {

        async function load(){

            const data = await getApprovalBoardByQuote(
                Number(quoteId)
            );

            setApproval(data);

        }

        load();

    },[quoteId]);



    // ====================================
    // APPROVAL PLACEHOLDER
    // ====================================

    async function handleApprove(quoteId){

        try{

            setSuccessMessage("");
            setErrorMessage("");

            await approveQuote(quoteId);

            setSuccessMessage(
                `Quote Q-${quoteId} approved successfully.`
            );

            await loadApprovalBoard();

            setTimeout(() => {

                setSuccessMessage("");

            },3000);

        }

        catch(error){

            setErrorMessage(

                error.detail || "Approval failed."

            );

            setTimeout(() => {

                setErrorMessage("");

            },3000);

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
                    quoteId ?

                    approval &&

                    <ApprovalCard
                        approval={approval}
                        onApprove={handleApprove}
                    />

                    :

                    approvals.map(

                        approval => (

                            <ApprovalCard
                                key={approval.quote_id}
                                approval={approval}
                                onApprove={handleApprove}
                            />

                        )

                    )

                }

            </div>

        </div>

    );

}