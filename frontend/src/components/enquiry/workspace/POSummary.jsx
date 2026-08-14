import { useEffect, useState } from "react";

import {
    listPurchaseOrders,
    uploadPurchaseOrder,
    deletePurchaseOrder
} from "../../../services/purchaseOrderService";

import { STAGE_LABELS } from "../../../data/workflowStages";

import { useAuth } from "../../../contexts/AuthContext";

const STAGE_ORDER = Object.keys(STAGE_LABELS);

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

function formatDate(value){

    if(!value) return "-";

    return value.slice(0, 10);

}


// ====================================
// COMPONENT
// Upload requires the enquiry to have reached QUOTE_RELEASED. Every
// row is independently deletable and re-uploadable - multiple real
// POs can exist across multiple quote-release cycles, and deleting
// one never regresses the enquiry's stage (matches the backend).
// ====================================

export default function POSummary({

    enquiry,

    reload

}){

    const { user } = useAuth();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [file, setFile] = useState(null);
    const [poNumber, setPoNumber] = useState("");
    const [poValue, setPoValue] = useState("");
    const [uploading, setUploading] = useState(false);

    async function load(){

        if(!enquiry?.id){
            return;
        }

        setLoading(true);
        setError("");

        try{

            const data = await listPurchaseOrders(enquiry.id);

            setOrders(data ?? []);

        }

        catch(err){

            console.error(err);
            setError("Unable to load purchase orders.");

        }

        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{ load(); }, [enquiry?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    if(!enquiry?.id){

        return(

            <div className="survey-summary-grid">

                <div className="survey-summary-card">

                    <h3 className="survey-summary-title">Purchase Orders</h3>

                    <p className="survey-empty">Nothing to show yet.</p>

                </div>

            </div>

        );

    }

    const stageIndex = STAGE_ORDER.indexOf(enquiry.stage);
    const quoteReleasedIndex = STAGE_ORDER.indexOf("QUOTE_RELEASED");
    const canUpload = stageIndex >= quoteReleasedIndex;

    async function handleUpload(){

        if(!file){

            setError("Choose a PO file first.");
            return;

        }

        setUploading(true);
        setError("");

        try{

            await uploadPurchaseOrder(enquiry.id, {

                file,
                poNumber,
                poValue,
                uploadedBy: user?.name

            });

            setFile(null);
            setPoNumber("");
            setPoValue("");

            await load();
            reload?.();

        }

        catch(err){

            console.error(err);
            setError(err?.detail || "Unable to upload the PO.");

        }

        finally{

            setUploading(false);

        }

    }

    async function handleDelete(po){

        if(!window.confirm(`Remove PO "${po.file_name}"?`)){
            return;
        }

        try{

            await deletePurchaseOrder(po.id);

            await load();

        }

        catch(err){

            alert(err?.detail || "Unable to remove this PO.");

        }

    }

    return(

        <div className="survey-summary-grid">

            <div className="survey-summary-card" style={{gridColumn:"1 / -1"}}>

                <h3 className="survey-summary-title">
                    Purchase Orders
                    <span className="workspace-header-pill gray" style={{marginLeft:8}}>
                        Stage: {STAGE_LABELS[enquiry.stage] || enquiry.stage}
                    </span>
                </h3>

                {error && <div className="survey-empty" style={{marginTop:8}}>{error}</div>}

                {
                    loading ? (

                        <p className="survey-empty">Loading...</p>

                    ) : orders.length===0 ? (

                        <p className="survey-empty">No purchase orders uploaded yet.</p>

                    ) : (

                        <table className="ops-scoring-table">

                            <thead>
                                <tr>
                                    <th>File</th>
                                    <th>PO Number</th>
                                    <th>PO Value</th>
                                    <th>Uploaded By</th>
                                    <th>Uploaded</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    orders.map(po=>(

                                        <tr key={po.id}>
                                            <td>{po.file_name}</td>
                                            <td>{po.po_number ?? "-"}</td>
                                            <td>{inr(po.po_value)}</td>
                                            <td>{po.uploaded_by ?? "-"}</td>
                                            <td>{formatDate(po.uploaded_at)}</td>
                                            <td>

                                                <span
                                                    style={{cursor:"pointer", color:"#991b1b", fontWeight:600}}
                                                    onClick={()=>handleDelete(po)}
                                                >
                                                    Remove
                                                </span>

                                            </td>
                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    )
                }

                <h4 className="ops-subheading">Upload a PO</h4>

                {
                    canUpload ? (

                        <>

                            <div className="ops-override-form">

                                <input
                                    type="file"
                                    onChange={e=>setFile(e.target.files?.[0] || null)}
                                />

                                <input
                                    placeholder="PO Number"
                                    value={poNumber}
                                    onChange={e=>setPoNumber(e.target.value)}
                                />

                                <input
                                    type="number"
                                    placeholder="PO Value (INR)"
                                    value={poValue}
                                    onChange={e=>setPoValue(e.target.value)}
                                />

                            </div>

                            <div className="survey-actions" style={{marginTop:10}}>

                                <button
                                    className="survey-action-button survey-action-button-orange"
                                    onClick={handleUpload}
                                    disabled={uploading}
                                >
                                    {uploading ? "Uploading..." : "Upload PO"}
                                </button>

                            </div>

                        </>

                    ) : (

                        <p className="survey-empty">
                            Waiting on the quote to be released (Commercial Approval) before a PO can be uploaded.
                        </p>

                    )
                }

            </div>

        </div>

    );

}
