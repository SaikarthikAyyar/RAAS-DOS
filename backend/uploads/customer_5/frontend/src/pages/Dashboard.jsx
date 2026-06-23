import { useWorkflow }

from "../contexts/WorkflowContext";

import JobTable

from "../components/tables/JobTable";

function Dashboard(){

const { jobs, getStage } = useWorkflow();

 const role=

 localStorage.getItem(

  "userRole"

 )


const surveyPending =

jobs.filter(

job=>!job.survey.jobType

).length;

const quoteReady =

jobs.filter(

job=>job.dewatering.decision

).length;



const approvalPending=

jobs.filter(

 job=>job.quote.total

).length

const allocated=

jobs.filter(

 job=>job.allocation.machineAssigned

).length;

const executing=

jobs.filter(

 job=>

 job.execution.progress>0

).length

 return(

  <div>

   <h1>

    Dashboard

   </h1>


   <h3>

    Logged in as:

    {role}

   </h3>


   <br/>


   <div style={{

    display:"flex",

    gap:"30px"

   }}>

    <div>

      <h3>

       Customer Requests

      </h3>

      <h2>

       {jobs.length}

      </h2>

    </div>


    <div>

      <h3>

       Survey Pending

      </h3>

      <h2>

       {surveyPending}

      </h2>

    </div>


    <div>

      <h3>

       Quote Ready

      </h3>

      <h2>

       {quoteReady}

      </h2>

    </div>

    <div>

        <h3>

            Allocated

        </h3>

    <h2>

        {allocated}

    </h2>

    </div>

    <div>

      <h3>

       Executing

      </h3>

      <h2>

       {executing}

      </h2>

    </div>



   </div>
<h2>

Workflow Jobs

</h2>


<JobTable jobs={jobs}/>

  </div>

 )

}


export default Dashboard