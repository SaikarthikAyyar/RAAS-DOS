import logo from "../assets/JTLOGO.png";

function Header(){

 return(

   <div style={{

      display:"flex",

      justifyContent:"space-between",

      padding:"20px",

      borderBottom:"1px solid gray",

      alignItems: "center"

   }}>

     <img src={logo} alt="JT Logo" style={{ height: 40 }} />

     <div>

       🔔 Notifications

       &nbsp;&nbsp;&nbsp;

       👤 Admin

     </div>

   </div>

 )

}

export default Header