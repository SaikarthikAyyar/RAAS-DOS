import { useState, useEffect } from "react";

import {

    loadAllocation,

    saveAllocation,

    loadInvoiceJobs

} from "../services/allocationService";

import "../components/allocation/Allocation.css";

export default function Allocation(){

    const API = import.meta.env.VITE_API_URL;


    const [jobId,setJobId] = useState("");

    const [jobs,setJobs] = useState([]);

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

        loadInvoiceJobs()

        .then(

            data=>{

                console.log(data);

                setJobs(data);

            }

        )

        .catch(console.error);

    },[]);



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

        try{

            await saveAllocation(
                jobId,
                payload
            );

            alert("Resources Allocated Successfully");

        }

        catch(error){

            console.error(error);

            alert(
                error.detail ||
                error.message ||
                "Allocation Failed"
            );

        }

    }







    return(

    <div className="allocation-page">

        <h1 className="allocation-title">
            Allocation
        </h1>

        <select

            className="job-selector"

            value={jobId}

            onChange={

                e=>setJobId(

                    Number(

                        e.target.value

                    )

                )

            }

        >

            <option value="">

                Select Job

            </option>

            {

                jobs.map(

                    job=>(

                        <option

                            key={job.job_id}

                            value={job.job_id}

                        >

                            {job.generated_job_id}

                            {" | CR-"}

                            {job.customer_request_id}

                        </option>

                    )

                )

            }

        </select>



        {

            allocation &&

            <>

            <hr/>
        <div className="allocation-card">

            <div className="summary-grid">




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
            </div>
        </div>



            {

                allocation.invoice &&

                <>

                <hr/>

            <div className="allocation-card">

                <div className="summary-grid">

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
                </div>
            </div>


                </>
            }



            <hr/>

            <h2>

                Machines

            </h2>

            <div className="resource-grid">

            {

                allocation.machines.map(machine=>



            <div
                key={machine.id}
                className="resource-card"
            >

                <label className="resource-checkbox">

                    <input
                        type="checkbox"
                        onChange={e=>{

                            if(e.target.checked){

                                setSelectedMachines(prev=>[

                                    ...prev,

                                    machine.id

                                ]);

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

                    <span className="machine-title">

                        {machine.machine_name}

                    </span>

                </label>

                <div className="resource-detail">

                    <strong>Code :</strong>

                    {machine.machine_code}

                </div>

                <div className="resource-detail">

                    <strong>Asset :</strong>

                    {machine.asset_number}

                </div>

                <div className="resource-detail">

                    <strong>Status :</strong>

                    {machine.status}

                </div>

                <div className="resource-detail">

                    <strong>Queue :</strong>

                    {machine.queue_count}

                </div>

                <div className="resource-detail">

                    <strong>Current Job :</strong>

                    {machine.current_job || "Available"}

                </div>

                <div className="resource-detail">

                    <strong>Current Site :</strong>

                    {machine.current_site || "-"}

                </div>

                {

                    machine.queue.length > 0 &&

                    <details className="queue-details">

                        <summary>

                            View Queue

                        </summary>

                        {

                            machine.queue.map(

                                item=>

                                <div

                                    key={item.queue_position}

                                    className="queue-item"

                                >

                                    <div>

                                        <strong>

                                            Position

                                        </strong>

                                        {" "}

                                        {item.queue_position}

                                    </div>

                                    <div>

                                        <strong>

                                            Job

                                        </strong>

                                        {" "}

                                        {item.generated_job_id}

                                    </div>

                                    <div>

                                        <strong>

                                            Site

                                        </strong>

                                        {" "}

                                        {item.site_location}

                                    </div>

                                    <div>

                                        <strong>

                                            Start

                                        </strong>

                                        {" "}

                                        {item.planned_start}

                                    </div>

                                    <div>

                                        <strong>

                                            Finish

                                        </strong>

                                        {" "}

                                        {item.planned_completion}

                                    </div>

                                    <div>

                                        <strong>

                                            Status

                                        </strong>

                                        {" "}

                                        {item.status}

                                    </div>

                                </div>

                            )

                        }

                    </details>

                }

            </div>

                

                )

            }

            </div>



            <hr/>

            <h2>

                Personnel

            </h2>

            <div className="resource-grid">

            {

                allocation.personnel.map(person=>

                

                <div
                    key={person.id}
                    className="resource-card"
                >

                    <label className="resource-checkbox">

                        <input

                            type="checkbox"

                            disabled={!person.documents_verified}

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

                        <span className="machine-title">

                            {person.name}

                        </span>

                    </label>

                    <div className="resource-detail">

                        <strong>Employee :</strong>

                        {person.employee_code}

                    </div>

                    <div className="resource-detail">

                        <strong>Designation :</strong>

                        {person.designation}

                    </div>

                    <div className="resource-detail">

                        <strong>Skill :</strong>

                        {person.skill}

                    </div>

                    <div className="resource-detail">

                        <strong>Location :</strong>

                        {person.location}

                    </div>

                    <div className="resource-detail">

                        <strong>Status :</strong>

                        {person.status}

                    </div>

                    <div className="resource-detail">

                        <strong>Documents :</strong>

                        {

                            person.documents_verified

                            ?

                            <span className="verified">

                                ✔ Verified

                            </span>

                            :

                            <span className="pending">

                                ✖ Pending

                            </span>

                        }

                    </div>

                    <details className="queue-details">

                        <summary>

                            View Documents

                        </summary>

                        {

                            person.documents.length === 0

                            ?

                            <div className="queue-item">

                                No documents uploaded.

                            </div>

                            :

                            person.documents.map(doc => (
                                <div key={doc.name} className="document-row">

                                    <div>{doc.name}</div>

                                    <div>{doc.type}</div>

                                    <div>{doc.status}</div>

                                    <a
                                        href={`${API}/${doc.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="document-link"
                                    >
                                        📄 View PDF
                                    </a>

                                </div>
                            ))}

                    </details>

                </div>
                

            
                )

            }
        </div>



            <hr/>

        <div className="form-group">

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
        </div>

            <div className="form-group">

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

            </div>

            <div className="form-group">

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
        </div>



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