import { useState, useEffect } from "react";

import {

    listExecutions,

    getExecution,

    startPhase,

    completePhase

} from "../services/executionService";


export default function Execution(){

    const [executions,setExecutions] = useState([]);

    const [selectedExecution,setSelectedExecution] = useState("");

    const [execution,setExecution] = useState(null);


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

            setExecution(response);

            alert("Phase Started");

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

            setExecution(response);

            alert("Phase Completed");

        }

        catch(error){

            console.error(error);

            alert("Failed");

        }

    }


    return(

    <div>

        <h1>

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

                        Execution {execution.id}

                    </option>

                ))

            }

        </select>

        <br/>

        <br/>

        {

            execution &&

            <div>

                <p>

                    Workflow :

                    {" "}

                    {execution.workflow_status}

                </p>

                <p>

                    Current Phase :

                    {" "}

                    {execution.current_phase}

                </p>

                <p>

                    Phase 1 :

                    {" "}

                    {execution.phase_1_status}

                </p>

                <p>

                    Phase 2 :

                    {" "}

                    {execution.phase_2_status}

                </p>

                <p>

                    Phase 3 :

                    {" "}

                    {execution.phase_3_status}

                </p>

            </div>

        }

        <br/>

        <button

            onClick={

                startCurrentPhase

            }

        >

            Start Current Phase

        </button>

        <button

            onClick={

                completeCurrentPhase

            }

        >

            Complete Current Phase

        </button>

    </div>

    );

}