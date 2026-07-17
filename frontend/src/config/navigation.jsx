// ====================================
// IMPORTS
// ====================================

import {

Home,

FileText,

ClipboardCheck,

ClipboardList,

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


// ====================================
// ROLE BASED NAVIGATION
// ====================================

export const ROLE_MODULES={

admin:[

{title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},

{title:"Customer Request",path:"/customer-request",icon:<FileText size={18}/>},

{title:"Sales Survey",path:"/sales-survey",icon:<ClipboardCheck size={18}/>},

{title:"Ops Approval",path:"/ops-approval",icon:<ClipboardList size={18}/>},

{title:"Ops Selector",path:"/ops-selector",icon:<Settings size={18}/>},

{title:"Dewatering Gate",path:"/dewatering-gate",icon:<Droplets size={18}/>},

{title:"Quote",path:"/quote",icon:<Calculator size={18}/>},

{title:"Approval",path:"/approval",icon:<CheckCircle size={18}/>},

{title:"Job Creation",path:"/job-creation",icon:<Briefcase size={18}/>},

{title:"Allocation",path:"/allocation",icon:<Truck size={18}/>},

{title:"Execution",path:"/execution",icon:<PlayCircle size={18}/>},

{title:"Customer Portal",path:"/customer-portal",icon:<UserCircle size={18}/>},

{title:"Analytics",path:"/analytics",icon:<BarChart3 size={18}/>}

],

customer:[

{title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},

{title:"Customer Request",path:"/customer-request",icon:<FileText size={18}/>},

{title:"Customer Portal",path:"/customer-portal",icon:<UserCircle size={18}/>}

],

sales:[

{title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},

{title:"Sales Survey",path:"/sales-survey",icon:<ClipboardCheck size={18}/>},

{title:"Quote",path:"/quote",icon:<Calculator size={18}/>}

],

ops:[

{title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},

{title:"Ops Approval",path:"/ops-approval",icon:<ClipboardList size={18}/>},

{title:"Ops Selector",path:"/ops-selector",icon:<Settings size={18}/>},

{title:"Dewatering Gate",path:"/dewatering-gate",icon:<Droplets size={18}/>},

{title:"Job Creation",path:"/job-creation",icon:<Briefcase size={18}/>},

{title:"Allocation",path:"/allocation",icon:<Truck size={18}/>},

{title:"Execution",path:"/execution",icon:<PlayCircle size={18}/>}

],

management:[

{title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},

{title:"Approval",path:"/approval",icon:<CheckCircle size={18}/>}

]

};