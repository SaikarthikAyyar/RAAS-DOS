export function getWorkflowStage(job){

 if(job.execution.completed){

  return "COMPLETED";

 }

 if(job.execution.progress>0){

  return "EXECUTING";

 }

 if(job.allocation.machineAssigned){

  return "ALLOCATED";

 }

 if(job.approval.approved){

  return "APPROVED";

 }

 if(job.quote.total>0){

  return "QUOTED";

 }

 if(job.dewatering.decision){

  return "DEWATERING";

 }

 if(job.ops.machine){

  return "OPS";

 }

 if(job.survey.jobType){

  return "SURVEY";

 }

 return "REQUESTED";

}