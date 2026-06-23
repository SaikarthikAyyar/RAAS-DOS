import { useWorkflow } from "../contexts/WorkflowContext";

export default function Analytics() {

  const { jobs, getStage } = useWorkflow();

  const completed = jobs.filter(
    job => getStage(job) === "COMPLETED"
  ).length;

  const active = jobs.filter(
    job => getStage(job) !== "COMPLETED"
  ).length;

  const totalRevenue = jobs.reduce(
    (sum, job) => sum + job.quote.total,
    0
  );

  return (

    <div>

      <h1>Analytics</h1>

      <div
        style={{
          display: "flex",
          gap: "40px",
          marginBottom: "40px"
        }}
      >

        <div>

          <h3>Total Jobs</h3>

          <h2>{jobs.length}</h2>

        </div>

        <div>

          <h3>Active Jobs</h3>

          <h2>{active}</h2>

        </div>

        <div>

          <h3>Completed</h3>

          <h2>{completed}</h2>

        </div>

        <div>

          <h3>Revenue</h3>

          <h2>₹{totalRevenue}</h2>

        </div>

      </div>

      <h2>Job Summary</h2>

      <table>

        <thead>

          <tr>

            <th>Customer</th>

            <th>Status</th>

            <th>Quote</th>

            <th>Progress</th>

          </tr>

        </thead>

        <tbody>

          {jobs.map(job => (

            <tr key={job.id}>

              <td>{job.customer}</td>

              <td>{getStage(job)}</td>

              <td>₹{job.quote.total}</td>

              <td>{job.execution.progress}%</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}