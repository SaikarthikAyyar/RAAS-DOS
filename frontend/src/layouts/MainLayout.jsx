// =========================================
// IMPORTS
// =========================================

import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";

import Topbar from "../components/layout/Topbar";

import "../styles/main.css";


// =========================================
// COMPONENT
// =========================================

export default function MainLayout() {

    return (

        <div className="app-container">

            {/* Left Sidebar */}

            <Sidebar />

            {/* Right Workspace */}

            <div className="content-area">

                {/* Top Header */}

                <Topbar />

                {/* Dynamic Pages */}

                <div className="page-container">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}