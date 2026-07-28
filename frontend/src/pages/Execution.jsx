import { useState, useEffect } from "react";

import {

    listExecutions,

    getExecution,

    startPhase,

    completePhase,

    updateExecutionProgress

}

from "../services/executionService";


import ExecutionSummary from "../components/execution/ExecutionSummary";

import ExecutionControls from "../components/execution/ExecutionControls";

import Phase1Mobilisation from "../components/execution/Phase1Mobilisation";

import Phase2Execution from "../components/execution/Phase2Execution";

import Phase3Demobilisation from "../components/execution/Phase3Demobilisation";


export default function Execution(){

    const [executions,setExecutions] = useState([]);

    const [selectedExecution,setSelectedExecution] = useState("");

    const [execution,setExecution] = useState(null);

    // ====================================
    // REFRESH EXECUTION
    // ====================================

    async function refreshExecution(executionId){

        if(!executionId){

            return;

        }

        try{

            const updated = await getExecution(executionId);

            console.log("Execution Refreshed", updated);

            setExecution(updated);

        }

        catch(error){

            console.error(error);

        }

    }

    const executionCompleted =

        execution?.workflow_status ===

        "EXECUTION_COMPLETED";


    // ====================================
    // LOAD EXECUTION LIST
    // ====================================

    useEffect(()=>{

        listExecutions()

        .then(data=>{

            console.log("Execution List",data);

            setExecutions(data);

        })

        .catch(error=>{

            console.error(error);

        });

    },[]);


    // ====================================
    // LOAD SELECTED EXECUTION
    // ====================================

    useEffect(()=>{

        if(!selectedExecution){

            return;

        }

        console.log(

            "Selected Execution",

            selectedExecution

        );

        getExecution(selectedExecution)

        .then(data=>{

            console.log(

                "Execution Loaded",

                data

            );

            setExecution(data);

        })

        .catch(error=>{

            console.error(error);

        });

    },[selectedExecution]);


    // ====================================
    // START PHASE
    // ====================================

    async function startCurrentPhase(){

        if(!selectedExecution){

            return;

        }

        try{

            const response = await startPhase(

                selectedExecution

            );

            console.log(

                "Start Phase Response",

                response

            );

            alert("Phase Started");

            const updated = await getExecution(selectedExecution);

            setExecution(updated);

        }

        catch(error){

            console.error(error);

            alert("Failed");

        }

    }


    // ====================================
    // COMPLETE PHASE
    // ====================================

    async function completeCurrentPhase(){

        if(!selectedExecution){

            return;

        }

        try{

            const response = await completePhase(

                selectedExecution

            );

            console.log(

                "Complete Phase Response",

                response

            );

            alert("Phase Completed");

            await refreshExecution(

                selectedExecution

            );

        }

        catch(error){

            console.error(error);

            alert("Failed");

        }

    }

    // ====================================
    // UPDATE EXECUTION
    // ====================================

    async function updateExecution(){

        if(!selectedExecution){

            return;

        }

        try{

            await updateExecutionProgress(

                selectedExecution,

                {

                    current_activity:

                        execution.current_activity,

                    transport_status:

                        execution.transport_status,

                    remarks:

                        execution.remarks

                }

            );

            await refreshExecution(

                selectedExecution

            );

            alert(

                "Execution Updated"

            );

        }

        catch(error){

            console.error(

                error

            );

            alert(

                "Update Failed"

            );

        }

    }


    return(

    <div>

        <h1 style={{ color: "#ffffff" }}>

            Execution

        </h1>

        <select

            value={selectedExecution}

            onChange={

                e=>setSelectedExecution(

                    e.target.value

                )

            }

        >

            <option value="">

                Select Execution

            </option>

            {

                executions.map(execution=>(

                    <option

                        key={execution.id}

                        value={execution.id}

                    >

                        Execution {execution.id} | Job {execution.job_creation_id}

                    </option>

                ))

            }

        </select>

        <br/>

        <br/>

        <ExecutionSummary

            execution={execution}

        />

        {

            execution?.current_phase === "PHASE_1" && (

                <Phase1Mobilisation

                    execution={execution}

                    refreshExecution={refreshExecution}

                />

            )

        }

        {

            execution?.current_phase === "PHASE_2" && (

                <Phase2Execution

                    execution={execution}

                    refreshExecution={refreshExecution}

                />

            )

        }

        {

            execution?.current_phase === "PHASE_3" && (

                <Phase3Demobilisation

                    execution={execution}

                    refreshExecution={refreshExecution}

                />

            )

        }



        {execution && (

        <div
            style={{
                width:"100%",
                height:"18px",
                background:"#444",
                borderRadius:"4px",
                overflow:"hidden"
            }}
        >

            <div
                style={{
                    width:`${execution.execution_progress}%`,
                    height:"100%",
                    background:"#4caf50"
                }}
            />

        </div>

        )}

        <br/>


        <ExecutionControls

            execution={execution}

            startCurrentPhase={startCurrentPhase}

            completeCurrentPhase={completeCurrentPhase}

            updateExecution={updateExecution}

        />

    </div>

    );

}