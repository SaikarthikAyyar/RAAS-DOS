import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";


// ====================================
// REQUIRE AUTH
// Wraps the entire protected route group (everything under MainLayout).
// Before the Vercel SPA-rewrite fix, an unauthenticated deep link
// (e.g. typing /business-master cold) 404'd at the platform level and
// never reached React at all - that accidentally masked the fact that
// nothing here has ever actually checked whether a user is logged in.
// Now that every route correctly resolves to the app, this is what
// closes that gap: no user in AuthContext -> bounce straight back to
// Login, for any path, before MainLayout/its children ever render.
//
// `user` comes from AuthContext's synchronous localStorage rehydration
// (see readStoredUser() there), so this check is correct on the very
// first render - no flash of protected content while anything loads.
// ====================================

export default function RequireAuth({ children }){

    const { user } = useAuth();

    const location = useLocation();

    if(!user){

        return(

            <Navigate
                to="/"
                state={{ from: location.pathname }}
                replace
            />

        );

    }

    return children;

}
