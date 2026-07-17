import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/JTLOGO.jpeg";
import { ROLE_MODULES } from "../../config/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar(){

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const menu = ROLE_MODULES[user?.role] || [];

    function handleLogout(){

        logout();

        navigate("/");

    }

    return(

        <div className="sidebar">

            <div className="logo">

                <img src={logo} alt="JT Logo"/>

            </div>

            <div>

                {

                    menu.map(item=>(

                        <NavLink

                            key={item.path}

                            to={item.path}

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