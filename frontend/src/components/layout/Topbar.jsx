import { Bell, UserCircle } from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { ROLE_MODULES } from "../../config/navigation";

export default function Topbar(){

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    function handleLogout(){

        logout();

        navigate("/");

    }

    const menu = ROLE_MODULES[user?.role] || [];

    return(

        <div className="topbar">

            {/* Left Section */}

            <div className="topbar-left">

                <Bell size={20}/>

                <span>

                    Notifications

                </span>

            </div>





            {/* Right Section */}

            <div className="topbar-right">

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

        </div>

    );

}