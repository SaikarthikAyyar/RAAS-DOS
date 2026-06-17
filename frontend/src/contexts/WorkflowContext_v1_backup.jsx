import { getWorkflowStage }

from "../utils/workflowEngine";

import { createContext, useContext, useState } from "react";

export const WorkflowContext = createContext();



export function WorkflowProvider({ children }) {

  const [jobs, setJobs] = useState([]);

  function addJob(job) {

  const newJob = {

    id: Date.now(),

    customer: job.customer,

    contact: job.contact,

    phone: job.phone,

    location: job.location,

    status: "REQUESTED",

    createdAt: new Date().toLocaleDateString(),

    survey: {

      completed:false,

      jobType:"",

      sludgeType:"",

      volume:"",

      outputTarget:"",

      accessType:"",

      verticalLift:"",

      hoseDistance:"",

      safety:"",

      pumpInputs:{},

      dewateringInputs:{}

    },

    recommendations: {

 machine:"",

 pump:"",

 dewateringMethod:"",

 estimatedQuote:0

},

    ops:{

      machine:"",

      serviceConfig:"",

      pump:"",

      manpower:"",

      days:""

    },

    dewatering:{

      decision:"",

      method:"",

      notes:""

    },

    quote:{

      cleaningCost:0,

      dewateringCost:0,

      total:0

    },

    approval:{

      approved:false,

      approvedBy:""

    },
    jobCreation:{

    created:false,

    jobNumber:"",

    startDate:""

    },

    allocation:{

      machineAssigned:"",

      teamAssigned:[]

    },

    execution:{

      progress:0,

      completed:false

    }

  };

  setJobs(prev => [

    ...prev,

    newJob

  ]);

}

  function updateJob(id, updates) {

 setJobs(prev =>

  prev.map(job =>

   job.id === id

   ? {

      ...job,

      ...updates

     }

   : job

  )

 );

}

  return (

    <WorkflowContext.Provider

      value={{

        jobs,

        addJob,

        updateJob,

        getStage:getWorkflowStage

      }}

    >

      {children}

    </WorkflowContext.Provider>

  );

}

export function useWorkflow() {

  return useContext(WorkflowContext);

}