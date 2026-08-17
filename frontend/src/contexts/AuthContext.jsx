// ====================================
// IMPORTS
// ====================================

import {

    createContext,

    useContext,

    useState,

    useEffect

}

from "react";

import {

    loginUser

}

from "../services/authService";

import {

    getRolePermissions

}

from "../services/rolePermissionsService";


// ====================================
// CONTEXT
// ====================================

const AuthContext = createContext();


// ====================================
// REHYDRATE FROM LOCALSTORAGE
// Without this, user (and therefore user.role) is null after any
// page reload despite the localStorage keys still being set - a
// pre-existing bug that becomes load-bearing now that the sidebar/
// workspace tabs depend on user.role to fetch permissions.
// ====================================

function readStoredUser(){

    const id = localStorage.getItem("userId");

    if(!id){
        return null;
    }

    return {

        id,

        role: localStorage.getItem("userRole"),

        name: localStorage.getItem("userName"),

        email: localStorage.getItem("userEmail")

    };

}


// ====================================
// PROVIDER
// ====================================

export function AuthProvider({

    children

}){

    const [

        user,

        setUser

    ] = useState(

        readStoredUser

    );

    const [

        permissions,

        setPermissions

    ] = useState(

        { navModules:[], workspaceTabs:[], businessMasterTabs:[], tasks:{}, landingPage:null, loaded:false }

    );

    async function loadPermissions(role){

        if(!role){
            setPermissions({ navModules:[], workspaceTabs:[], businessMasterTabs:[], tasks:{}, landingPage:null, loaded:false });
            return null;
        }

        const response = await getRolePermissions(role);

        setPermissions({

            navModules: (response.nav_modules || []).map(m=>m.module_key),

            workspaceTabs: (response.workspace_tabs || []).map(m=>m.module_key),

            businessMasterTabs: (response.business_master_tabs || []).map(m=>m.module_key),

            // Phase 21E: module_key -> allowed task_key[], drives
            // per-button gating across Business Masters + Enquiry
            // Workspace tabs. Approve/Reject/Accept/Send-back-style
            // buttons are never in here - those stay governed by each
            // hub's approval standing (Phase 21C), untouched by this.
            tasks: response.tasks || {},

            landingPage: response.landing_page || null,

            loaded: true

        });

        return response.landing_page || null;

    }

    // Phase 21E: true when permissions haven't loaded yet (fail-open,
    // same accommodation WorkflowTabs.jsx already relies on for
    // workspaceTabs - avoids a flash of every button disappearing
    // during the brief window before the permissions fetch resolves),
    // or when the loaded task list for this tab explicitly includes
    // taskKey. A tab with zero task rows after loading (e.g. an
    // unbuilt placeholder tab) correctly denies every task.
    function hasTask(moduleKey, taskKey){

        if(!permissions.loaded){
            return true;
        }

        return (permissions.tasks[moduleKey] || []).includes(taskKey);

    }

    // Rehydrate permissions on mount if a user was already stored.
    useEffect(()=>{

        if(user?.role){
            loadPermissions(user.role);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    async function login(

        email,

        password

    ){

        const loggedUser = await loginUser(

            email,

            password

        );

        setUser(

            loggedUser

        );

        // ====================================
        // STORE SESSION
        // ====================================

        localStorage.setItem(

            "userId",

            loggedUser.id

        );

        localStorage.setItem(

            "userRole",

            loggedUser.role

        );

        localStorage.setItem(

            "userName",

            loggedUser.name

        );

        localStorage.setItem(

            "userEmail",

            loggedUser.email

        );

        const landingPage = await loadPermissions(loggedUser.role);

        // Surfaced directly on the return value (not just via context
        // state) so the caller can navigate immediately without waiting
        // on a re-render to see the freshly-loaded permissions.
        return { ...loggedUser, landingPage };

    }


    function logout(){

        setUser(

            null

        );

        setPermissions(

            { navModules:[], workspaceTabs:[], businessMasterTabs:[], tasks:{}, landingPage:null, loaded:false }

        );

        localStorage.removeItem(

            "userId"

        );

        localStorage.removeItem(

            "userRole"

        );

        localStorage.removeItem(

            "userName"

        );

        localStorage.removeItem(

            "userEmail"

        );

    }


    return(

        <AuthContext.Provider

            value={{

                user,

                permissions,

                hasTask,

                login,

                logout

            }}

        >

            {

                children

            }

        </AuthContext.Provider>

    );

}


// ====================================
// HOOK
// ====================================

export function useAuth(){

    return useContext(

        AuthContext

    );

}
