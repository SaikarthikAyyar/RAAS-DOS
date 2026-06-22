import { Outlet, NavLink } from "react-router-dom";
// no separate CSS import needed — it's in main.jsx

import { Outlet, NavLink } from "react-router-dom";

import {

LayoutDashboard,

FileText,

ClipboardList,

Settings2,

Droplets,

Receipt,

CheckCircle,

Briefcase,

Network,

Play,

Users,

BarChart2,

Bell,

User

}

from "lucide-react";

const navItems=[

{to:"/dashboard",icon:<LayoutDashboard size={17}/>,label:"Dashboard"},

{to:"/customer-request",icon:<FileText size={17}/>,label:"Customer Request"},

{to:"/sales-survey",icon:<ClipboardList size={17}/>,label:"Sales Survey"},

{to:"/ops-selector",icon:<Settings2 size={17}/>,label:"Ops Selector"},

{to:"/dewatering-gate",icon:<Droplets size={17}/>,label:"Dewatering Gate"},

{to:"/quote",icon:<Receipt size={17}/>,label:"Quote"},

{to:"/approval",icon:<CheckCircle size={17}/>,label:"Approval"},

{to:"/job-creation",icon:<Briefcase size={17}/>,label:"Job Creation"},

{to:"/allocation",icon:<Network size={17}/>,label:"Allocation"},

{to:"/execution",icon:<Play size={17}/>,label:"Execution"},

{to:"/customer-portal",icon:<Users size={17}/>,label:"Customer Portal"},

{to:"/analytics",icon:<BarChart2 size={17}/>,label:"Analytics"}

];

export default function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">RAAS<br/>DOS V1</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => "sidebar-nav-item" + (isActive ? " active" : "")}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-main">
        <div className="app-topnav">
          <span>Notifications</span>
          <span>Admin</span>
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
