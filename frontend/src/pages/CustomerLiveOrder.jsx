// ====================================
// CUSTOMER PORTAL - LIVE ORDER (READ ONLY)
// The Execution tab in read-only form, nothing more. Every field here
// is presented, never editable - no inputs, no Save/Start/Complete
// actions, no mutation calls anywhere on this page. Driven by the same
// real GET /execution endpoints the internal Execution page already
// uses, not the old, disconnected customer_live_order_service (which
// crashed on mount and read from a stale Invoice-keyed shape).
// ====================================

import { useEffect, useState } from "react";

import "../components/execution/Execution.css";

import { listExecutions, getExecution } from "../services/executionService";

import ExecutionSummary from "../components/execution/ExecutionSummary";
import ExecutionTravelReadOnly from "../components/execution/ExecutionTravelReadOnly";
import ExecutionOutputReadOnly from "../components/execution/ExecutionOutputReadOnly";


export default function CustomerLiveOrder(){

    const [executions, setExecutions] = useState([]);
    const [selectedExecutionId, setSelectedExecutionId] = useState("");
    const [execution, setExecution] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{

        listExecutions()
            .then(data=>setExecutions(data || []))
            .catch(error=>console.error(error));

    }, []);

    useEffect(()=>{

        if(!selectedExecutionId){
            setExecution(null);
            return;
        }

        setLoading(true);

        getExecution(selectedExecutionId)
            .then(data=>setExecution(data))
            .catch(error=>console.error(error))
            .finally(()=>setLoading(false));

    }, [selectedExecutionId]);

    return(

        <div className="execution-page">

            <h1 className="execution-title">
                Customer Portal - Job Progress
            </h1>

            <p style={{color:"var(--muted)", marginTop:-8, marginBottom:16, fontSize:13}}>
                A read-only view of your job's execution progress - nothing on this page can be edited.
            </p>

            <select
                className="execution-selector"
                value={selectedExecutionId}
                onChange={e=>setSelectedExecutionId(e.target.value)}
            >

                <option value="">Select Job</option>

                {executions.map(item=>(
                    <option key={item.id} value={item.id}>
                        Job {item.job_creation_id} - Execution {item.id}
                    </option>
                ))}

            </select>

            <br/>
            <br/>

            {loading && <p className="execution-map-empty">Loading...</p>}

            {!loading && selectedExecutionId && !execution && (
                <p className="execution-map-empty">No execution found for this job.</p>
            )}

            {execution && (

                <>

                    <ExecutionSummary execution={execution}/>

                    {execution.current_phase === "PHASE_1" && (
                        <ExecutionTravelReadOnly
                            execution={execution}
                            title="Phase 1 - Mobilisation"
                        />
                    )}

                    {execution.current_phase === "PHASE_2" && (
                        <ExecutionOutputReadOnly execution={execution}/>
                    )}

                    {execution.current_phase === "PHASE_3" && (
                        <ExecutionTravelReadOnly
                            execution={execution}
                            title="Phase 3 - Demobilisation"
                        />
                    )}

                </>

            )}

        </div>

    );

}
