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

        { navModules:[], workspaceTabs:[], landingPage:null }

    );

    async function loadPermissions(role){

        if(!role){
            setPermissions({ navModules:[], workspaceTabs:[], landingPage:null });
            return null;
        }

        const response = await getRolePermissions(role);

        setPermissions({

            navModules: (response.nav_modules || []).map(m=>m.module_key),

            workspaceTabs: (response.workspace_tabs || []).map(m=>m.module_key),

            landingPage: response.landing_page || null

        });

        return response.landing_page || null;

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

            { navModules:[], workspaceTabs:[] }

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
