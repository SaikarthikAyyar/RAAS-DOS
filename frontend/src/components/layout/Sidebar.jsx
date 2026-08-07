import { NavLink } from "react-router-dom";
import { MODULE_META } from "../../config/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({

    onNavigate

}){

    const { permissions } = useAuth();

    const menu = (permissions?.navModules || [])
        .map(path=>MODULE_META[path])
        .filter(Boolean);

    return(

        <div className="sidebar">

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

        </div>

    );

}