import { useState, useEffect } from "react";

import {

    loadAllocation,

    saveAllocation

} from "../services/allocationService";

export default function Allocation(){

    const [jobId,setJobId] = useState("");

    const [allocation,setAllocation] = useState(null);

    const [selectedMachines,setSelectedMachines] = useState([]);

    const [selectedPersonnel,setSelectedPersonnel] = useState([]);

    const [siteLocation,setSiteLocation] = useState("");

    const [plannedStart, setPlannedStart] = useState("");

    const [plannedCompletion, setPlannedCompletion] = useState("");

    const payload = {

        machine_ids: selectedMachines,

        personnel_ids: selectedPersonnel,

        site_location: siteLocation,

        planned_start: plannedStart,

        planned_completion: plannedCompletion

    };



    useEffect(()=>{

        if(!jobId){

            return;

        }

        loadAllocation(jobId)

        .then(data=>{

            console.log(data);

            setAllocation(data);

        });

    },[jobId]);



    async function allocate(){


        if(!jobId){

            alert("Select Job");

            return;

        }

        await saveAllocation(

            jobId,

            payload

        );

        alert("Resources Allocated Successfully");

    }



    return(

    <div className="allocationPage">

        <h1>

            Allocation

        </h1>

        <input

            placeholder="Job ID"

            value={jobId}

            onChange={

                e=>setJobId(

                    e.target.value

                )

            }

        />



        {

            allocation &&

            <>

            <hr/>

            <h2>

                Job Summary

            </h2>

            <p>

                Job :

                {allocation.job.generated_job_id}

            </p>

            <p>

                Planned Start :

                {allocation.job.planned_start}

            </p>

            <p>

                Planned Completion :

                {allocation.job.planned_completion}

            </p>

            <p>

                Workflow :

                {allocation.job.workflow_status}

            </p>



            {

                allocation.invoice &&

                <>

                <hr/>

                <h2>

                    Invoice Status

                </h2>

                <p>

                    Phase :

                    {allocation.invoice.phase}

                </p>

                <p>

                    Progress :

                    {allocation.invoice.progress}%

                </p>

                <p>

                    Customer Status :

                    {allocation.invoice.customer_status}

                </p>

                </>
            }



            <hr/>

            <h2>

                Machines

            </h2>

            {

                allocation.machines.map(machine=>

                    <div key={machine.id}>

                        <input

                            type="checkbox"

                            onChange={e=>{

                                if(e.target.checked){

                                    setSelectedMachines(

                                        prev=>[

                                            ...prev,

                                            machine.id

                                        ]

                                    );

                                }

                                else{

                                    setSelectedMachines(

                                        prev=>

                                        prev.filter(

                                            id=>id!==machine.id

                                        )

                                    );

                                }

                            }}

                        />

                        {machine.machine_name}

                        {" | "}

                        {machine.machine_code}

                        {" | "}

                        {machine.asset_number}

                        {" | Queue : "}

                        {machine.queue_count}

                    </div>

                )

            }



            <hr/>

            <h2>

                Personnel

            </h2>

            {

                allocation.personnel.map(person=>

                    <div key={person.id}>

                        <input

                            type="checkbox"

                            onChange={e=>{

                                if(e.target.checked){

                                    setSelectedPersonnel(

                                        prev=>[

                                            ...prev,

                                            person.id

                                        ]

                                    );

                                }

                                else{

                                    setSelectedPersonnel(

                                        prev=>

                                        prev.filter(

                                            id=>id!==person.id

                                        )

                                    );

                                }

                            }}

                        />

                        {person.name}

                        {" | "}

                        {person.designation}

                        {" | "}

                        {person.skill}

                    </div>

                )

            }



            <hr/>

            <h3>

            Planned Start

            </h3>

            <input

                type="date"

                value={plannedStart}

                onChange={

                    e=>setPlannedStart(

                        e.target.value

                    )

                }

            />

            <h3>

            Planned Completion

            </h3>

            <input

                type="date"

                value={plannedCompletion}

                onChange={

                    e=>setPlannedCompletion(

                        e.target.value

                    )

                }

            />

            <h3>

            Site Location

            </h3>

            <input

                placeholder="Site Location"

                value={siteLocation}

                onChange={

                    e=>setSiteLocation(

                        e.target.value

                    )

                }

            />



            <br/>

            <br/>



            <button

                onClick={allocate}

            >

                Allocate Resources

            </button>

            </>

        }

    </div>

    );

}