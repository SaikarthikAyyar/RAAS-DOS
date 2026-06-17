import { NavLink } from "react-router-dom";

import {

Home,

FileText,

Users,

ClipboardCheck,

Settings,

Droplets,

Calculator,

CheckCircle,

Briefcase,

Truck,

PlayCircle,

UserCircle,

BarChart3

}

from "lucide-react";

export default function Sidebar(){

 const menu=[

 {

 title:"Dashboard",

 path:"/dashboard",

 icon:<Home size={18}/>

 },

 {

 title:"Customer Request",

 path:"/customer-request",

 icon:<FileText size={18}/>

 },

 {

 title:"Sales Survey",

 path:"/sales-survey",

 icon:<ClipboardCheck size={18}/>

 },

 {

 title:"Ops Selector",

 path:"/ops-selector",

 icon:<Settings size={18}/>

 },

 {

 title:"Dewatering Gate",

 path:"/dewatering-gate",

 icon:<Droplets size={18}/>

 },

 {

 title:"Quote",

 path:"/quote",

 icon:<Calculator size={18}/>

 },

 {

 title:"Approval",

 path:"/approval",

 icon:<CheckCircle size={18}/>

 },

 {

 title:"Job Creation",

 path:"/job-creation",

 icon:<Briefcase size={18}/>

 },

 {

 title:"Allocation",

 path:"/allocation",

 icon:<Truck size={18}/>

 },

 {

 title:"Execution",

 path:"/execution",

 icon:<PlayCircle size={18}/>

 },

 {

 title:"Customer Portal",

 path:"/customer-portal",

 icon:<UserCircle size={18}/>

 },

 {

 title:"Analytics",

 path:"/analytics",

 icon:<BarChart3 size={18}/>

 }

 ];

 return(

 <div className="sidebar">

 <div className="logo">

 RAAS DOS V1

 </div>

 {

 menu.map(item=>(

 <NavLink

 key={item.path}

 to={item.path}

 className="menu-item"

 >

 {item.icon}

 <span>

 {item.title}

 </span>

 </NavLink>

 ))

 }

 </div>

 )

}