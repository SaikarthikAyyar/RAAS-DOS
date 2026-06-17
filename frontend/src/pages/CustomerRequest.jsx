import CustomerRequestForm from "../components/forms/CustomerRequestForm";

import { useWorkflow } from "../contexts/WorkflowContext";

function CustomerRequest() {

  const { addJob } = useWorkflow();

  function submit(data) {

    const newJob = {

      id: Date.now(),

      customer: data.customer,

      contact: data.contact,

      phone: data.phone,

      location: data.location,

      survey: null,

      ops: null,

      quote: null,

      approval: null,

      allocation: null,

      execution: null,

      status: "REQUESTED"

    };

    addJob(newJob);

    alert("Request created");

  }

  return (

    <>

      <h1>Customer Request</h1>

      <CustomerRequestForm onSubmit={submit} />

    </>

  );

}

export default CustomerRequest;