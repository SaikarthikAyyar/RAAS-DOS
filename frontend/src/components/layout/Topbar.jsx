import { Bell, Menu, UserCircle } from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

export default function Topbar({

    onMenuClick

}){

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    function handleLogout(){

        logout();

        navigate("/");

    }

    return(

        <div className="topbar">

            {/* Left Section */}

            <div className="topbar-left">

                <button

                    type="button"

                    className="sidebar-toggle-btn"

                    aria-label="Open menu"

                    onClick={onMenuClick}

                >

                    <Menu size={22}/>

                </button>

                <div className="user-chip">

                    <UserCircle size={20}/>

                    <span>

                        {user?.name}

                    </span>

                </div>

                <div className="user-chip">

                    {user?.role}

                </div>

                <button

                    className="logout-button-topbar"

                    onClick={handleLogout}

                >

                    Logout

                </button>

            </div>







            {/* Right Section */}

            <div className="topbar-right">

                <Bell size={20}/>

                <span>

                    Notifications

                </span>

            </div>

        </div>

    );

}