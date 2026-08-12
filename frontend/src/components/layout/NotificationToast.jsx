import { useEffect } from "react";

import { X } from "lucide-react";

// ====================================
// COMPONENT
// One toast for one newly-arrived unread notification. Auto-dismisses
// after AUTO_DISMISS_MS, but is always manually closable via the ×
// (per direct requirement: "closable pop-up"). Clicking the body
// behaves like clicking a row in the bell icon's panel - navigates
// into Audit Trail bracketed to that entry's date.
// ====================================

const AUTO_DISMISS_MS = 8000;

export default function NotificationToast({

    notification,

    onClose,
    onClick

}){

    useEffect(()=>{

        const timer = setTimeout(onClose, AUTO_DISMISS_MS);

        return ()=>clearTimeout(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(

        <div className="notif-toast" onClick={onClick}>

            <div className="notif-toast-body">

                <span className="notif-toast-module">{notification.module}</span>

                <p className="notif-toast-title">{notification.title}</p>

                <span className="notif-toast-byline">by {notification.user_name}</span>

            </div>

            <button

                type="button"
                className="notif-toast-close"
                aria-label="Dismiss"
                onClick={e=>{ e.stopPropagation(); onClose(); }}
            >

                <X size={14}/>

            </button>

        </div>

    );

}
