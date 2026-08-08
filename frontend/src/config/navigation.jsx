// ====================================
// IMPORTS
// ====================================

import{

Home,

ShieldCheck,

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

BarChart3,

FolderOpen,

Users

}

from "lucide-react";


// ====================================
// MODULE METADATA (title + icon per nav path)
// Which paths a role actually sees is decided dynamically by
// GET /roles/{role}/permissions (backend/repositories/
// role_permissions_repository.py) - this is just the display
// metadata (title/icon) for whichever paths that returns, keyed by
// the same module_key/path used there.
// ====================================

export const MODULE_META = {

"/dashboard":          {title:"Dashboard",path:"/dashboard",icon:<Home size={18}/>},
"/administration":     {title:"Administration",path:"/administration",icon:<ShieldCheck size={18}/>},
"/business-master":    {title:"Business Masters",path:"/business-master",icon:<Users size={18}/>},
"/enquiry":            {title:"Enquiries",path:"/enquiry",icon:<FolderOpen size={18}/>},
"/quotes":             {title:"Quotes",path:"/quotes",icon:<FileText size={18}/>},
"/customer-request":   {title:"Customer Request",path:"/customer-request",icon:<FileText size={18}/>},
"/sales-survey":       {title:"Sales Survey",path:"/sales-survey",icon:<ClipboardCheck size={18}/>},
"/ops-approval":       {title:"Ops Approval",path:"/ops-approval",icon:<ClipboardList size={18}/>},
"/ops-selector":       {title:"Ops Selector",path:"/ops-selector",icon:<Settings size={18}/>},
"/dewatering-gate":    {title:"Dewatering Gate",path:"/dewatering-gate",icon:<Droplets size={18}/>},
"/quote":              {title:"Quote",path:"/quote",icon:<Calculator size={18}/>},
"/approval":           {title:"Approval",path:"/approval",icon:<CheckCircle size={18}/>},
"/job-creation":       {title:"Job Creation",path:"/job-creation",icon:<Briefcase size={18}/>},
"/allocation":         {title:"Allocation",path:"/allocation",icon:<Truck size={18}/>},
"/execution":          {title:"Execution",path:"/execution",icon:<PlayCircle size={18}/>},
"/customer-portal":    {title:"Customer Portal",path:"/customer-portal",icon:<UserCircle size={18}/>},
"/analytics":          {title:"Analytics",path:"/analytics",icon:<BarChart3 size={18}/>}

};
