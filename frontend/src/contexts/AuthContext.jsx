// ====================================
// IMPORTS
// ====================================

import {

    createContext,

    useContext,

    useState

}

from "react";

import {

    loginUser

}

from "../services/authService";


// ====================================
// CONTEXT
// ====================================

const AuthContext = createContext();


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

        null

    );


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

        return loggedUser;

    }


    function logout(){

        setUser(

            null

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