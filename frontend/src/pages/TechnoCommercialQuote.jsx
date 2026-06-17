import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function TechnoCommercialQuote(){

 const { jobs, updateJob } = useWorkflow();

 const [selectedJob,setSelectedJob]=useState("");

 const [quote,setQuote]=useState({

  cleaningCost:0,

  dewateringCost:0

 });

 function saveQuote(){

  if(!selectedJob) return;

  const total=

  Number(quote.cleaningCost)+

  Number(quote.dewateringCost);

  updateJob(

   Number(selectedJob),

   {

    quote:{

     ...quote,

     total

    }

   }

  );

  alert("Quote generated");

 }

 return(

 <div>

  <h1>

   Techno Commercial Quote

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

      job=>job.dewatering.decision

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

   placeholder="Cleaning Cost"

   onChange={

    e=>setQuote({

    ...quote,

    cleaningCost:e.target.value

   })

   }

  />

  <br/>

  <input

   type="number"

   placeholder="Dewatering Cost"

   onChange={

    e=>setQuote({

    ...quote,

    dewateringCost:e.target.value

   })

   }

  />

  <br/><br/>

  <button

   onClick={saveQuote}

  >

   Generate Quote

  </button>

 </div>

 )

}