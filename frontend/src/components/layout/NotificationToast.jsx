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

// Business Masters (Type C) notifications get more time on screen -
// they're flagged important precisely because they're easy to miss.
const AUTO_DISMISS_MS_IMPORTANT = 20000;

export default function NotificationToast({

    notification,

    onClose,
    onClick,

    // Login-time unread replay (Phase 26) overrides the default
    // auto-dismiss timing to a fixed 3s, and sets a "leaving" class
    // instead of an instant unmount so the queue's backfill has time
    // to animate the outgoing toast before the next one takes its slot.
    durationMs,
    leaving = false

}){

    const isImportant = !!notification.is_important;

    useEffect(()=>{

        const delay = durationMs ?? (isImportant ? AUTO_DISMISS_MS_IMPORTANT : AUTO_DISMISS_MS);

        const timer = setTimeout(onClose, delay);

        return ()=>clearTimeout(timer);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(

        <div
            className={
                [
                    "notif-toast",
                    isImportant ? "important" : "",
                    leaving ? "leaving" : ""
                ].filter(Boolean).join(" ")
            }
            onClick={onClick}
        >

            <div className="notif-toast-body">

                {isImportant && <span className="notif-important-badge">Important</span>}

                <span className="notif-toast-module">{notification.module}</span>

                <p className="notif-toast-title">{notification.title}</p>

                {
                    notification.remark && (
                        <p className="notif-toast-remark">{notification.remark}</p>
                    )
                }

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
