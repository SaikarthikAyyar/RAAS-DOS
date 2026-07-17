import { Bell, UserCircle } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

export default function Topbar(){

    const { user } = useAuth();

    return(

        <div className="topbar">

            <div className="topbar-left">

                <Bell size={20}/>

                <span>

                    Notifications

                </span>

            </div>

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

            </div>

        </div>

    );

}