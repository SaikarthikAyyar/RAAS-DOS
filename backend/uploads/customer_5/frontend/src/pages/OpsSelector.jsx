import { useWorkflow } from "../contexts/WorkflowContext";

import { useState } from "react";

export default function OpsSelector() {

  const { jobs, updateJob } = useWorkflow();

  const [selectedJob, setSelectedJob] = useState("");

  const [ops, setOps] = useState({

    machine: "",

    serviceConfig: "",

    pump: "",

    manpower: "",

    days: ""

  });

  function saveOps() {

    if (!selectedJob) {

      alert("Select a customer");

      return;

    }

    updateJob(

      Number(selectedJob),

      {

        ops: {

          ...ops

        }

      }

    );

    alert("Ops selected");

    setSelectedJob("");

    setOps({

      machine: "",

      serviceConfig: "",

      pump: "",

      manpower: "",

      days: ""

    });

  }

  return (

    <div>

      <h1>Ops Selector</h1>

      <select

        value={selectedJob}

        onChange={e => setSelectedJob(e.target.value)}

      >

        <option value="">

          Select Customer

        </option>

        {

          jobs

          .filter(

            job => job.survey.jobType

          )

          .map(job => (

            <option

              key={job.id}

              value={job.id}

            >

              {job.customer}

            </option>

          ))

        }

      </select>

      <br /><br />

      <input

        value={ops.machine}

        placeholder="Machine"

        onChange={e =>

          setOps({

            ...ops,

            machine: e.target.value

          })

        }

      />

      <br />

      <input

        value={ops.serviceConfig}

        placeholder="Service Config"

        onChange={e =>

          setOps({

            ...ops,

            serviceConfig: e.target.value

          })

        }

      />

      <br />

      <input

        value={ops.pump}

        placeholder="Pump"

        onChange={e =>

          setOps({

            ...ops,

            pump: e.target.value

          })

        }

      />

      <br />

      <input

        value={ops.manpower}

        placeholder="Manpower"

        onChange={e =>

          setOps({

            ...ops,

            manpower: e.target.value

          })

        }

      />

      <br />

      <input

        value={ops.days}

        placeholder="Days"

        onChange={e =>

          setOps({

            ...ops,

            days: e.target.value

          })

        }

      />

      <br /><br />

      <button

        onClick={saveOps}

      >

        Save Ops

      </button>

    </div>

  );

}