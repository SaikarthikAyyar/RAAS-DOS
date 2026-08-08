import { NavLink } from "react-router-dom";
import { MODULE_META } from "../../config/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function Sidebar({

    onNavigate

}){

    const { permissions } = useAuth();

    // Display order is decided here, by MODULE_META's own key order -
    // not by whatever order permissions.navModules happens to come
    // back from the API in (that's just a permission check now, via
    // the Set below), so reordering the sidebar is just a matter of
    // reordering MODULE_META, regardless of role_permissions row order.
    const allowedPaths = new Set(permissions?.navModules || []);

    const menu = Object.keys(MODULE_META)
        .filter(path=>allowedPaths.has(path))
        .map(path=>MODULE_META[path]);

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