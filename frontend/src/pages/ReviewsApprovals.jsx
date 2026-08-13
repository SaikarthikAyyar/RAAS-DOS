import { useState, useEffect, useCallback } from "react";

import { useNavigate } from "react-router-dom";

import "../components/businessMasters/BusinessMasters.css";

import {
    getOpsReviewQueue,
    getTechnoQueue,
    getQuoteCommercialQueue,
    getCommercialQueue
} from "../services/reviewsService";


// ====================================
// GATE DEFINITIONS
// ====================================

const GATES = [

    {
        key: "ops-review",
        label: "Ops Review",
        loader: getOpsReviewQueue,
        ownerLabel: "Ops owner",
        metricLabel: "Aging",
        workspaceTab: "ops-review"
    },

    {
        key: "techno-commercial",
        label: "Techno-Commercial",
        loader: getTechnoQueue,
        ownerLabel: "Approver",
        metricLabel: "Range",
        workspaceTab: "techno-commercial-approval"
    },

    {
        key: "quote-commercial",
        label: "Quote & Commercial",
        loader: getQuoteCommercialQueue,
        ownerLabel: "Owner",
        metricLabel: "Status",
        workspaceTab: "quote-commercial"
    },

    {
        key: "commercial-approval",
        label: "Commercial Approval",
        loader: getCommercialQueue,
        ownerLabel: "Owner",
        metricLabel: "Range",
        workspaceTab: "commercial-approval"
    }

];


// ====================================
// PAGE
// ====================================

export default function ReviewsApprovals(){

    const navigate = useNavigate();

    const [activeGate, setActiveGate] = useState("ops-review");

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const gate = GATES.find(g=>g.key===activeGate);

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await gate.loader();

            setRows(data ?? []);

        }

        catch(err){

            console.error(err);
            setError("Unable to load this queue.");

        }

        finally{

            setLoading(false);

        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeGate]);

    useEffect(()=>{ load(); }, [load]);

    function handleReview(enquiryId){

        navigate(

            `/enquiries/workspace/${enquiryId}`,

            { state: { initialTab: gate.workspaceTab } }

        );

    }

    return(

        <div className="bm-module">

            <div className="bm-title">

                <div>

                    <h1>Reviews &amp; approvals</h1>
                    <p>Every case currently pending a decision at Ops Review, Techno-Commercial, Quote &amp; Commercial, or Commercial Approval.</p>

                </div>

            </div>

            <div className="bm-tabs">

                {

                    GATES.map(g=>(

                        <button

                            key={g.key}

                            className={activeGate===g.key ? "active" : ""}

                            onClick={()=>setActiveGate(g.key)}

                        >

                            {g.label} ({activeGate===g.key ? rows.length : ""})

                        </button>

                    ))

                }

            </div>

            <div className="bm-card">

                <h3>{gate.label} queue</h3>

                {

                    loading ? (

                        <p className="bm-muted">Loading...</p>

                    ) : error ? (

                        <p className="bm-muted">{error}</p>

                    ) : rows.length===0 ? (

                        <p className="bm-muted">Nothing pending.</p>

                    ) : (

                        <table>

                            <thead>

                                <tr>

                                    <th>Enquiry</th>
                                    <th>Customer</th>
                                    <th>Hub</th>
                                    <th>{gate.ownerLabel}</th>
                                    <th>{gate.metricLabel}</th>
                                    <th></th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    rows.map(row=>(

                                        <tr key={row.enquiry_id}>

                                            <td>#{row.enquiry_id}</td>
                                            <td>{row.customer_name || "—"}</td>
                                            <td>{row.hub || "—"}</td>
                                            <td>{row.owner || "—"}</td>
                                            <td>{row.metric || "—"}</td>

                                            <td>

                                                <button

                                                    className="bm-backlink"

                                                    onClick={()=>handleReview(row.enquiry_id)}

                                                >

                                                    Review &rarr;

                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    )

                }

            </div>

        </div>

    );

}
