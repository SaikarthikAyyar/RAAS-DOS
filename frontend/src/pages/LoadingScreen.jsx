// ====================================
// IMPORTS
// ====================================

import { useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import logo from "../assets/JanyutechLogo.jpg";


// ====================================
// LOADING SCREEN
// A dedicated transitional page shown between a successful login and
// actually landing on the app - reached via navigate("/loading", ...)
// right after AuthContext.login() resolves, instead of jumping
// straight to the landing page with zero visual feedback while the
// app finishes settling. Deployment note: on Render's free tier the
// backend can cold-start (spin up from sleep) on the very first
// request after a period of inactivity, which is what makes the old
// "silent frozen button" experience noticeable there and not locally
// (local uvicorn never sleeps) - this screen gives that wait a real,
// branded home instead of leaving the user staring at an unresponsive
// Login button.
// ====================================

const MIN_VISIBLE_MS = 700;

export default function LoadingScreen(){

    const navigate = useNavigate();

    const location = useLocation();

    const { user, permissions } = useAuth();


    useEffect(()=>{

        // No logged-in session at all (e.g. someone bookmarks/refreshes
        // directly on /loading) - nothing to wait for, send them to Login.
        if(!user){
            navigate("/", { replace:true });
            return;
        }

        let cancelled = false;

        const startedAt = Date.now();

        function proceed(){

            if(cancelled){
                return;
            }

            const elapsed = Date.now() - startedAt;

            const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);

            setTimeout(()=>{

                if(cancelled){
                    return;
                }

                const target =
                    location.state?.landingPage ||
                    permissions.landingPage ||
                    "/administration";

                navigate(target, { replace:true });

            }, remaining);

        }

        // Permissions are already fetched as part of AuthContext.login()
        // before this page is ever reached - this just guards against
        // the rare case of landing here before that state has settled
        // (e.g. a very fast render right after a page reload).
        if(permissions.loaded){
            proceed();
        }

        return ()=>{ cancelled = true; };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions.loaded]);


    return(

        <div className="login-page loading-screen">

            <div className="login-brand-corner">
                <img src={logo} alt="Janyutech" className="login-brand-logo"/>
            </div>

            <div className="login-card loading-screen-card">

                <div className="loading-spinner" aria-hidden="true"/>

                <h1 className="login-title loading-screen-title">
                    RAAS-DOS
                </h1>

                <p className="login-subtitle loading-screen-subtitle">
                    Setting things up...
                </p>

            </div>

        </div>

    );

}
