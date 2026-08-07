import { useEffect, useRef, useState } from "react";

import { Bell, Menu, UserCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import logo from "../../assets/JanyutechLogo.jpg";

export default function Topbar({

    onMenuClick

}){

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    function handleLogout(){

        logout();

        navigate("/");

    }

    // Close the profile dropdown on any click outside it.
    useEffect(()=>{

        function handleOutsideClick(event){

            if(
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ){
                setProfileOpen(false);
            }

        }

        document.addEventListener("mousedown", handleOutsideClick);

        return ()=>{
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, []);

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

                <img
                    src={logo}
                    alt="Janyutech"
                    className="topbar-logo"
                />

            </div>


            {/* Right Section */}

            <div className="topbar-right">

                <button
                    type="button"
                    className="topbar-icon-btn"
                    aria-label="Notifications"
                >

                    <Bell size={20}/>

                </button>

                <div className="profile-menu" ref={profileRef}>

                    <button
                        type="button"
                        className="topbar-icon-btn"
                        aria-label="Profile"
                        onClick={()=>setProfileOpen(open=>!open)}
                    >

                        <UserCircle size={22}/>

                    </button>

                    {

                        profileOpen && (

                            <div className="profile-dropdown">

                                <div className="profile-dropdown-name">

                                    {user?.name}

                                </div>

                                <div className="profile-dropdown-role">

                                    {user?.role}

                                </div>

                                <button

                                    className="profile-dropdown-logout"

                                    onClick={handleLogout}

                                >

                                    Logout

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

    );

}
