import { useEffect, useState } from "react";

import {
    listPurchaseOrders,
    uploadPurchaseOrder,
    deletePurchaseOrder
} from "../../../services/purchaseOrderService";

import { advanceStageAtLeast } from "../../../services/enquiryWorkspaceService";

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
// Upload requires the enquiry to have reached QUOTE_RELEASED, and only
// while no PO is already on file - only one PO can be accepted at a
// time (matches the backend). PO Number/Value are server-computed from
// real enquiry/quote data, never typed here. Removing the on-file PO
// re-enables the upload form; deleting never regresses stage.
// ====================================

export default function POSummary({

    enquiry,

    reload

}){

    const { user, hasTask } = useAuth();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [proceeding, setProceeding] = useState(false);

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
    const poReceivedIndex = STAGE_ORDER.indexOf("PO_RECEIVED");
    const jobCreationIndex = STAGE_ORDER.indexOf("JOB_CREATION");
    const canUpload = stageIndex >= quoteReleasedIndex;
    const canProceedToJobCreation = stageIndex >= poReceivedIndex && stageIndex < jobCreationIndex && orders.length > 0;

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
                uploadedBy: user?.name

            });

            setFile(null);

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

    async function handleProceed(){

        if(!window.confirm("Proceed to Job Creation? This advances the enquiry's stage.")){
            return;
        }

        setProceeding(true);

        try{

            await advanceStageAtLeast(enquiry.id, "JOB_CREATION");

            reload?.();

        }

        catch(err){

            alert(err?.detail || "Unable to proceed to Job Creation.");

        }

        finally{

            setProceeding(false);

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

                                                {hasTask("enquiry-tab-po", "remove_po") && (
                                                    <span
                                                        style={{cursor:"pointer", color:"#991b1b", fontWeight:600}}
                                                        onClick={()=>handleDelete(po)}
                                                    >
                                                        Remove
                                                    </span>
                                                )}

                                            </td>
                                        </tr>

                                    ))
                                }

                            </tbody>

                        </table>

                    )
                }

                {
                    !canUpload ? (

                        <>
                            <h4 className="ops-subheading">Upload a PO</h4>

                            <p className="survey-empty">
                                Waiting on the quote to be released (Commercial Approval) before a PO can be uploaded.
                            </p>
                        </>

                    ) : orders.length > 0 ? (

                        <p className="survey-empty" style={{marginTop:8}}>
                            A PO is already on file. Remove it to upload a replacement.
                        </p>

                    ) : (

                        <>

                            <h4 className="ops-subheading">Upload a PO</h4>

                            <div className="ops-override-form">

                                <input
                                    type="file"
                                    onChange={e=>setFile(e.target.files?.[0] || null)}
                                />

                            </div>

                            <div className="survey-actions" style={{marginTop:10}}>

                                {hasTask("enquiry-tab-po", "upload_po") && (
                                    <button
                                        className="survey-action-button survey-action-button-orange"
                                        onClick={handleUpload}
                                        disabled={uploading}
                                    >
                                        {uploading ? "Uploading..." : "Upload PO"}
                                    </button>
                                )}

                            </div>

                        </>

                    )
                }

                {
                    canProceedToJobCreation && hasTask("enquiry-tab-po", "proceed_to_job_creation") && (

                        <div className="survey-actions" style={{marginTop:16}}>

                            <button
                                className="survey-action-button survey-action-button-orange"
                                onClick={handleProceed}
                                disabled={proceeding}
                            >
                                {proceeding ? "Proceeding..." : "Proceed to Job Creation"}
                            </button>

                        </div>

                    )
                }

            </div>

        </div>

    );

}
