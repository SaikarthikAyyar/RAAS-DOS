import { useWorkflow }

from "../../contexts/WorkflowContext";

export default function JobTable({

 jobs

}){

const {

 getStage

}=useWorkflow();

return(

<table>

<thead>

<tr>

<th>

Customer

</th>

<th>

Location

</th>

<th>

Status

</th>

<th>

Progress

</th>

</tr>

</thead>

<tbody>

{

jobs.map(job=>(

<tr

key={job.id}

>

<td>

{job.customer}

</td>

<td>

{job.location}

</td>

<td>

{getStage(job)}

</td>

<td>

{job.execution.progress}%

</td>

</tr>

))

}

</tbody>

</table>

)

}