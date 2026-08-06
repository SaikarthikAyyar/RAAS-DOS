// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";


// ====================================
// COMPONENT
// Sidebar is a permanent column on desktop. Below the mobile
// breakpoint (see layout.css), it becomes an off-canvas drawer
// controlled by this open/close state - toggled from the Topbar's
// menu button, closed by tapping the backdrop or navigating.
// ====================================

export default function MainLayout(){

    const [sidebarOpen, setSidebarOpen] = useState(false);

    function closeSidebar(){
        setSidebarOpen(false);
    }

    function toggleSidebar(){
        setSidebarOpen(previous=>!previous);
    }

    return(

        <div className="app-shell">

            <aside
                className={
                    sidebarOpen
                        ? "app-sidebar app-sidebar-open"
                        : "app-sidebar"
                }
            >

                <Sidebar onNavigate={closeSidebar}/>

            </aside>

            {
                sidebarOpen && (
                    <div
                        className="sidebar-backdrop"
                        onClick={closeSidebar}
                    />
                )
            }

            <div className="app-main">

                <Topbar onMenuClick={toggleSidebar}/>

                <div className="app-content">

                    <Outlet/>

                </div>

            </div>

        </div>

    );

}