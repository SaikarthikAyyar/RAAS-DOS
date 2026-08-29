import { useEffect, useState } from "react";

import { getJobByEnquiry } from "../../../services/jobCreationService";

import {
    getExecutionByJob,
    getExecution,
    createExecution,
    startPhase,
    completePhase,
    updateExecutionProgress
} from "../../../services/executionService";

import { formatApiError } from "../../../utils/apiError";

import { useAuth } from "../../../contexts/AuthContext";

import ExecutionSummary from "../../execution/ExecutionSummary";
import ExecutionControls from "../../execution/ExecutionControls";
import Phase1Mobilisation from "../../execution/Phase1Mobilisation";
import Phase2Execution from "../../execution/Phase2Execution";
import Phase3Demobilisation from "../../execution/Phase3Demobilisation";

import ComponentExplainerIcon from "../../guide/ComponentExplainerIcon";

import "../../execution/Execution.css";


// ====================================
// EXECUTION / JOB TAB
// Resolves this enquiry's own job -> execution row automatically
// (same by-enquiry/by-job lookup pattern already used for Job
// Creation, Phase 33D), instead of requiring the flat picker the
// standalone /execution page uses - that page is left exactly as it
// is, this is the integrated path for working a specific enquiry.
// ====================================

export default function ExecutionWorkspaceSummary({

    enquiry,

    reload

}){

    const { hasTask } = useAuth();

    const [jobInfo, setJobInfo] = useState(null);
    const [execution, setExecution] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);

    async function load(){

        if(!enquiry?.id){
            return;
        }

        setLoading(true);
        setError("");

        try{

            const job = await getJobByEnquiry(enquiry.id);
            setJobInfo(job);

            if(job?.job_exists){

                const exec = await getExecutionByJob(job.id);
                setExecution(exec);

            }
            else{

                setExecution(null);

            }

        }
        catch(err){

            console.error(err);
            setError(formatApiError(err, "Unable to load execution."));

        }
        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        load();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enquiry?.id]);


    async function refreshExecution(executionId){

        if(!executionId){
            return;
        }

        try{

            const updated = await getExecution(executionId);
            setExecution(updated);

        }
        catch(err){

            console.error(err);

        }

    }


    async function handleCreateExecution(){

        setCreating(true);
        setError("");

        try{

            await createExecution(jobInfo.id);

            await load();

            if(reload){
                await reload();
            }

        }
        catch(err){

            setError(formatApiError(err, "Unable to create the execution."));

        }
        finally{

            setCreating(false);

        }

    }


    async function handleStartPhase(){

        try{

            await startPhase(execution.id);
            await refreshExecution(execution.id);

        }
        catch(err){

            alert(formatApiError(err, "Unable to start the phase."));

        }

    }

    async function handleCompletePhase(){

        try{

            await completePhase(execution.id);
            await refreshExecution(execution.id);

            if(reload){
                await reload();
            }

        }
        catch(err){

            alert(formatApiError(err, "Unable to complete the phase."));

        }

    }

    async function handleUpdateExecution(){

        try{

            await updateExecutionProgress(execution.id, {

                current_activity: execution.current_activity,
                remarks: execution.remarks

            });

            await refreshExecution(execution.id);

        }
        catch(err){

            alert(formatApiError(err, "Update failed."));

        }

    }


    if(loading){
        return <p className="bm-muted" style={{marginTop:12}}>Loading execution...</p>;
    }

    if(!jobInfo?.job_exists){
        return(
            <div className="execution-card">
                <p className="bm-muted">
                    Waiting on Job Creation - this tab becomes available once a job has been created for this enquiry.
                </p>
            </div>
        );
    }

    if(error && !execution){
        return <p className="bm-muted" style={{marginTop:12, color:"#991b1b"}}>{error}</p>;
    }

    if(!execution){

        return(
            <div className="execution-card" data-guide-id="execution-create" style={{position:"relative"}}>

                <ComponentExplainerIcon tabId="execution" componentId="execution-create" floating/>

                <h2 className="execution-section-title">Execution</h2>

                <p className="bm-muted">
                    No execution has been created for Job {jobInfo.id} yet.
                </p>

                {error && <p style={{color:"#991b1b"}}>{error}</p>}

                {hasTask("enquiry-tab-execution", "create_execution") && (
                    <div className="execution-actions">
                        <button
                            className="execution-btn"
                            onClick={handleCreateExecution}
                            disabled={creating}
                        >
                            {creating ? "Creating..." : "Create Execution"}
                        </button>
                    </div>
                )}

            </div>
        );

    }

    return(

        <div>

            <ExecutionSummary execution={execution}/>

            {execution.current_phase === "PHASE_1" && (
                <Phase1Mobilisation execution={execution} refreshExecution={refreshExecution}/>
            )}

            {execution.current_phase === "PHASE_2" && (
                <Phase2Execution execution={execution} refreshExecution={refreshExecution}/>
            )}

            {execution.current_phase === "PHASE_3" && (
                <Phase3Demobilisation execution={execution} refreshExecution={refreshExecution}/>
            )}

            <ExecutionControls
                execution={execution}
                startCurrentPhase={handleStartPhase}
                completeCurrentPhase={handleCompletePhase}
                updateExecution={handleUpdateExecution}
            />

        </div>

    );

}
