import { Link } from "react-router-dom";

import { rolePermissions }

from "../utils/rolePermissions";

<Link to="/analytics">

 Analytics

</Link>


function Sidebar(){

 const role=

 localStorage.getItem(

  "userRole"

 )

 const modules=

 rolePermissions[role]

 ||[]


 function formatModuleName(module){

  return module

   .split("-")

   .map(

    word=>

    word.charAt(0)

    .toUpperCase()

    +

    word.slice(1)

   )

   .join(" ")

 }


 return(

  <div style={{

   width:"250px",

   height:"100vh",

   borderRight:"1px solid gray",

   padding:"20px"

  }}>

   <h2>

    RAAS DOS

   </h2>

   <hr/>

   {

    modules.map(

     module=>(

      <p key={module}>

       <Link

        to={"/"+module}

       >

        {

         formatModuleName(

          module

         )

        }

       </Link>

      </p>

     )

    )

   }

  </div>

 )

}

export default Sidebar