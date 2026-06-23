import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function Allocation(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [allocation,setAllocation]=useState({

  machineAssigned:"",

  teamAssigned:""

 });

 function saveAllocation(){

  if(!selectedJob){

   return;

  }

  updateJob(

   Number(selectedJob),

   {

    allocation:{

     machineAssigned:allocation.machineAssigned,

     teamAssigned:[allocation.teamAssigned]

    }

   }

  );

  alert("Resources allocated");

 }

 return(

 <div>

  <h1>

   Allocation

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

      job=>job.jobCreation?.created

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

   placeholder="Machine"

   onChange={

    e=>setAllocation({

     ...allocation,

     machineAssigned:e.target.value

    })

   }

  />

  <br/>

  <input

   placeholder="Team"

   onChange={

    e=>setAllocation({

     ...allocation,

     teamAssigned:e.target.value

    })

   }

  />

  <br/><br/>

  <button

   onClick={saveAllocation}

  >

   Allocate

  </button>

 </div>

 )

}