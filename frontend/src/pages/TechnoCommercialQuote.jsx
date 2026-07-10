// ====================================
// IMPORTS
// ====================================

// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useState } from "react";

import "../components/quote/TechnoCommercialQuote.css";

import TechnicalSummaryCard
from "../components/quote/TechnicalSummaryCard";

import CommercialEstimateCard
from "../components/quote/CommercialEstimateCard";

import {

getQuoteOps,

getQuote

}

from "../services/technoCommercialQuoteService";


// ====================================
// TECHNO COMMERCIAL QUOTE
// ====================================

export default function TechnoCommercialQuote() {

    // ====================================
    // STATE DECLARATIONS
    // ====================================

    const [opsList,setOpsList]=useState([]);

    const [selectedOps,setSelectedOps]=useState("");

    const [quote,setQuote]=useState(null);

    // ====================================
    // LOAD OPS LIST
    // ====================================

    useEffect(()=>{

    loadOpsList();

    },[]);


    async function loadOpsList(){

    const data=

    await getQuoteOps();

    setOpsList(

    data

    );

    }


    // ====================================
    // LOAD QUOTE
    // ====================================

    async function loadQuote(

    opsSelectionId

    ){

    if(

    !opsSelectionId

    ){

    setQuote(

    null

    );

    return;

    }

    const data=

    await getQuote(

    opsSelectionId

    );

    setQuote(

    data

    );

    }







    // ====================================
    // SUBMIT APPROVAL
    // ====================================

    function handleSubmitApproval(){

        console.log(

            "Submit Approval"

        );

    }


    // ====================================
    // UI
    // ====================================

    return(

        <div className="quote-page">

            <div className="quote-header">

                <h1>

                    Techno-Commercial Quote

                </h1>

                <p>

                    Machine, pump, method and commercial estimate
                    generated from the OPS Selection.

                </p>

            </div>

            <div className="quote-selector-bar">

            <select

            className="quote-ops-select"

            value={selectedOps}

            onChange={

            async(e)=>{

            const id=

            e.target.value;

            setSelectedOps(

            id

            );

            await loadQuote(

            id

            );

            }

            }

            >

            <option value="">

            Select OPS Selection

            </option>

            {

            opsList.map(

            ops=>(

            <option

            key={ops.id}

            value={ops.id}

            >

            {ops.label}

            </option>

            )

            )

            }

            </select>

            </div>


            <div className="quote-grid">

                {

                quote &&

                <>

                <TechnicalSummaryCard

                quote={quote}

                />

                <CommercialEstimateCard

                quote={quote}

                onSubmitApproval={

                handleSubmitApproval

                }

                />

                </>

                }

            </div>


            

        </div>

    );

}