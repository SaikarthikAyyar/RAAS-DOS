import logo from "../assets/JanyutechLogo.jpg";

function Header(){

 return(

   <div style={{

      display:"flex",

      justifyContent:"space-between",

      padding:"20px",

      borderBottom:"1px solid gray",

      alignItems: "center"

   }}>

     <img src={logo} alt="JT Logo" style={{ height: 100 }} />

     <div>

       🔔 Notifications

       &nbsp;&nbsp;&nbsp;

       👤 Admin

     </div>

   </div>

 )

}

export default Header