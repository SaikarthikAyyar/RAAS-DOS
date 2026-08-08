// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import "../components/jobCreation/JobCreation.css";

import useJobCreation from "../hooks/useJobCreation";

import JobCreationCard from "../components/jobCreation/JobCreationCard";

import { saveJobCreation } from "../services/jobCreationService";


// ====================================
// PAGE
// ====================================

export default function JobCreation(){

    const{

        jobData,

        loading,

        error,

        approvedQuotes,

        selectedQuote,

        handleQuoteChange

    } = useJobCreation();

    const [saving, setSaving] = useState(false);

    async function handleCreateJob(formValues){

        const selected = approvedQuotes.find(
            q => q.quote_id === selectedQuote
        );

        if(!selected){
            alert("Select a quote first.");
            return;
        }

        setSaving(true);

        try{

            await saveJobCreation({

                approval_board_id: selected.approval_board_id,
                planned_start: formValues.planned_start,
                customer_visible_status: formValues.customer_visible_status,
                approved_service_configuration: jobData.recommended?.service_configuration,
                approved_machine: jobData.recommended?.recommended_machine,
                approved_pump_package: jobData.recommended?.pump_hose_package

            });

            await handleQuoteChange(selectedQuote);

        }

        catch(err){

            alert(
                err?.detail ||
                err?.message ||
                "Failed to create job."
            );

        }

        finally{

            setSaving(false);

        }

    }

    if(loading){

        return(
            <div className="job-page">
                <p className="job-muted">Loading Job Creation...</p>
            </div>
        );

    }

    if(error){

        return(
            <div className="job-page">
                <p className="job-muted">Failed to load Job Creation.</p>
            </div>
        );

    }

    return(

        <div className="job-page">

            <div className="job-page-header">

                <h1>Job Creation</h1>

                <p>

                    Confirm the assignment recommended by Ops and
                    create the job once the quote has been management
                    approved.

                </p>

            </div>

            <div className="job-selector-bar">

                <label>PO / Quote Reference</label>

                <select

                    value={selectedQuote || ""}

                    onChange={e=>handleQuoteChange(Number(e.target.value))}

                >

                    {
                        approvedQuotes.map(quote=>(

                            <option key={quote.quote_id} value={quote.quote_id}>
                                {quote.quote_reference} | {quote.customer}
                            </option>

                        ))
                    }

                </select>

            </div>

            {
                approvedQuotes.length === 0 ? (

                    <div className="job-card">
                        <p className="job-muted">
                            No management-approved quotes yet - a job
                            can be created once one is available.
                        </p>
                    </div>

                ) : (

                    <JobCreationCard

                        jobExists={jobData.job_exists}
                        header={jobData.header}
                        recommended={jobData.recommended}
                        onCreateJob={handleCreateJob}
                        saving={saving}

                    />

                )
            }

        </div>

    );

}
