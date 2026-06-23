import { useWorkflow }

from "../contexts/WorkflowContext";

export default function CustomerPortal(){

 const { jobs,getStage }

 = useWorkflow();

 return(

 <div>

  <h1>

   Customer Portal

  </h1>

  {

   jobs.map(job=>(

   <div

    key={job.id}

    style={{

     border:"1px solid gray",

     margin:"20px",

     padding:"20px"

    }}

   >

    <h2>

     {job.customer}

    </h2>

    <p>

     Location:

     {job.location}

    </p>

    <p>

     Status:

     {getStage(job)}

    </p>

    <p>

     Progress:

     {job.execution.progress}%

    </p>

    <p>

     Machine:

     {job.allocation.machineAssigned}

    </p>

    <p>

     Quote:

     ₹{job.quote.total}

    </p>

   </div>

   ))

  }

 </div>

 )

}