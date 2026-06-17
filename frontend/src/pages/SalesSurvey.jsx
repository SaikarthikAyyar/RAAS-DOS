import { useWorkflow } from "../contexts/WorkflowContext";
import { useState } from "react";

export default function SalesSurvey() {

  const { jobs, updateJob } = useWorkflow();

  const [selectedJob, setSelectedJob] = useState("");

  const [survey, setSurvey] = useState({

    jobType: "",

    sludgeType: "",

    volume: "",

    outputTarget: "",

    accessType: "",

    verticalLift: "",

    hoseDistance: "",

    safety: ""

  });

  function saveSurvey() {

    if (!selectedJob) {

      alert("Select a customer");

      return;

    }

    updateJob(

      Number(selectedJob),

      {

        survey: {

          ...survey,

          completed: true

        }

      }

    );

    alert("Survey saved");

    setSelectedJob("");

    setSurvey({

      jobType: "",

      sludgeType: "",

      volume: "",

      outputTarget: "",

      accessType: "",

      verticalLift: "",

      hoseDistance: "",

      safety: ""

    });

  }

  return (

    <div>

      <h1>Sales Survey</h1>

      <select

        value={selectedJob}

        onChange={e => setSelectedJob(e.target.value)}

      >

        <option value="">

          Select Customer

        </option>

        {

          jobs.map(job => (

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

        value={survey.jobType}

        placeholder="Job Type"

        onChange={e =>

          setSurvey({

            ...survey,

            jobType: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.sludgeType}

        placeholder="Sludge Type"

        onChange={e =>

          setSurvey({

            ...survey,

            sludgeType: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.volume}

        placeholder="Volume"

        onChange={e =>

          setSurvey({

            ...survey,

            volume: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.outputTarget}

        placeholder="Output Target"

        onChange={e =>

          setSurvey({

            ...survey,

            outputTarget: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.accessType}

        placeholder="Access Type"

        onChange={e =>

          setSurvey({

            ...survey,

            accessType: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.verticalLift}

        placeholder="Vertical Lift"

        onChange={e =>

          setSurvey({

            ...survey,

            verticalLift: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.hoseDistance}

        placeholder="Hose Distance"

        onChange={e =>

          setSurvey({

            ...survey,

            hoseDistance: e.target.value

          })

        }

      />

      <br />

      <input

        value={survey.safety}

        placeholder="Safety Notes"

        onChange={e =>

          setSurvey({

            ...survey,

            safety: e.target.value

          })

        }

      />

      <br /><br />

      <button

        onClick={saveSurvey}

      >

        Save Survey

      </button>

    </div>

  );

}