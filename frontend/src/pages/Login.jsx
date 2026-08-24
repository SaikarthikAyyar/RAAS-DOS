// ====================================
// IMPORTS
// ====================================

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import logo from "../assets/JanyutechLogo.jpg";

import { isJanyutechEmail } from "../utils/validators";

import { signupUser } from "../services/signupService";


// ====================================
// COMPONENT
// ====================================

function Login(){

    const {

        login

    } = useAuth();

    const navigate = useNavigate();


    // ====================================
    // TAB
    // ====================================

    const [activeTab, setActiveTab] = useState("login");


    // ====================================
    // LOGIN TAB STATE
    // ====================================

    const [
        email,
        setEmail
    ] = useState("");

    const [
        password,
        setPassword
    ] = useState("");

    const [loggingIn, setLoggingIn] = useState(false);


    async function handleLogin(){

        if(loggingIn){
            return;
        }

        setLoggingIn(true);

        try{

            const user = await login(

                email,

                password

            );

            console.log(

                "[Login] Logged in as:",

                user.role,

                "- landing page:",

                user.landingPage

            );

            // Hand off to the dedicated loading screen instead of
            // jumping straight to the landing page - on Render's free
            // tier a cold backend can make the login() call above take
            // a long while with zero visual feedback otherwise, and
            // this also gives every subsequent login a consistent,
            // deliberate "you're in, app is opening" beat.
            navigate(

                "/loading",

                { state:{ landingPage: user.landingPage || "/administration" } }

            );

        }

        catch(error){

            alert(

                error.message

            );

            setLoggingIn(false);

        }

    }


    // ====================================
    // SIGN UP TAB STATE
    // Role is fixed to Sales Executive for now - not a selectable
    // field, per direct instruction.
    // ====================================

    const [signupName, setSignupName] = useState("");

    const [signupEmail, setSignupEmail] = useState("");

    const [signupEmailTouched, setSignupEmailTouched] = useState(false);

    const [signupPassword, setSignupPassword] = useState("");

    const [signingUp, setSigningUp] = useState(false);

    const [signupMessage, setSignupMessage] = useState("");

    const signupEmailInvalid =
        signupEmailTouched && signupEmail && !isJanyutechEmail(signupEmail);

    async function handleSignup(){

        if(signingUp){
            return;
        }

        if(!signupName.trim()){
            alert("Name is required.");
            return;
        }

        if(!isJanyutechEmail(signupEmail)){
            setSignupEmailTouched(true);
            alert("Only @janyutech.com email addresses are allowed.");
            return;
        }

        if(!signupPassword){
            alert("Password is required.");
            return;
        }

        setSigningUp(true);

        setSignupMessage("");

        try{

            await signupUser(

                signupName,

                signupEmail,

                signupPassword

            );

            setSignupMessage(
                "Account created. Your login details have been emailed to you — switch to the Login tab to sign in."
            );

            setSignupName("");

            setSignupEmail("");

            setSignupEmailTouched(false);

            setSignupPassword("");

        }

        catch(error){

            alert(

                error.message

            );

        }

        finally{

            setSigningUp(false);

        }

    }


    // ====================================
    // UI
    // ====================================

    return(

    <div className="login-page">

    <div className="login-brand-corner">

    <img src={logo} alt="Janyutech" className="login-brand-logo"/>

    </div>

    <div className="login-card">

    <h1 className="login-title">

    RAAS-DOS

    </h1>

    <p className="login-subtitle">

    Role Based Workflow Management

    </p>

    <div className="login-tabs">

        <button

            type="button"

            className={
                activeTab === "login"
                    ? "login-tab login-tab-active"
                    : "login-tab"
            }

            onClick={()=>setActiveTab("login")}

        >

            Login

        </button>

        <button

            type="button"

            className={
                activeTab === "signup"
                    ? "login-tab login-tab-active"
                    : "login-tab"
            }

            onClick={()=>setActiveTab("signup")}

        >

            Sign Up

        </button>

    </div>

    {

        activeTab === "login"

            ? (

                <div className="login-form">

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

                    disabled={loggingIn}

                    >

                    {loggingIn ? "Logging in..." : "Login"}

                    </button>

                </div>

            )

            : (

                <div className="login-form">

                    <input

                        type="text"

                        placeholder="Full Name"

                        value={signupName}

                        onChange={(e)=>setSignupName(e.target.value)}

                    />

                    <input

                        type="email"

                        placeholder="Email (e.g. name@janyutech.com)"

                        className={signupEmailInvalid ? "login-input-invalid" : ""}

                        value={signupEmail}

                        onChange={(e)=>setSignupEmail(e.target.value)}

                        onBlur={()=>setSignupEmailTouched(true)}

                    />

                    {

                        signupEmailInvalid && (

                            <span className="login-field-error">

                                Only @janyutech.com email addresses are allowed.

                            </span>

                        )

                    }

                    <input

                        type="password"

                        placeholder="Password"

                        value={signupPassword}

                        onChange={(e)=>setSignupPassword(e.target.value)}

                    />

                    <div className="login-role-fixed">

                        <span>Role</span>

                        <strong>Sales Executive</strong>

                    </div>

                    <button

                        className="primary-button"

                        onClick={handleSignup}

                        disabled={signingUp}

                    >

                        {signingUp ? "Creating account..." : "Sign Up"}

                    </button>

                    {

                        signupMessage && (

                            <p className="login-signup-success">

                                {signupMessage}

                            </p>

                        )

                    }

                </div>

            )

    }

    </div>

    </div>

    );

}


export default Login;
