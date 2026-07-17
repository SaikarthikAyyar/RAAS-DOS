// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";


// ====================================
// DEVELOPMENT USERS
// ====================================

const developmentUsers = {

    admin:{

        email:"admin@raasdos.com",

        password:"admin123"

    },

    management:{

        email:"manager@raasdos.com",

        password:"manager123"

    },

    sales:{

        email:"sales@raasdos.com",

        password:"sales123"

    },

    ops:{

        email:"ops@raasdos.com",

        password:"ops123"

    },

    customer:{

        email:"customer@raasdos.com",

        password:"cust123"

    }

};


// ====================================
// COMPONENT
// ====================================

function Login(){

    const {

        login

    } = useAuth();

    const navigate = useNavigate();


    const [

        role,

        setRole

    ] = useState("");



    const [

        email,

        setEmail

    ] = useState("");



    const [

        password,

        setPassword

    ] = useState("");



    function handleRoleChange(

        selectedRole

    ){

        setRole(

            selectedRole

        );

        if(

            developmentUsers[selectedRole]

        ){

            setEmail(

                developmentUsers[selectedRole].email

            );

            setPassword(

                developmentUsers[selectedRole].password

            );

        }

        else{

            setEmail("");

            setPassword("");

        }

    }



    async function handleLogin(){

        try{

            const user = await login(

                email,

                password

            );

            console.log(

                "[Login] Logged in as:",

                user.role

            );

            navigate(

                "/dashboard"

            );

        }

        catch(error){

            alert(

                error.message

            );

        }

    }



    return(

    <div className="login-page">

    <div className="login-card">

    <h1 className="login-title">

    RAAS-DOS

    </h1>

    <p className="login-subtitle">

    Role Based Workflow Management

    </p>

    <div className="login-form">

    <select

    value={role}

    onChange={(e)=>

    handleRoleChange(

    e.target.value

    )

    }

    >

    <option value="">

    Select Development Role

    </option>

    <option value="admin">

    Admin

    </option>

    <option value="management">

    Management

    </option>

    <option value="sales">

    Sales

    </option>

    <option value="ops">

    Operations

    </option>

    <option value="customer">

    Customer

    </option>

    </select>

    <input

    type="email"

    placeholder="Email"

    value={email}

    onChange={(e)=>

    setEmail(

    e.target.value

    )

    }

    />

    <input

    type="password"

    placeholder="Password"

    value={password}

    onChange={(e)=>

    setPassword(

    e.target.value

    )

    }

    />

    <button

    className="primary-button"

    onClick={handleLogin}

    >

    Login

    </button>

    </div>

    </div>

    </div>

    );

}


export default Login;