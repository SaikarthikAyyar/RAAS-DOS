import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function Approval(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [approvedBy,setApprovedBy]=useState("");

 function approve(){

  if(!selectedJob){

   return;

  }

  updateJob(

   Number(selectedJob),

   {

    approval:{

     approved:true,

     approvedBy

    }

   }

  );

  alert("Approved");

 }

 return(

 <div>

  <h1>

   Approval

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

     job=>job.quote.total

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

   placeholder="Approved By"

   value={approvedBy}

   onChange={

    e=>setApprovedBy(

     e.target.value

    )

   }

  />

  <br/><br/>

  <button

   onClick={approve}

  >

   Approve Quote

  </button>

 </div>

 )

}