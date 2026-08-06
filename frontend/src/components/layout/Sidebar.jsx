import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/JanyutechLogo.jpg";
import { MODULE_META } from "../../config/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({

    onNavigate

}){

    const { permissions, logout } = useAuth();

    const navigate = useNavigate();

    const menu = (permissions?.navModules || [])
        .map(path=>MODULE_META[path])
        .filter(Boolean);

    function handleLogout(){

        logout();

        navigate("/");

    }

    return(

        <div className="sidebar">

            <div className="logo">

                <img src={logo} alt="JT Logo"/>

            </div>

            <div className="sidebar-menu">

                {

                    menu.map(item=>(

                        <NavLink

                            key={item.path}

                            to={item.path}

                            onClick={onNavigate}

                            className={({isActive})=>

                                isActive

                                ?

                                "menu-item active"

                                :

                                "menu-item"

                            }

                        >

                            {item.icon}

                            <span>

                                {item.title}

                            </span>

                        </NavLink>

                    ))

                }

            </div>

            <div className="sidebar-footer">

                <button

                    className="logout-button"

                    onClick={handleLogout}

                >

                    Logout

                </button>

            </div>

        </div>

    );

}