import { useEffect, useRef, useState } from "react";

import { Bell, Menu, UserCircle } from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import { getUnreadNotifications } from "../../services/notificationsService";

import NotificationToast from "./NotificationToast";

import logo from "../../assets/JanyutechLogo.jpg";

// Other parts of the app (the Audit Trail page, on mount) dispatch
// this after marking notifications read, so the bell updates
// immediately instead of waiting for the next poll.
export const NOTIFICATIONS_REFRESH_EVENT = "notifications:refresh";

const POLL_INTERVAL_MS = 30000;

// Login-time unread replay (Phase 26): every unread notification at
// login replays as a toast, up to REPLAY_VISIBLE_SLOTS at once, each
// shown for REPLAY_DURATION_MS before animating out one by one and
// backfilling from the rest of the queue - distinct from (and never
// double-fired alongside) the ongoing "toast on genuinely new arrival"
// mechanism below, which still baselines on this same first load.
const REPLAY_VISIBLE_SLOTS = 5;
const REPLAY_DURATION_MS = 3000;
const REPLAY_LEAVE_ANIMATION_MS = 250;

export default function Topbar({

    onMenuClick

}){

    const { user, logout } = useAuth();

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    const [notifOpen, setNotifOpen] = useState(false);

    const [unread, setUnread] = useState([]);

    const [notifDateFrom, setNotifDateFrom] = useState("");

    const [notifDateTo, setNotifDateTo] = useState("");

    const notifRef = useRef(null);

    // Popup toasts, separate from the bell icon's unread list above.
    // knownIdsRef tracks every notification id already seen this
    // session - null means "not yet baselined". The first successful
    // poll after login/reload just records the current unread set
    // (no toast burst for a backlog that predates this session); every
    // poll after that toasts only ids that weren't in the previous set.
    const [toasts, setToasts] = useState([]);

    const knownIdsRef = useRef(null);

    // Login-time replay queue: { visible: [{toastId, notification, leaving}], queue: [notification, ...] }
    const [replayState, setReplayState] = useState({ visible: [], queue: [] });

    function advanceReplay(toastId){

        setReplayState(prev=>{

            const remainingVisible = prev.visible.filter(t=>t.toastId !== toastId);

            if(prev.queue.length === 0){
                return { visible: remainingVisible, queue: [] };
            }

            const [next, ...restQueue] = prev.queue;

            return {
                visible: [...remainingVisible, { toastId: next.id, notification: next, leaving: false }],
                queue: restQueue
            };

        });

    }

    function startLeavingReplay(toastId){

        setReplayState(prev=>({
            ...prev,
            visible: prev.visible.map(t=>t.toastId===toastId ? { ...t, leaving:true } : t)
        }));

        setTimeout(()=>advanceReplay(toastId), REPLAY_LEAVE_ANIMATION_MS);

    }

    function handleLogout(){

        logout();

        navigate("/");

    }

    async function loadUnread(){

        if(!user?.id) return;

        try{

            const data = await getUnreadNotifications(user.id, {
                dateFrom: notifDateFrom || undefined,
                dateTo: notifDateTo || undefined
            });

            const currentIds = new Set(data.map(n=>n.id));

            if(knownIdsRef.current === null){

                knownIdsRef.current = currentIds;

                if(data.length > 0){

                    setReplayState({
                        visible: data.slice(0, REPLAY_VISIBLE_SLOTS).map(n=>({
                            toastId: n.id,
                            notification: n,
                            leaving: false
                        })),
                        queue: data.slice(REPLAY_VISIBLE_SLOTS)
                    });

                }

            }
            else{

                const newlyArrived = data.filter(n=>!knownIdsRef.current.has(n.id));

                if(newlyArrived.length > 0){

                    setToasts(prev=>[
                        ...prev,
                        ...newlyArrived.map(n=>({ toastId:n.id, notification:n }))
                    ]);

                }

                knownIdsRef.current = currentIds;

            }

            setUnread(data);

        }
        catch(error){

            console.error("[Topbar] Failed to load unread notifications", error);

        }

    }

    function dismissToast(toastId){

        setToasts(prev=>prev.filter(t=>t.toastId !== toastId));

    }

    // Initial load + poll + listen for the "mark all read" refresh
    // signal fired from the Audit Trail page.
    useEffect(()=>{

        loadUnread();

        const interval = setInterval(loadUnread, POLL_INTERVAL_MS);

        window.addEventListener(NOTIFICATIONS_REFRESH_EVENT, loadUnread);

        return ()=>{
            clearInterval(interval);
            window.removeEventListener(NOTIFICATIONS_REFRESH_EVENT, loadUnread);
        };

    }, [user?.id]);

    // Re-fetch whenever the panel's own date filter changes.
    useEffect(()=>{

        loadUnread();

    }, [notifDateFrom, notifDateTo]);

    function handleNotificationClick(notification){

        setNotifOpen(false);

        const day = notification.created_at
            ? notification.created_at.slice(0, 10)
            : "";

        navigate(
            `/audit-trail${day ? `?date_from=${day}&date_to=${day}` : ""}`
        );

    }

    function handleToastClick(toastId, notification){

        dismissToast(toastId);

        handleNotificationClick(notification);

    }

    // Close the profile dropdown / notifications panel on any click outside them.
    useEffect(()=>{

        function handleOutsideClick(event){

            if(
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ){
                setProfileOpen(false);
            }

            if(
                notifRef.current &&
                !notifRef.current.contains(event.target)
            ){
                setNotifOpen(false);
            }

        }

        document.addEventListener("mousedown", handleOutsideClick);

        return ()=>{
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, []);

    return(

        <>

        <div className="topbar">

            {/* Left Section */}

            <div className="topbar-left">

                <button

                    type="button"

                    className="sidebar-toggle-btn"

                    aria-label="Open menu"

                    onClick={onMenuClick}

                >

                    <Menu size={22}/>

                </button>

                <img
                    src={logo}
                    alt="Janyutech"
                    className="topbar-logo"
                />

            </div>


            {/* Right Section */}

            <div className="topbar-right">

                <div className="notif-menu" ref={notifRef}>

                    <button
                        type="button"
                        className="topbar-icon-btn notif-bell-wrap"
                        aria-label="Notifications"
                        onClick={()=>setNotifOpen(open=>!open)}
                    >

                        <Bell size={20}/>

                        {
                            unread.length > 0 && (
                                <span className="notif-badge">
                                    {unread.length > 9 ? "9+" : unread.length}
                                </span>
                            )
                        }

                        {
                            unread.length > 0 && (
                                <span className="notif-hover-tooltip">
                                    {unread[0].title}
                                </span>
                            )
                        }

                    </button>

                    {
                        notifOpen && (

                            <div className="notif-panel">

                                <div className="notif-panel-header">

                                    <span>Notifications</span>

                                    <div className="notif-panel-filters">

                                        <input
                                            type="date"
                                            value={notifDateFrom}
                                            onChange={e=>setNotifDateFrom(e.target.value)}
                                        />

                                        <input
                                            type="date"
                                            value={notifDateTo}
                                            onChange={e=>setNotifDateTo(e.target.value)}
                                        />

                                    </div>

                                </div>

                                <div className="notif-panel-body">

                                    {
                                        unread.length === 0 ? (

                                            <div className="notif-panel-empty">
                                                No unread notifications
                                            </div>

                                        ) : (

                                            unread.map(notification=>(

                                                <button
                                                    key={notification.id}
                                                    type="button"
                                                    className={notification.is_important ? "notif-panel-row important" : "notif-panel-row"}
                                                    onClick={()=>handleNotificationClick(notification)}
                                                >
                                                    <span className="notif-panel-row-title">
                                                        {notification.is_important && <span className="notif-important-badge">Important</span>}
                                                        {notification.title}
                                                    </span>

                                                    {
                                                        notification.remark && (
                                                            <span className="notif-panel-row-remark">{notification.remark}</span>
                                                        )
                                                    }
                                                </button>

                                            ))

                                        )
                                    }

                                </div>

                            </div>

                        )
                    }

                </div>

                <div className="profile-menu" ref={profileRef}>

                    <button
                        type="button"
                        className="topbar-icon-btn"
                        aria-label="Profile"
                        onClick={()=>setProfileOpen(open=>!open)}
                    >

                        <UserCircle size={22}/>

                    </button>

                    {

                        profileOpen && (

                            <div className="profile-dropdown">

                                <div className="profile-dropdown-name">

                                    {user?.name}

                                </div>

                                <div className="profile-dropdown-role">

                                    {user?.role}

                                </div>

                                <button

                                    className="profile-dropdown-logout"

                                    onClick={handleLogout}

                                >

                                    Logout

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>

        </div>

        {
            (toasts.length > 0 || replayState.visible.length > 0) && (

                <div className="notif-toast-stack">

                    {
                        toasts.map(({ toastId, notification })=>(

                            <NotificationToast

                                key={toastId}
                                notification={notification}
                                onClose={()=>dismissToast(toastId)}
                                onClick={()=>handleToastClick(toastId, notification)}

                            />

                        ))
                    }

                    {
                        replayState.visible.map(({ toastId, notification, leaving })=>(

                            <NotificationToast

                                key={`replay-${toastId}`}
                                notification={notification}
                                durationMs={REPLAY_DURATION_MS}
                                leaving={leaving}
                                onClose={()=>startLeavingReplay(toastId)}
                                onClick={()=>{
                                    startLeavingReplay(toastId);
                                    handleNotificationClick(notification);
                                }}

                            />

                        ))
                    }

                </div>

            )
        }

        </>

    );

}
