import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

import "../styles/main.css";

export default function MainLayout(){

 return(

 <div className="app-container">

 <Sidebar/>

 <div className="content-area">

 <Topbar/>

 <div className="page-container">

 <Outlet/>

 </div>

 </div>

 </div>

 )

}