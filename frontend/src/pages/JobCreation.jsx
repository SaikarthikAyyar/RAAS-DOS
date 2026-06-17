import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function JobCreation(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [jobData,setJobData]=useState({

  jobNumber:"",

  startDate:""

 });

 function createJob(){

  if(!selectedJob){

   return;

  }

  updateJob(

   Number(selectedJob),

   {

    jobCreation:{

     ...jobData,

     created:true

    }

   }

  );

  alert("Job created");

 }

 return(

 <div>

  <h1>

   Job Creation

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

      job=>job.approval.approved

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

   placeholder="Job Number"

   onChange={

    e=>setJobData({

    ...jobData,

    jobNumber:e.target.value

   })

   }

  />

  <br/>

  <input

   type="date"

   onChange={

    e=>setJobData({

    ...jobData,

    startDate:e.target.value

   })

   }

  />

  <br/><br/>

  <button

   onClick={createJob}

  >

   Create Job

  </button>

 </div>

 )

}