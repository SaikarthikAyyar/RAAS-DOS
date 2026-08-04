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

        { navModules:[], workspaceTabs:[] }

    );

    async function loadPermissions(role){

        if(!role){
            setPermissions({ navModules:[], workspaceTabs:[] });
            return;
        }

        const response = await getRolePermissions(role);

        setPermissions({

            navModules: (response.nav_modules || []).map(m=>m.module_key),

            workspaceTabs: (response.workspace_tabs || []).map(m=>m.module_key)

        });

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

        await loadPermissions(loggedUser.role);

        return loggedUser;

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
