// ====================================
// IMPORTS
// ====================================

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";


// ====================================
// COMPONENT
// ====================================

export default function MainLayout(){

    return(

        <div className="app-shell">

            <aside className="app-sidebar">

                <Sidebar/>

            </aside>

            <div className="app-main">

                <Topbar/>

                <div className="app-content">

                    <Outlet/>

                </div>

            </div>

        </div>

    );

}