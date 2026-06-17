import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function Execution(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [progress,setProgress]=useState(0);

 function startExecution(){

  if(!selectedJob){

   return;

  }

  updateJob(

   Number(selectedJob),

   {

    execution:{

     progress:Number(progress),

     completed:false

    }

   }

  );

  alert("Execution updated");

 }

 return(

 <div>

  <h1>

   Execution

  </h1>

  <select

   value={selectedJob}

   onChange={

    e=>setSelectedJob(

     e.target.value

    )

   }

  >

   <option value="">

    Select Customer

   </option>

   {

    jobs

    .filter(

      job=>job.allocation.machineAssigned

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

   type="number"

   placeholder="Progress %"

   value={progress}

   onChange={

    e=>setProgress(

     e.target.value

    )

   }

  />

  <br/><br/>

  <button

   onClick={startExecution}

  >

   Update Progress

  </button>

  <button

 onClick={()=>{

  updateJob(

   Number(selectedJob),

   {

    execution:{

     progress:100,

     completed:true

    }

   }

  )

 }}

>

 Complete Job

</button>

 </div>

 )

}