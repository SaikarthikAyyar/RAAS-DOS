import { useState } from "react";

export default function SalesSurveyForm({

 selectedJob,

 onSave

}) {

 const [form,setForm]=useState({

   site:"",

   urgency:"",

   jobType:"",

   sludgeType:"",

   estimatedVolume:"",

   outputTarget:"",

   accessType:"",

   verticalLift:"",

   hoseDistance:"",

   safety:""

 });

 function handleChange(e){

   setForm({

     ...form,

     [e.target.name]:e.target.value

   });

 }

 function submit(){

   onSave(form);

 }

 return (

 <div>

   <h2>Sales Survey</h2>

   <input

     name="site"

     placeholder="Site"

     onChange={handleChange}

   />

   <input

     name="urgency"

     placeholder="Urgency"

     onChange={handleChange}

   />

   <input

     name="jobType"

     placeholder="Job Type"

     onChange={handleChange}

   />

   <input

     name="sludgeType"

     placeholder="Sludge Type"

     onChange={handleChange}

   />

   <input

     name="estimatedVolume"

     placeholder="Estimated Volume"

     onChange={handleChange}

   />

   <input

     name="outputTarget"

     placeholder="Output Target"

     onChange={handleChange}

   />

   <input

     name="accessType"

     placeholder="Access Type"

     onChange={handleChange}

   />

   <input

     name="verticalLift"

     placeholder="Vertical Lift"

     onChange={handleChange}

   />

   <input

     name="hoseDistance"

     placeholder="Hose Distance"

     onChange={handleChange}

   />

   <input

     name="safety"

     placeholder="Safety Notes"

     onChange={handleChange}

   />

   <button onClick={submit}>

     Save Survey

   </button>

 </div>

 );

}