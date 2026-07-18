// ====================================
// IMPORTS
// ====================================

import { useNavigate } from "react-router-dom";

import { useState } from "react";

import useDashboard from "../hooks/useDashboard";

import CustomerSummary
from "../components/dashboard/CustomerSummary";

import SalesSummary
from "../components/dashboard/SalesSummary";

import WorkflowTracker
from "../components/dashboard/WorkflowTracker";

import {

createOpsApproval

}

from "../services/opsApprovalService";

import "../components/salesSurvey/SalesSurvey.css";


// ====================================
// PAGE
// ====================================

export default function OpsApproval(){

    const navigate = useNavigate();

    const {

        dashboard

    } = useDashboard();

    const [

        jobDoable,

        setJobDoable

    ] = useState(true);

    const [

        approvalNotes,

        setApprovalNotes

    ] = useState("");

    async function submitApproval(){

        try{

            const enquiry =

                dashboard?.selected_enquiry;

            if(!enquiry){

                alert(

                    "No enquiry selected."

                );

                return;

            }

            const payload = {

                customer_request_id:

                    enquiry.customer_request_id,

                sales_survey_id:

                    enquiry.sales_survey_id,

                job_doable:

                    jobDoable,

                approval_notes:

                    approvalNotes,

                approved_by:1

            };

            await createOpsApproval(

                payload

            );

            alert(

                "OPS Approval Saved"

            );

            navigate(

                "/dashboard"

            );

        }

        catch(error){

            console.log(error);

        }

    }

    return(

        <div className="sales-survey-page">

            <WorkflowTracker

                enquiry={

                    dashboard?.selected_enquiry

                }

            />

            <CustomerSummary

                summary={

                    dashboard?.customer_summary

                }

            />

            <SalesSummary

                summary={

                    dashboard?.selected_summary

                }

            />

            <div className="survey-card">

                <div className="survey-header">

                    <h2>

                        Operations Approval

                    </h2>

                </div>

                <div className="survey-grid">

                    <div className="survey-field">

                        <label>

                            Job Doable

                        </label>

                        <select

                            value={

                                jobDoable

                                    ? "YES"

                                    : "NO"

                            }

                            onChange={

                                event=>{

                                    setJobDoable(

                                        event.target.value==="YES"

                                    );

                                }

                            }

                        >

                            <option value="YES">

                                Doable

                            </option>

                            <option value="NO">

                                Not Doable

                            </option>

                        </select>

                    </div>

                    <div

                        className="survey-field"

                        style={{

                            gridColumn:

                            "1 / span 3"

                        }}

                    >

                        <label>

                            Approval Notes

                        </label>

                        <textarea

                            rows={5}

                            value={approvalNotes}

                            onChange={

                                event=>

                                    setApprovalNotes(

                                        event.target.value

                                    )

                            }

                        />

                    </div>

                </div>

            </div>

            <div className="survey-actions">

                <button

                    className="survey-btn save-btn"

                    onClick={submitApproval}

                >

                    Submit OPS Approval

                </button>

                alert("Ops Approved successfully.");

            </div>

        </div>

    );

}