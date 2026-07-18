import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function DewateringGate(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [gate,setGate]=useState({

   decision:"",

   method:"",

   notes:""

 });

 function saveGate(){

  updateJob(

   Number(selectedJob),

   {

    dewatering:gate,


   }

  );

  alert("Dewatering completed");

 }

 return(

 <div>

 <h1>Dewatering Gate</h1>

 <select

 value={selectedJob}

 onChange={e=>setSelectedJob(e.target.value)}

 >

 <option value="">

 Select Job

 </option>

 {

 jobs

 .filter(

 job=>job.ops.machine

 )

 .map(job=>(

 <option

 key={job.id}

 value={job.id}

 >

 {job.customer}

 </option>

 ))

 }

 </select>

 <br/><br/>

 <input

 placeholder="Decision"

 onChange={e=>

 setGate({

 ...gate,

 decision:e.target.value

 })

 }

 />

 <br/>

 <input

 placeholder="Method"

 onChange={e=>

 setGate({

 ...gate,

 method:e.target.value

 })

 }

 />

 <br/>

 <input

 placeholder="Notes"

 onChange={e=>

 setGate({

 ...gate,

 notes:e.target.value

 })

 }

 />

 <br/><br/>

 <button

 onClick={saveGate}

 >

 Save Gate

 </button>

 alert("Dewatered successfully.");

 </div>

 );

}