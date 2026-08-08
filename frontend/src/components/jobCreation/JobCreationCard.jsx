import { useEffect, useState } from "react";

const CUSTOMER_STATUS_OPTIONS = [

    "Scheduled",
    "Mobilising",
    "Executing",
    "Completed"

];


// ====================================
// COMPONENT
// Single stage-gated card, matching the wireframe's jobCreatedTab -
// a read-only "Confirmed" summary once a job exists for this quote,
// otherwise an editable assignment form with one "Create Job" action.
// ====================================

export default function JobCreationCard({

    jobExists,

    header,

    recommended,

    onCreateJob,

    saving

}){

    const [plannedStart, setPlannedStart] = useState(header?.planned_start || "");

    const [customerStatus, setCustomerStatus] = useState(header?.customer_status || "Scheduled");

    useEffect(()=>{

        setPlannedStart(header?.planned_start || "");
        setCustomerStatus(header?.customer_status || "Scheduled");

    }, [header]);

    if(jobExists){

        return(

            <div className="job-card">

                <div className="job-card-header">

                    <h2>

                        Job Created

                        <span className="job-pill job-pill-green">

                            Confirmed

                        </span>

                    </h2>

                </div>

                <div className="job-field-row">
                    <span>Job ID</span>
                    <b>{header?.job_id || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Machine</span>
                    <b>{recommended?.recommended_machine || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Service Configuration</span>
                    <b>{recommended?.service_configuration || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Pump Package</span>
                    <b>{recommended?.pump_hose_package || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Dewatering Method</span>
                    <b>{recommended?.dewatering_method || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Planned Start</span>
                    <b>{header?.planned_start || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Planned Completion</span>
                    <b>{header?.planned_completion || "-"}</b>
                </div>

                <div className="job-field-row">
                    <span>Customer Visible Status</span>
                    <b>{header?.customer_status || "-"}</b>
                </div>

            </div>

        );

    }

    return(

        <div className="job-card">

            <div className="job-card-header">

                <h2>

                    Job Created

                    <span className="job-pill job-pill-amber">

                        Awaiting assignment
                    </span>

                </h2>

            </div>

            <p className="job-muted">

                Confirm the planned start date and customer-visible
                status, then create the job against the recommended
                allocation below.

            </p>

            <div className="job-formgrid">

                <div className="job-field">

                    <label>Planned Start</label>

                    <input

                        type="date"

                        value={plannedStart}

                        onChange={e=>setPlannedStart(e.target.value)}

                    />

                </div>

                <div className="job-field">

                    <label>Customer Visible Status</label>

                    <select

                        value={customerStatus}

                        onChange={e=>setCustomerStatus(e.target.value)}

                    >

                        {
                            CUSTOMER_STATUS_OPTIONS.map(option=>(

                                <option key={option} value={option}>
                                    {option}
                                </option>

                            ))
                        }

                    </select>

                </div>

            </div>

            <h4 className="job-subheading">

                Recommended Allocation

            </h4>

            <div className="job-field-row">
                <span>Service Configuration</span>
                <b>{recommended?.service_configuration || "-"}</b>
            </div>

            <div className="job-field-row">
                <span>Machine</span>
                <b>{recommended?.recommended_machine || "-"}</b>
            </div>

            <div className="job-field-row">
                <span>Pump Package</span>
                <b>{recommended?.pump_hose_package || "-"}</b>
            </div>

            <div className="job-field-row">
                <span>Dewatering Method</span>
                <b>{recommended?.dewatering_method || "-"}</b>
            </div>

            <button

                className="job-primary-btn"

                disabled={saving}

                onClick={()=>onCreateJob({

                    planned_start: plannedStart || null,
                    customer_visible_status: customerStatus

                })}

            >

                {saving ? "Creating..." : "Create Job — confirm assignment"}

            </button>

        </div>

    );

}
