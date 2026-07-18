



import { useState, useEffect } from "react";

import {

    loadAllocation,

    saveAllocation as saveAllocationService

} from "../services/allocationService";



export default function Allocation(){
const [allocationData,setAllocationData]=useState(null);

 const [selectedJob,setSelectedJob]=useState("");

const [selectedMachines,setSelectedMachines]=useState([]);

const [selectedPersonnel,setSelectedPersonnel]=useState([]);

const [siteLocation,setSiteLocation]=useState("");

 useEffect(()=>{

    if(!selectedJob){

        return;

    }

    console.log("Selected Job", selectedJob);

    loadAllocation(selectedJob)

    .then(data=>{

        console.log(data);

        setAllocationData(data);

    });

    

},[selectedJob]);

async function saveAllocation(){

    if(!selectedJob){

        return;

    }

    const payload={

        machine_ids:selectedMachines,

        personnel_ids:selectedPersonnel,

        site_location:siteLocation

    };

    console.log(payload);

    try{

        const response = await saveAllocationService(

            selectedJob,

            payload

        );

        console.log("Allocation Response",response);

        alert("Allocation Complete");

    }catch(error){

        console.error(error);

        alert("Allocation Failed");

    }

}

 return(

 <div>

  <h1>

   Allocation

  </h1>

  <select

   value={selectedJob}

   onChange={

    e=>setSelectedJob(

     e.target.value

    )

   }

  >



  <option value="">Select Job</option>
  <option value="1">JOB-0001</option>
  <option value="2">JOB-0002</option>
  <option value="3">JOB-0003</option>



  </select>

  <br/><br/>



  <br/>

  {allocationData?.machines?.map(machine => (

      <div key={machine.id}>

          <input

              type="checkbox"

              onChange={(e)=>{

                  if(e.target.checked){

                      setSelectedMachines(prev=>[

                          ...prev,

                          machine.id

                      ]);

                  }else{

                      setSelectedMachines(

                          prev=>prev.filter(

                              id=>id!==machine.id

                          )

                      );

                  }

              }}

          />

          {machine.machine_name}

          {" - "}

          {machine.asset_number}

      </div>

  ))}

  <br/><br/>

  <h3>Personnel</h3>

  {allocationData?.personnel?.map(person => (

      <div key={person.id}>

          <input

              type="checkbox"

              onChange={(e)=>{

                  if(e.target.checked){

                      setSelectedPersonnel(prev=>[

                          ...prev,

                          person.id

                      ]);

                  }else{

                      setSelectedPersonnel(

                          prev=>prev.filter(

                              id=>id!==person.id

                          )

                      );

                  }

              }}

          />

          {person.name}

          {" - "}

          {person.designation}

      </div>

  ))}

  <input

      placeholder="Site Location"

      value={siteLocation}

      onChange={

          e=>setSiteLocation(

              e.target.value

          )

      }

  />

  <button

   onClick={saveAllocation}

  >

   Allocate

  </button>

  alert("Allocated successfully.");

 </div>



 )

}