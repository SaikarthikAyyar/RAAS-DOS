export default function JobSelector({

 jobs,

 selectedJobId,

 setSelectedJobId

}){

 return(

 <div>

   <h3>

    Select Customer Request

   </h3>

   <select

    value={selectedJobId}

    onChange={(e)=>

      setSelectedJobId(

       Number(

        e.target.value

       )

      )

    }

   >

    <option value="">

      Select Job

    </option>

    {

      jobs.map(

       job=>(

        <option

         key={job.id}

         value={job.id}

        >

         {

          job.customer

         }

         -

         {

          job.location

         }

        </option>

       )

      )

    }

   </select>

 </div>

 )

}