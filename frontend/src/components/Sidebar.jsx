// =========================================
// IMPORTS
// =========================================

import { NavLink } from "react-router-dom";
import logo from "../assets/JTLOGO.jpeg";

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


// =========================================
// MENU CONFIGURATION
// =========================================

const menuItems = [

    {

        title: "Dashboard",

        path: "/dashboard",

        icon: <Home size={20} />

    },

    {

        title: "Customer Request",

        path: "/customer-request",

        icon: <FileText size={20} />

    },

    {

        title: "Sales Survey",

        path: "/sales-survey",

        icon: <ClipboardCheck size={20} />

    },

    {

        title: "Ops Approval",

        path: "/ops-approval",

        icon: <ClipboardList size={20} />

    },

    {

        title: "Ops Selector",

        path: "/ops-selector",

        icon: <Settings size={20} />

    },

    {

        title: "Dewatering Gate",

        path: "/dewatering-gate",

        icon: <Droplets size={20} />

    },

    {

        title: "Quote",

        path: "/quote",

        icon: <Calculator size={20} />

    },

    {

        title: "Approval",

        path: "/approval",

        icon: <CheckCircle size={20} />

    },

    {

        title: "Job Creation",

        path: "/job-creation",

        icon: <Briefcase size={20} />

    },

    {

        title: "Allocation",

        path: "/allocation",

        icon: <Truck size={20} />

    },

    {

        title: "Execution",

        path: "/execution",

        icon: <PlayCircle size={20} />

    },

    {

        title: "Customer Portal",

        path: "/customer-portal",

        icon: <UserCircle size={20} />

    },

    {

        title: "Analytics",

        path: "/analytics",

        icon: <BarChart3 size={20} />

    }

];


// =========================================
// COMPONENT
// =========================================

export default function Sidebar() {

    return (

        <aside className="sidebar">

            {/* ========================================= */}
            {/* APPLICATION LOGO */}
            {/* ========================================= */}

            <div className="logo">

                <img
                    src={logo}
                    alt="JT Logo"
                    style={{
                        maxWidth: "160px",
                        height: "auto"
                    }}
                />

            </div>


            {/* ========================================= */}
            {/* MENU ITEMS */}
            {/* ========================================= */}

            {

                menuItems.map(

                    item => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>

                                isActive

                                    ? "menu-item active"

                                    : "menu-item"

                            }

                        >

                            {item.icon}

                            <span>

                                {item.title}

                            </span>

                        </NavLink>

                    )

                )

            }

        </aside>

    );

}