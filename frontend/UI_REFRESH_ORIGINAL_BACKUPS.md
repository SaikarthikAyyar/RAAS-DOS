# UI Refresh — Original File Backups

This file exists purely as a rollback mechanism for the UI/UX responsiveness & immersion
refresh (plan file: Phase 43). Before any file is edited for the first time as part of this
initiative, its full original content is copied here, verbatim, inside a clearly delimited
block:

```
=== BEGIN ORIGINAL FILE: <repo-relative path> ===
...exact original content...
=== END ORIGINAL FILE: <repo-relative path> ===
```

**Rules:**
- A file is only ever backed up **once** — the first time it's touched. If a later module
  edits the same file again, its already-captured block is left alone (it must always reflect
  the pre-refresh state, never an intermediate one).
- To revert a single file: find its `BEGIN`/`END` block below and replace the live file's
  content with exactly what's between the markers.
- To revert everything from this initiative: do the same for every block in this file.
- This file itself is not part of the redesign and should never be deleted while this
  initiative is in progress.

---

=== BEGIN ORIGINAL FILE: frontend/src/styles/layout.css ===
/* ====================================
   GLOBAL RESET
==================================== */

:root{

--orange:#f58220;

--deep:#12151c;

--ink:#1f2937;

--muted:#6b7280;

--line:#e5e7eb;

--bg:#f5f6fa;

--green:#16a34a;

--red:#dc2626;

--amber:#d97706;

--blue:#2563eb;

--card:#ffffff;

}

*{
margin:0;
padding:0;
box-sizing:border-box;
}

html,
body,
#root{

width:100%;
height:100%;
font-family:Inter,sans-serif;
overflow:hidden;

}

/* ====================================
   APP LAYOUT
==================================== */

.app-shell{

display:flex;
width:100vw;
height:100vh;

background:var(--bg);

overflow:hidden;

}

.app-main{

flex:1;
display:flex;
flex-direction:column;
overflow:hidden;

}

.app-content{

flex:1;
overflow-y:auto;
padding:20px;

}

/* ====================================
   SIDEBAR
==================================== */

.app-sidebar{

width:290px;

min-width:290px;

height:100vh;

display:flex;

flex-direction:column;

background:var(--deep);

border-right:1px solid #222831;

overflow:hidden;

}

/* ====================================
   LOGO
==================================== */

.sidebar{

display:flex;

flex-direction:column;

height:100%;

overflow:hidden;

}

.logo{

display:flex;

justify-content:center;

align-items:center;
mix-blend-mode:screen;


height:90px;



flex-shrink:0;

border-bottom:1px solid #2b313b;

/* padding:0px; */

}

.logo img{

width:225px;
height:auto;

}

/* ====================================
   MENU
==================================== */

.menu-item{

display:flex;
align-items:center;
gap:14px;

width:100%;

height:58px;

padding:0 18px;

margin-bottom:10px;

border:none;

border-radius:10px;

background:transparent;

text-decoration:none;

font-size:15px;

font-weight:600;

color:white;

cursor:pointer;

transition:.2s;

}

.menu-item:hover{

background:#242b36;



}

.menu-item.active{

background:var(--orange);

color:white;

}

/* ====================================
   SIDEBAR FOOTER
==================================== */

.sidebar-menu{

flex:1;

overflow-y:auto;

overflow-x:hidden;

padding:20px;

scrollbar-width:thin;

scrollbar-color:var(--orange) #1b1f27;

}

.sidebar-menu::-webkit-scrollbar{

width:10px;

}

.sidebar-menu::-webkit-scrollbar-track{

background:#1b1f27;

border-radius:20px;

}

.sidebar-menu::-webkit-scrollbar-thumb{

background:var(--orange);

border-radius:20px;

border:2px solid #1b1f27;

}

.sidebar-menu::-webkit-scrollbar-thumb:hover{

background:#ff9b42;

}

/* ====================================
   TOPBAR
==================================== */

.topbar{

    display:flex;

    align-items:center;

    height:80px;

    width:100%;

    padding:0 20px;

    gap:20px;

   background:white;

   border-bottom:1px solid var(--line);

   box-shadow:0 2px 10px rgba(17,24,39,.05);

}

/* ====================================
   TOPBAR LEFT
==================================== */

.topbar-left{

display:flex;
align-items:center;
gap:15px;

flex-shrink:0;

flex:0 0 auto;

font-size:18px;
font-weight:600;

color:var(--ink);

}

.topbar-logo{

height:36px;

width:auto;

flex-shrink:0;

}

/* ====================================
   TOPBAR RIGHT
==================================== */

.topbar-right{

display:flex;
align-items:center;
gap:15px;

flex-shrink:0;

flex:0 0 auto;

margin-left:auto;

}

/* ====================================
   TOPBAR ICON BUTTONS (notification bell, profile)
==================================== */

.topbar-icon-btn{

    display:flex;
    align-items:center;
    justify-content:center;

    width:42px;

    height:42px;

    border:1px solid var(--line);

    border-radius:50%;

    background:#f8fafc;

    color:var(--ink);

    cursor:pointer;

    transition:.2s;

    flex-shrink:0;

}

.topbar-icon-btn:hover{

    background:#eef1f6;

}

/* ====================================
   NOTIFICATIONS (bell icon + panel)
==================================== */

.notif-menu{

    position:relative;

}

.notif-bell-wrap{

    position:relative;

}

.notif-badge{

    position:absolute;

    top:-2px;

    right:-2px;

    min-width:17px;

    height:17px;

    padding:0 4px;

    border-radius:999px;

    background:var(--red);

    color:#fff;

    font-size:10px;

    font-weight:800;

    line-height:17px;

    text-align:center;

    box-shadow:0 0 0 2px #fff;

}

.notif-hover-tooltip{

    position:absolute;

    top:calc(100% + 8px);

    right:0;

    max-width:260px;

    background:var(--ink);

    color:#fff;

    font-size:11px;

    font-weight:600;

    line-height:1.4;

    white-space:normal;

    padding:8px 10px;

    border-radius:8px;

    opacity:0;

    pointer-events:none;

    transition:opacity .12s ease, transform .12s ease;

    transform:translateY(2px);

    z-index:70;

    box-shadow:0 4px 14px rgba(17,24,39,.2);

}

.notif-bell-wrap:hover .notif-hover-tooltip{

    opacity:1;

    transform:translateY(0);

}

.notif-panel{

    position:absolute;

    top:calc(100% + 10px);

    right:0;

    width:340px;

    background:#fff;

    border:1px solid var(--line);

    border-radius:12px;

    box-shadow:0 10px 30px rgba(17,24,39,.12);

    z-index:60;

    overflow:hidden;

}

.notif-panel-header{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:10px;

    padding:12px 14px;

    border-bottom:1px solid var(--line);

    font-size:13px;

    font-weight:800;

    color:var(--ink);

}

.notif-panel-filters{

    display:flex;

    gap:6px;

}

.notif-panel-filters input{

    width:112px;

    height:28px;

    padding:0 6px;

    border:1.5px solid var(--line);

    border-radius:6px;

    font-size:10.5px;

    color:var(--ink);

}

/* Fixed size - exactly tall enough for 5 title rows, scrolls both
   ways beyond that (rows stay single-line instead of wrapping). */
.notif-panel-body{

    height:210px;

    max-height:210px;

    overflow-y:auto;

    overflow-x:auto;

    scrollbar-width:thin;

    scrollbar-color:var(--orange) #f3f4f6;

}

.notif-panel-body::-webkit-scrollbar{

    width:8px;
    height:8px;

}

.notif-panel-body::-webkit-scrollbar-track{

    background:#f3f4f6;

}

.notif-panel-body::-webkit-scrollbar-thumb{

    background:var(--orange);
    border-radius:999px;

}

.notif-panel-row{

    display:block;

    width:100%;

    height:42px;

    min-width:max-content;

    padding:0 14px;

    border:none;

    border-bottom:1px solid var(--line);

    background:transparent;

    color:var(--ink);

    font-size:12px;

    font-weight:600;

    text-align:left;

    white-space:nowrap;

    cursor:pointer;

    transition:.15s;

}

.notif-panel-row:hover{

    background:#fff4ea;

    color:var(--orange);

}

/* Business Masters (Type C) notifications - red accent instead of
   the default hover-orange, and the row grows to fit the remark
   line underneath the title. Regular rows (Type A/B) are untouched. */
.notif-panel-row.important{

    height:auto;

    min-height:42px;

    padding:8px 14px;

    border-left:3px solid #b91c1c;

    white-space:normal;

}

.notif-panel-row-title{

    display:block;

    white-space:nowrap;

}

.notif-panel-row-remark{

    display:block;

    margin-top:2px;

    font-size:10.5px;

    font-weight:600;

    color:var(--muted);

    white-space:normal;

    overflow-wrap:break-word;

}

.notif-important-badge{

    display:inline-block;

    font-size:9px;

    font-weight:800;

    text-transform:uppercase;

    letter-spacing:.3px;

    color:#fff;

    background:#b91c1c;

    border-radius:4px;

    padding:1px 5px;

    margin-right:6px;

    vertical-align:middle;

}

/* Approval-gate notifications (Phase 27) - a distinct blue accent so
   they read as a different category from Business Masters' red
   "Important" at a glance, even though both share the same
   grow-to-fit-remark row treatment. Takes precedence over .important
   when a notification is flagged both is_approval and is_important
   (every real approval-gate notification always is). */
.notif-panel-row.approval{

    height:auto;

    min-height:42px;

    padding:8px 14px;

    border-left:3px solid #1d4ed8;

    white-space:normal;

}

.notif-approval-badge{

    display:inline-block;

    font-size:9px;

    font-weight:800;

    text-transform:uppercase;

    letter-spacing:.3px;

    color:#fff;

    background:#1d4ed8;

    border-radius:4px;

    padding:1px 5px;

    margin-right:6px;

    vertical-align:middle;

}

.notif-panel-empty{

    padding:20px 14px;

    font-size:12px;

    font-weight:600;

    color:var(--muted);

    text-align:center;

}

/* ====================================
   NOTIFICATION TOASTS
   Fixed to the viewport (not the topbar), so they appear over
   whichever module the user is currently on - a separate, proactive
   channel from the bell icon's pull-based panel above.
==================================== */

.notif-toast-stack{

    position:fixed;

    top:70px;

    right:16px;

    z-index:1000;

    display:flex;

    flex-direction:column;

    gap:8px;

    width:320px;

    max-width:calc(100vw - 32px);

}

.notif-toast{

    display:flex;

    align-items:flex-start;

    gap:8px;

    background:#fff;

    border:1.5px solid var(--line);

    border-left:4px solid var(--orange);

    border-radius:10px;

    box-shadow:0 8px 24px rgba(0,0,0,0.12);

    padding:10px 12px;

    cursor:pointer;

    animation:notif-toast-in .18s ease-out;

    transition:opacity .25s ease-in, transform .25s ease-in;

}

/* Login-time unread replay (Phase 26) - a toast animates out via this
   class (instead of an instant unmount) before the queue backfills its
   slot, giving the 5-at-a-time cycling a visible transition. */
.notif-toast.leaving{

    opacity:0;

    transform:translateX(16px);

    pointer-events:none;

}

.notif-toast:hover{

    border-color:var(--orange);

}

.notif-toast.important{

    border-left-color:#b91c1c;

}

.notif-toast.important:hover{

    border-color:#b91c1c;

}

/* Approval-gate toasts (Phase 27) - same blue accent as the bell
   panel's .approval row, taking precedence over .important since
   every real approval-gate notification is flagged both. */
.notif-toast.approval{

    border-left-color:#1d4ed8;

}

.notif-toast.approval:hover{

    border-color:#1d4ed8;

}

.notif-toast-body{

    flex:1;

    min-width:0;

}

.notif-toast-module{

    display:inline-block;

    font-size:10px;

    font-weight:800;

    text-transform:uppercase;

    letter-spacing:.4px;

    color:var(--orange);

    background:#fff4ea;

    border-radius:5px;

    padding:2px 6px;

    margin-bottom:4px;

}

.notif-toast-title{

    font-size:12px;

    font-weight:650;

    color:var(--ink);

    line-height:1.35;

    margin:0;
}

.notif-toast-remark{

    font-size:11px;

    font-weight:500;

    color:var(--muted);

    line-height:1.35;

    margin:4px 0 0 0;

}

.notif-toast-byline{

    display:block;

    margin-top:4px;

    font-size:10.5px;

    font-weight:600;

    color:var(--muted);

}

.notif-toast-close{

    flex-shrink:0;

    display:flex;

    align-items:center;

    justify-content:center;

    width:20px;

    height:20px;

    border:none;

    background:transparent;

    color:var(--muted);

    border-radius:5px;

    cursor:pointer;

}

.notif-toast-close:hover{

    background:#f3f4f6;

    color:var(--ink);

}

@keyframes notif-toast-in{

    from{ opacity:0; transform:translateX(16px); }
    to{ opacity:1; transform:translateX(0); }

}

/* ====================================
   PROFILE DROPDOWN
==================================== */

.profile-menu{

    position:relative;

}

.profile-dropdown{

    position:absolute;

    top:calc(100% + 10px);

    right:0;

    min-width:200px;

    background:white;

    border:1px solid var(--line);

    border-radius:12px;

    box-shadow:0 10px 30px rgba(17,24,39,.12);

    padding:14px;

    z-index:60;

}

.profile-dropdown-name{

    font-size:15px;

    font-weight:700;

    color:var(--ink);

}

.profile-dropdown-role{

    margin-top:4px;

    font-size:12.5px;

    font-weight:600;

    color:var(--muted);

    text-transform:capitalize;

}

.profile-dropdown-logout{

    width:100%;

    height:38px;

    margin-top:12px;

    border:none;

    border-radius:8px;

    background:var(--orange);

    color:white;

    font-size:13px;

    font-weight:700;

    cursor:pointer;

    transition:.2s;

}

.profile-dropdown-logout:hover{

    background:#d96b0d;

}

/* ==========================================
   LOGIN PAGE
========================================== */

.login-page{
    position:relative;
    width:100%;
    min-height:100vh;
    min-height:100dvh;
    display:flex;
    justify-content:center;
    align-items:center;
    padding:40px;
    overflow-y:auto;

    background:
        linear-gradient(180deg,rgba(8,10,15,.62) 0%,rgba(8,10,15,.42) 45%,rgba(8,10,15,.75) 100%),
        url("../assets/Login-bg.png");
    background-size:cover;
    background-position:center;
    background-repeat:no-repeat;
    background-attachment:scroll;
}

.login-brand-corner{
    position:absolute;
    top:32px;
    left:40px;
    display:flex;
    align-items:center;
    mix-blend-mode:screen;
    filter:drop-shadow(0 4px 14px rgba(0,0,0,.5));
    z-index:2;
}

.login-brand-logo{
    width:170px;
    height:auto;
}

.login-card{
    position:relative;
    z-index:1;
    width:430px;
    padding:42px;
    border-radius:28px;

    background:rgba(15,18,26,.58);
    backdrop-filter:blur(22px) saturate(150%);
    -webkit-backdrop-filter:blur(22px) saturate(150%);

    border:1px solid rgba(255,255,255,.14);
    box-shadow:0 25px 70px rgba(0,0,0,.5);
}

.login-card h1{

    text-align:center;
    color:#ffffff;
    font-size:52px;
    font-weight:800;
    margin-bottom:10px;

}

.login-card p{

    text-align:center;
    color:rgba(255,255,255,.62);
    margin-bottom:36px;

}

/* ====================================
   LOGIN CARD
==================================== */



.login-title{

font-size:42px;

font-weight:800;

text-align:center;

margin-bottom:12px;

color:#ffffff;

}

.login-subtitle{

text-align:center;

font-size:16px;

color:rgba(255,255,255,.62);

margin-bottom:35px;

}

/* ====================================
   TABS (Login / Sign Up)
==================================== */

.login-tabs{

display:flex;
gap:8px;
margin-bottom:22px;
background:rgba(255,255,255,.06);
border-radius:14px;
padding:4px;

}

.login-tab{

flex:1;
height:40px;
border:none;
border-radius:11px;
background:transparent;
color:rgba(255,255,255,.62);
font-size:13px;
font-weight:700;
cursor:pointer;
transition:.2s;

}

.login-tab:hover{

color:#ffffff;

}

.login-tab-active{

background:var(--orange);
color:#ffffff;

}

/* ====================================
   FORM
==================================== */

.login-form{

display:flex;
flex-direction:column;
gap:18px;

}

.login-form input,
.login-form select{

width:100%;

height:56px;

padding:0 20px;

border-radius:14px;

border:
1.5px solid rgba(255,255,255,.16);

background:rgba(255,255,255,.06);

color:#ffffff;

font-size:16px;

outline:none;

transition:.2s;

}

.login-form input:focus,
.login-form select:focus{

border-color:var(--orange);

background:rgba(255,255,255,.10);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}

.login-form select option{

background:#1b1f27;
color:#ffffff;

}

.login-form input::placeholder{

color:rgba(255,255,255,.42);

}

.login-input-invalid{

border-color:var(--orange) !important;
box-shadow:0 0 0 3px rgba(245,130,32,.18);

}

.login-field-error{

margin-top:-10px;
font-size:11.5px;
font-weight:600;
color:var(--orange);

}

.login-role-fixed{

display:flex;
align-items:center;
justify-content:space-between;
height:56px;
padding:0 20px;
border-radius:14px;
border:1.5px solid rgba(255,255,255,.10);
background:rgba(255,255,255,.03);
color:rgba(255,255,255,.62);
font-size:13px;

}

.login-role-fixed strong{

color:#ffffff;
font-size:14px;

}

.login-signup-success{

font-size:12.5px;
line-height:1.5;
color:#4ade80;
text-align:center;
margin-top:-4px;

}

/* ====================================
   BUTTONS
==================================== */

.primary-button{

width:100%;

height:56px;

border:none;

border-radius:14px;

background:var(--orange);

margin-top:6px;

color:white;

font-size:18px;

font-weight:800;

cursor:pointer;

transition:.2s;

box-shadow:0 10px 30px rgba(245,130,32,.35);

}

.primary-button:hover{

background:#d96b0d;

box-shadow:0 10px 34px rgba(245,130,32,.5);

}

.primary-button:disabled{

background:#8a5426;

cursor:not-allowed;

box-shadow:none;

}

/* ====================================
   LOADING SCREEN
   Reuses .login-page/.login-card/.login-brand-corner for a visually
   consistent transitional screen between a successful login and the
   real landing page.
==================================== */

.loading-screen-card{

    display:flex;
    flex-direction:column;
    align-items:center;
    gap:22px;
    padding:52px 42px;

}

.loading-screen-title{
    margin-bottom:0;
}

.loading-screen-subtitle{
    margin-bottom:0;
}

.loading-spinner{

    width:52px;
    height:52px;
    border-radius:50%;
    border:4px solid rgba(245,130,32,.22);
    border-top-color:var(--orange);
    animation:loading-spinner-spin .8s linear infinite;

}

@keyframes loading-spinner-spin{

    to{ transform:rotate(360deg); }

}

/* ====================================
   SIDEBAR TOGGLE (hamburger)
   Always visible now, on every screen size - the sidebar is an
   off-canvas drawer everywhere, not just on mobile.
==================================== */

.sidebar-toggle-btn{

display:flex;

align-items:center;

justify-content:center;

width:38px;

height:38px;

border:none;

border-radius:10px;

background:transparent;

color:var(--ink);

cursor:pointer;

flex-shrink:0;

}

.sidebar-toggle-btn:hover{

background:var(--bg);

}

/* ====================================
   SIDEBAR - OFF-CANVAS DRAWER (all screen sizes)
   Fixed and translated off-screen by default, slid in via the
   .app-sidebar-open class toggled from MainLayout's state. Since
   it's taken out of normal flow, .app-main naturally fills the
   full width underneath it.
==================================== */

.app-shell{

position:relative;

}

.app-sidebar{

position:fixed;

top:0;

left:0;

width:min(85vw,290px);

min-width:0;

height:100vh;

transform:translateX(-100%);

transition:transform .25s ease;

z-index:100;

}

.app-sidebar.app-sidebar-open{

transform:translateX(0);

}

/* ====================================
   SIDEBAR BACKDROP
   Tapping anywhere on this closes the open drawer. Only ever in the
   DOM while the sidebar is open (conditionally rendered), so no
   hidden/shown toggle needed here.
==================================== */

.sidebar-backdrop{

position:fixed;

inset:0;

background:rgba(9,11,16,.5);

z-index:90;

}

/* ====================================
   RESPONSIVE
==================================== */

@media(max-width:900px){

.login-card{

width:90%;

}

}

@media(max-width:700px){

.app-content{

padding:16px;

}

}

/* ====================================
   LOGIN PAGE - MOBILE
==================================== */

@media(max-width:600px){

.login-page{
    padding:20px;
    align-items:flex-start;
    padding-top:96px;
}

.login-card{
    width:100%;
    max-width:420px;
    padding:32px 24px;
    border-radius:22px;
}

.login-card h1,
.login-title{
    font-size:34px;
    margin-bottom:8px;
}

.login-card p,
.login-subtitle{
    font-size:14px;
    margin-bottom:26px;
}

.login-form{
    gap:14px;
}

.login-form input,
.login-form select{
    height:50px;
    padding:0 16px;
    border-radius:12px;
    font-size:16px;
}

.primary-button{
    height:50px;
    border-radius:12px;
    font-size:16px;
    margin-top:2px;
}

.login-brand-corner{
    top:20px;
    left:20px;
}

.login-brand-logo{
    width:120px;
}

}

@media(max-width:380px){

.login-page{
    padding:14px;
    padding-top:86px;
}

.login-card{
    padding:26px 18px;
    border-radius:18px;
}

.login-card h1,
.login-title{
    font-size:28px;
}

.login-brand-logo{
    width:104px;
}

.login-brand-corner{
    top:16px;
    left:16px;
}

}

@media(max-height:480px) and (orientation:landscape){

.login-page{
    align-items:flex-start;
    padding-top:88px;
    padding-bottom:24px;
}

.login-brand-logo{
    width:96px;
}

.login-card{
    padding:24px 22px;
}

}


.topbar-navigation{

    flex:1;

    min-width:0;

    display:flex;

    align-items:center;

    gap:12px;

    overflow-x:auto;

    overflow-y:hidden;

    scrollbar-width:thin;

    scrollbar-color:var(--orange) rgba(0,0,0,.08);

    padding-bottom:6px;

}

.topbar-navigation::-webkit-scrollbar{

    height:10px;

}

.topbar-navigation::-webkit-scrollbar-track{

    background:#f3f4f6;

    border-radius:999px;

}

.topbar-navigation::-webkit-scrollbar-thumb{

    background:linear-gradient(
        90deg,
        #37c6be,
        #2ab6a8
    );

    border-radius:999px;

    border:2px solid rgba(0,0,0,.08);

}

.topbar-navigation::-webkit-scrollbar-thumb:hover{

    background:linear-gradient(
        90deg,
        #4fded6,
        #37c6be
    );

}

.topbar-navigation::-webkit-scrollbar-corner{

    background:transparent;

}



.topbar-link{

    display:inline-flex;

    align-items:center;

    gap:8px;

    padding:10px 16px;

    flex:0 0 auto;

    white-space:nowrap;

    text-decoration:none;

    color:var(--ink);

    border-radius:12px;

}

.topbar-link:hover{

    background:rgba(255,255,255,0.08);

}

.topbar-link.active{

    background:var(--orange);

    color:white;

}
=== END ORIGINAL FILE: frontend/src/styles/layout.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/DashboardOverview.css ===
/* ====================================
   ADMIN DASHBOARD — BUSINESS OVERVIEW
   Scaled to match the wireframe's own compact type/spacing exactly
   (21px h1, 14.5px card headers, 22px KPI values, 11px labels, 12.5px
   table cells) - deliberately NOT reusing the existing Dashboard.css
   classes shared by the Sales/Ops/Management/Customer dashboards,
   which are a much larger, older scale. Tokens (--orange/--ink/
   --muted/--line/--bg/--card) are already declared globally in
   styles/layout.css with the exact same values the wireframe itself
   uses, so no new tokens are declared here.
==================================== */

.ovw-page{
    width:100%;
    min-height:100vh;
    padding:20px 24px 40px;
    background:var(--bg);
}

.ovw-title{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:16px;
    flex-wrap:wrap;
    margin-bottom:16px;
}

.ovw-title h1{
    margin:0;
    font-size:21px;
    font-weight:800;
    color:var(--ink);
}

.ovw-title p{
    margin:4px 0 0;
    color:var(--muted);
    font-size:13px;
}

.ovw-btn-primary{
    border:1px solid var(--orange);
    background:var(--orange);
    color:#fff;
    border-radius:9px;
    padding:7px 14px;
    font-size:12px;
    font-weight:750;
    cursor:pointer;
}

.ovw-btn-primary:disabled{
    opacity:.4;
    cursor:not-allowed;
}

.ovw-grid-6{
    display:grid;
    grid-template-columns:repeat(6,1fr);
    gap:14px;
    margin-bottom:16px;
}

.ovw-grid-3{
    display:grid;
    grid-template-columns:repeat(3,minmax(0,1fr));
    gap:14px;
    margin-bottom:14px;
}

@media(max-width:1100px){
    .ovw-grid-6{ grid-template-columns:repeat(3,1fr); }
    .ovw-grid-3{ grid-template-columns:1fr; }
}

@media(max-width:640px){
    .ovw-grid-6{ grid-template-columns:repeat(2,1fr); }
}

.ovw-kpi{
    border-radius:14px;
    padding:14px;
    background:var(--card);
    border:1px solid var(--line);
}

.ovw-kpi b{
    font-size:22px;
    display:block;
    color:var(--ink);
}

.ovw-kpi span{
    color:var(--muted);
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.02em;
}

.ovw-card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:14px;
    padding:16px;
    box-shadow:0 4px 14px rgba(17,24,39,.04);
}

.ovw-card h3{
    margin:0 0 12px;
    font-size:14.5px;
    font-weight:800;
    color:var(--ink);
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
}

.ovw-pill{
    display:inline-flex;
    align-items:center;
    border-radius:999px;
    padding:3px 10px;
    font-size:11px;
    font-weight:800;
    border:1px solid var(--line);
    background:#fff;
    white-space:nowrap;
}

.ovw-pill.green{ color:#166534; background:#dcfce7; border-color:#bbf7d0; }
.ovw-pill.red{ color:#991b1b; background:#fee2e2; border-color:#fecaca; }
.ovw-pill.amber{ color:#92400e; background:#fef3c7; border-color:#fde68a; }
.ovw-pill.blue{ color:#1d4ed8; background:#dbeafe; border-color:#bfdbfe; }
.ovw-pill.gray{ color:#475569; background:#f1f5f9; }

.ovw-table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
}

.ovw-table th,
.ovw-table td{
    text-align:left;
    border-bottom:1px solid var(--line);
    padding:8px 9px;
    font-size:12.5px;
    vertical-align:top;
    color:var(--ink);
}

.ovw-table th{
    color:#475569;
    background:#f8fafc;
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:.03em;
    font-weight:800;
}

.ovw-table tr:hover td{
    background:#fffaf3;
}

.ovw-field-row{
    display:flex;
    justify-content:space-between;
    padding:6px 0;
    border-bottom:1px dashed var(--line);
    font-size:12.5px;
    gap:10px;
    color:var(--ink);
}

.ovw-field-row:last-child{
    border-bottom:none;
}

.ovw-field-row b{
    font-weight:800;
    color:#111827;
    text-align:right;
}

.ovw-empty{
    color:var(--muted);
    font-size:12.5px;
    padding:6px 0;
}

.ovw-link{
    font-size:12px;
    font-weight:800;
    color:var(--orange);
    cursor:pointer;
}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/DashboardOverview.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/KpiTileGrid.jsx ===
// ====================================
// KPI TILE GRID
// Matches the wireframe's own .kpi tile scale exactly (see
// DashboardOverview.css) - not the larger .dashboard-stat-card
// convention the other 4 role dashboards use.
// ====================================

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

export default function KpiTileGrid({ kpis }){

    if(!kpis){
        return null;
    }

    const tiles = [

        { title:"Open Enquiries", value: kpis.open_enquiries },
        { title:"Pipeline Value", value: inr(kpis.pipeline_value) },
        { title:"Pending Approval", value: kpis.pending_approval },
        { title:"Active Jobs", value: kpis.active_jobs },
        { title:"Quote & Commercial Backlog", value: kpis.quote_commercial_backlog },
        { title:"Ops Amendments Raised", value: kpis.ops_amendments_raised }

    ];

    return(

        <div className="ovw-grid-6">

            {
                tiles.map(tile=>(

                    <div className="ovw-kpi" key={tile.title}>
                        <b>{tile.value}</b>
                        <span>{tile.title}</span>
                    </div>

                ))
            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/KpiTileGrid.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/FollowUpsCard.jsx ===
// ====================================
// FOLLOW-UPS CARD
// Sourced from Customer.next_follow_up_date/_owner/_note (Business
// Masters - real, persisted, not a mock) already bucketed
// overdue/today/upcoming server-side.
// ====================================

function pillClassFor(bucket){

    if(bucket==="overdue") return "ovw-pill red";
    if(bucket==="today") return "ovw-pill amber";
    return "ovw-pill blue";

}

function pillLabelFor(bucket){

    if(bucket==="overdue") return "Overdue";
    if(bucket==="today") return "Today";
    return "Upcoming";

}

export default function FollowUpsCard({ followUps = [] }){

    const overdueCount = followUps.filter(f=>f.bucket==="overdue").length;
    const todayCount = followUps.filter(f=>f.bucket==="today").length;
    const upcomingCount = followUps.filter(f=>f.bucket==="upcoming").length;

    return(

        <div className="ovw-card">

            <h3>
                Follow-ups
                <span className="ovw-pill red">{overdueCount} overdue</span>
                <span className="ovw-pill amber">{todayCount} today</span>
                <span className="ovw-pill gray">{upcomingCount} upcoming</span>
            </h3>

            {
                followUps.length===0 ? (

                    <p className="ovw-empty">No follow-ups on file.</p>

                ) : (

                    <table className="ovw-table">

                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Owner</th>
                                <th>Date</th>
                                <th>Note</th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                followUps.map(f=>(

                                    <tr key={f.customer_id}>
                                        <td>{f.company_name}</td>
                                        <td>{f.owner || "-"}</td>
                                        <td>
                                            <span className={pillClassFor(f.bucket)} style={{marginRight:6}}>
                                                {pillLabelFor(f.bucket)}
                                            </span>
                                            {f.date}
                                        </td>
                                        <td>{f.note || "-"}</td>
                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/FollowUpsCard.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/PipelineByStageCard.jsx ===
import { STAGE_LABELS } from "../../../data/workflowStages";

// ====================================
// PIPELINE BY STAGE CARD
// Count of active enquiries per real WorkflowStage value, labeled via
// the same STAGE_LABELS map the Enquiries list already uses.
// ====================================

export default function PipelineByStageCard({ pipelineByStage = [] }){

    return(

        <div className="ovw-card">

            <h3>Pipeline by stage</h3>

            {
                pipelineByStage.map(row=>(

                    <div className="ovw-field-row" key={row.stage}>
                        <span>{STAGE_LABELS[row.stage] || row.stage}</span>
                        <b>{row.count}</b>
                    </div>

                ))
            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/PipelineByStageCard.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/AgingCard.jsx ===
import { STAGE_LABELS } from "../../../data/workflowStages";

// ====================================
// AGING CARD
// Enquiries sitting 5+ days in their current stage - reuses the exact
// same aging computation the Enquiries list already displays
// (backend/utils/aging.py), not a separate calculation.
// ====================================

export default function AgingCard({ agingCases = [] }){

    return(

        <div className="ovw-card">

            <h3>Aging — 5+ days in stage</h3>

            {
                agingCases.length===0 ? (

                    <p className="ovw-empty">Nothing stuck right now.</p>

                ) : (

                    agingCases.map(c=>(

                        <div className="ovw-field-row" key={c.enquiry_id}>
                            <span>#{c.enquiry_id} — {c.customer_name || "-"} — {STAGE_LABELS[c.stage] || c.stage}</span>
                            <b>{c.aging_display}</b>
                        </div>

                    ))

                )
            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/AgingCard.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/overview/RecentCasesTable.jsx ===
import { useNavigate } from "react-router-dom";

import { STAGE_LABELS } from "../../../data/workflowStages";

function inr(value){

    if(value===null || value===undefined) return "-";

    return "Rs " + Math.round(value).toLocaleString("en-IN");

}

// ====================================
// RECENT CASES TABLE
// Most recent active enquiries, linking straight into the real
// Enquiry Workspace - the same route the rest of the app already
// navigates to (/enquiries/workspace/{id}).
// ====================================

export default function RecentCasesTable({ recentCases = [] }){

    const navigate = useNavigate();

    return(

        <div className="ovw-card">

            <h3>Recent cases</h3>

            {
                recentCases.length===0 ? (

                    <p className="ovw-empty">No cases yet.</p>

                ) : (

                    <table className="ovw-table">

                        <thead>
                            <tr>
                                <th>Enquiry</th>
                                <th>Customer</th>
                                <th>Stage</th>
                                <th>Value</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>

                            {
                                recentCases.map(c=>(

                                    <tr key={c.enquiry_id}>
                                        <td>#{c.enquiry_id}</td>
                                        <td>{c.customer_name || "-"}</td>
                                        <td>{STAGE_LABELS[c.stage] || c.stage}</td>
                                        <td>{inr(c.value)}</td>
                                        <td>{c.quote_commercial_status || "-"}</td>
                                        <td>
                                            <span
                                                className="ovw-link"
                                                onClick={()=>navigate(`/enquiries/workspace/${c.enquiry_id}`)}
                                            >
                                                Open case →
                                            </span>
                                        </td>
                                    </tr>

                                ))
                            }

                        </tbody>

                    </table>

                )
            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/overview/RecentCasesTable.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/EnquiryWorkspace.css ===
/* ====================================
   ENQUIRY WORKSPACE
   Visual language ported from the RAAS DOS
   HTML wireframe (RAAS_DOS_Final_Demo.html)
==================================== */

.enquiry-workspace{
    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

    display:flex;
    flex-direction:column;
    gap:16px;
    padding:20px;
    max-width:1520px;
    margin:0 auto;
    font-family:Inter,"Segoe UI",Arial,sans-serif;
    color:var(--ink);
    font-size:14px;
}


/* ====================================
   BACK LINK (matches wireframe's
   `<span class="backlink" onclick="backToList()">` at the top of the
   case workspace)
==================================== */

.workspace-backlink{
    align-self:flex-start;
    font-size:12px;
    font-weight:800;
    color:var(--orange);
    cursor:pointer;
    background:none;
    border:none;
    padding:0;
}

.workspace-backlink:hover{
    text-decoration:underline;
}


/* ====================================
   HEADER (matches wireframe .title)
==================================== */

.workspace-header{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:16px;
    flex-wrap:wrap;
}

.workspace-header-title h2{
    font-size:21px;
    margin:0;
    font-weight:800;
}

.workspace-header-subtitle{
    margin:4px 0 0;
    color:var(--muted);
    font-size:13px;
}

.workspace-header-pill{
    display:inline-flex;
    align-items:center;
    border-radius:999px;
    padding:3px 10px;
    font-size:11px;
    font-weight:800;
    border:1px solid var(--line);
    background:#fff;
    white-space:nowrap;
}

.workspace-header-pill.blue{
    color:#1d4ed8;
    background:#dbeafe;
    border-color:#bfdbfe;
}

.workspace-header-pill.red{
    color:#991b1b;
    background:#fee2e2;
    border-color:#fecaca;
}

.workspace-header-pill.gray{
    color:#475569;
    background:#f1f5f9;
}

/* Fallback detail grid, used only when no subtitle line is available */
.workspace-header-details{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:12px;
    width:100%;
}


/* ====================================
   WORKFLOW STEPPER (matches wireframe .stepper/.step/.dot/.conn)
==================================== */

.workflow-stepper{
    display:flex;
    align-items:center;
    gap:0;
    margin-bottom:4px;
    overflow-x:auto;
    padding-bottom:4px;
}

.workflow-step{
    display:flex;
    align-items:center;
    gap:6px;
    flex-shrink:0;
}

.workflow-step-number{
    width:24px;
    height:24px;
    border-radius:50%;
    background:#e5e7eb;
    color:#6b7280;
    display:grid;
    place-items:center;
    font-size:10.5px;
    font-weight:800;
    border:2px solid #e5e7eb;
    margin-bottom:0;
}

.workflow-step-name{
    font-size:11px;
    font-weight:800;
    color:#374151;
    white-space:nowrap;
}

.workflow-step-connector{
    width:28px;
    height:2px;
    background:#e5e7eb;
    margin:0 5px;
    flex-shrink:0;
}

.workflow-step-done .workflow-step-number{
    background:#dcfce7;
    color:#166534;
    border-color:#86efac;
}

.workflow-step-done .workflow-step-connector{
    background:#86efac;
}

.workflow-step-now .workflow-step-number{
    background:var(--orange);
    color:#fff;
    border-color:var(--orange);
}

.workflow-step-now .workflow-step-name{
    color:var(--deep);
}


/* ====================================
   WORKFLOW TABS (matches wireframe .tabs button)
==================================== */

.workflow-tabs{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    margin:0 0 4px;
}

.workflow-tab{
    border:1px solid var(--line);
    background:#fff;
    border-radius:999px;
    padding:6px 12px;
    font-weight:800;
    cursor:pointer;
    font-size:12px;
    color:#374151;
}

.workflow-tab-active{
    background:var(--deep);
    color:#fff;
    border-color:var(--deep);
}


/* ====================================
   CONTENT
==================================== */

.survey-workspace{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:16px;
}

.survey-card{
    background:#ffffff;
    border-radius:10px;
    padding:18px;
    box-shadow:0 2px 6px rgba(0,0,0,0.08);
}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/EnquiryWorkspace.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkflowTabs.jsx ===
// ====================================
// WORKFLOW TABS
// ====================================

import { useAuth } from "../../../contexts/AuthContext";

import GuideTriggerIcon from "../../guide/GuideTriggerIcon";

// Order and labels match the RAAS DOS wireframe's TABS array
// exactly (opsReviewTab()'s [id].js source).
const WORKFLOW_TABS = [

    {
        id: "survey",
        label: "Survey"
    },

    {
        id: "ops-review",
        label: "Ops Review"
    },

    {
        id: "techno-commercial-approval",
        label: "Techno-Commercial Review"
    },

    {
        id: "quote-commercial",
        label: "Quote & Commercial"
    },

    {
        id: "commercial-approval",
        label: "Commercial Approval"
    },

    {
        id: "po",
        label: "PO"
    },

    {
        id: "job-created",
        label: "Job Created"
    },

    {
        id: "execution",
        label: "Execution / Job"
    },

    {
        id: "audit",
        label: "Audit Trail"
    }

];


// ====================================
// COMPONENT
// ====================================

export default function WorkflowTabs({

    activeTab,

    onTabChange

}){

    const { permissions } = useAuth();

    // Falls back to "all tabs" when permissions haven't loaded yet
    // (e.g. still fetching right after login) - avoids a flash of an
    // empty tab bar for roles that have full access anyway.
    const allowedTabs = permissions?.workspaceTabs?.length
        ? WORKFLOW_TABS.filter(
            tab=>permissions.workspaceTabs.includes(`enquiry-tab-${tab.id}`)
        )
        : WORKFLOW_TABS;

    return(

        <div className="workflow-tabs">

            {

                allowedTabs.map(

                    tab=>(

                        <button

                            key={tab.id}

                            type="button"

                            className={

                                activeTab===tab.id

                                    ? "workflow-tab workflow-tab-active"

                                    : "workflow-tab"

                            }

                            onClick={

                                ()=>onTabChange?.(

                                    tab.id

                                )

                            }

                        >

                            {tab.label}

                        </button>

                    )

                )

            }

            <GuideTriggerIcon activeTab={activeTab}/>

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkflowTabs.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkspaceHeader.jsx ===
// ====================================
// STAGE LABELS
// ====================================

const STAGE_LABELS = {

    CUSTOMER_REQUEST: "Customer Request",
    SALES_SURVEY: "Sales Survey",
    OPS_REVIEW: "Ops Review",
    QUOTE_COMMERCIAL_REVIEW: "Quote & Commercial",
    COMMERCIAL_APPROVAL: "Commercial Approval",
    QUOTE_RELEASED: "Quote Released",
    PO_RECEIVED: "PO Received",
    JOB_CREATION: "Job Creation",
    EXECUTION: "Execution",
    COMPLETED: "Completed"

};


// ====================================
// COMPONENT
// ====================================

export default function WorkspaceHeader({

    enquiry,
    customer

}){

    const stageLabel = STAGE_LABELS[enquiry?.stage] ?? enquiry?.stage ?? "-";

    let pillClass = "blue";
    let pillText = stageLabel;

    if(enquiry?.status === "LOST"){
        pillClass = "red";
        pillText = "Lost";
    } else if(enquiry?.status === "ARCHIVED"){
        pillClass = "gray";
        pillText = "Archived";
    }

    const subtitleParts = [

        customer?.plant_site_location,

        customer?.nearest_city_hub
            ? `Hub: ${customer.nearest_city_hub}`
            : null,

        enquiry?.owner_role
            ? `Owner: ${enquiry.owner_role}`
            : null,

        enquiry?.created_at
            ? `Created ${new Date(enquiry.created_at).toLocaleDateString()}`
            : null

    ].filter(Boolean);

    return(

        <div className="workspace-header">

            <div className="workspace-header-title">

                <h2>

                    {enquiry?.id ? `Enquiry #${enquiry.id}` : "Enquiry Workspace"}
                    {" - "}
                    {customer?.company_name ?? "-"}

                </h2>

                <p className="workspace-header-subtitle">

                    {

                        subtitleParts.length
                            ? subtitleParts.join(" · ")
                            : "No customer details available."

                    }

                </p>

            </div>

            <span className={`workspace-header-pill ${pillClass}`}>

                {pillText}

            </span>

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkspaceHeader.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkflowStepper.jsx ===
// ====================================
// WORKFLOW STAGES
// Keys match the backend EnquiryStage enum
// (backend/schemas/enquiry_consolidated_schema.py)
// ====================================

const WORKFLOW_STAGES = [

    { key: "CUSTOMER_REQUEST", label: "Customer Request" },
    { key: "SALES_SURVEY", label: "Sales Survey" },
    { key: "OPS_REVIEW", label: "Ops Review" },
    { key: "QUOTE_COMMERCIAL_REVIEW", label: "Quote & Commercial" },
    { key: "COMMERCIAL_APPROVAL", label: "Commercial Approval" },
    { key: "QUOTE_RELEASED", label: "Quote Released" },
    { key: "PO_RECEIVED", label: "PO Received" },
    { key: "JOB_CREATION", label: "Job Creation" },
    { key: "EXECUTION", label: "Execution" },
    { key: "COMPLETED", label: "Completed" }

];


// ====================================
// COMPONENT
// ====================================

export default function WorkflowStepper({

    currentStage

}){

    const currentIndex = WORKFLOW_STAGES.findIndex(

        stage => stage.key === currentStage

    );

    return(

        <div className="workflow-stepper">

            {

                WORKFLOW_STAGES.map(
                    (stage, index) => {

                        const done = currentIndex !== -1 && index < currentIndex;

                        const now = index === currentIndex;

                        const stepClass =
                            "workflow-step" +
                            (done ? " workflow-step-done" : "") +
                            (now ? " workflow-step-now" : "");

                        return(

                            <div
                                className={stepClass}
                                key={stage.key}
                            >

                                <div className="workflow-step-number">

                                    {done ? "✓" : index + 1}

                                </div>

                                <div className="workflow-step-name">

                                    {stage.label}

                                </div>

                                {

                                    index < WORKFLOW_STAGES.length - 1 && (

                                        <div className="workflow-step-connector" />

                                    )

                                }

                            </div>

                        );

                    }
                )

            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkflowStepper.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkspaceContent.jsx ===
import SurveySummary from "./SurveySummary";

import SurveyWorkspace from "./SurveyWorkspace";

import OpsReviewSummary from "./OpsReviewSummary";

import TechnoCommercialReviewSummary from "./TechnoCommercialReviewSummary";

import QuoteCommercialSummary from "./QuoteCommercialSummary";

import CommercialApprovalSummary from "./CommercialApprovalSummary";

import POSummary from "./POSummary";

import JobCreationSummary from "./JobCreationSummary";

import ExecutionWorkspaceSummary from "./ExecutionWorkspaceSummary";
// ====================================
// COMPONENT
// ====================================

export default function WorkspaceContent({

    activeTab,

    onTabChange,

    reload,

    enquiry,

    customer,

    survey,

    prefillData,

    assetProfile,

    opsSelection,

    opsScoring,

    dewatering,

    quote

}){

    switch(

        activeTab

    ){

        case "survey":

            return(

                <SurveySummary

                    enquiry={enquiry}

                    survey={survey}

                    prefillData={prefillData}

                    assetProfile={assetProfile}

                    quote={quote}

                    reload={reload}

                />

            );

        case "ops-review":

            return(

                <OpsReviewSummary

                    enquiry={enquiry}

                    opsSelection={opsSelection}

                    opsScoring={opsScoring}

                    dewatering={dewatering}

                    reload={reload}

                />

            );

        case "techno-commercial-approval":

            return(

                <TechnoCommercialReviewSummary

                    opsSelection={opsSelection}

                    quote={quote}

                />

            );

        case "quote-commercial":

            return(

                <QuoteCommercialSummary

                    enquiry={enquiry}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

        case "commercial-approval":

            return(

                <CommercialApprovalSummary

                    enquiry={enquiry}

                    survey={survey}

                    opsSelection={opsSelection}

                    quote={quote}

                    onTabChange={onTabChange}

                    reload={reload}

                />

            );

        case "po":

            return(

                <POSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

        case "job-created":

            return(

                <JobCreationSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

        case "execution":

            return(

                <ExecutionWorkspaceSummary

                    enquiry={enquiry}

                    reload={reload}

                />

            );

        case "audit":

            return(

                <div>

                    Audit Trail Placeholder

                </div>

            );

        default:

            return(

                <div>

                    Survey Placeholder

                </div>

            );

    }

}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/WorkspaceContent.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/businessMasters/BusinessMasters.css ===
/* ====================================
   BUSINESS MASTERS
   Visual language ported from the RAAS DOS HTML wireframe
   (RAAS_DOS_Final_Demo.html) — renderMasters()/mastersCustomers()/
   customerDetail(). Same base scale as EnquiryWorkspace.css /
   SurveySummary.css so headings and body text stay consistent
   across modules. Matches the wireframe's .title/.tabs/.card/.btn/
   .fieldRow/.grid.cols2 structure and sizing as closely as this
   codebase's CSS conventions allow — see the "perfect match" note
   in feedback_wireframe_fidelity memory before changing this file.
==================================== */

.bm-module{
    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

    display:flex;
    flex-direction:column;
    padding:20px;
    max-width:1520px;
    margin:0 auto;
    font-family:Inter,"Segoe UI",Arial,sans-serif;
    color:var(--ink);
    font-size:14px;
}


/* ====================================
   TITLE (matches wireframe .title)
==================================== */

.bm-title{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:16px;
    margin-bottom:16px;
    flex-wrap:wrap;
}

.bm-title h1{
    font-size:21px;
    margin:0;
    font-weight:800;
}

.bm-title p{
    margin:4px 0 0;
    color:var(--muted);
    font-size:13px;
}


/* ====================================
   TABS (matches wireframe .tabs)
==================================== */

.bm-tabs{
    display:flex;
    gap:6px;
    flex-wrap:wrap;
    margin:0 0 14px;
}

.bm-tabs button{
    border:1px solid var(--line);
    background:#fff;
    border-radius:999px;
    padding:6px 12px;
    font-weight:800;
    cursor:pointer;
    font-size:12px;
    color:#374151;
}

.bm-tabs button.active{
    background:var(--deep);
    color:#fff;
    border-color:var(--deep);
}

/* ====================================
   DETAIL HEADER
==================================== */

.bm-detail-header{
    display:flex;
    justify-content:flex-end;
    align-items:center;
    margin-bottom:12px;
}

/* ====================================
   CARD (matches wireframe .card / .card h3 / .card h4)
==================================== */

.bm-card{
    background:var(--card);
    border:1px solid var(--line);
    border-radius:14px;
    padding:16px;
    box-shadow:0 4px 14px rgba(17,24,39,.04);
    overflow-x:auto;
}

.bm-card h3{
    margin:0 0 12px;
    font-size:14.5px;
    font-weight:800;
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
    color:#111827;
}

/* ====================================
   LOOKUP LISTS TAB
==================================== */

.bm-lookup-grid{
    display:grid;
    grid-template-columns:repeat(3, 1fr);
    gap:14px;
}

@media (max-width:1100px){
    .bm-lookup-grid{
        grid-template-columns:repeat(2, 1fr);
    }
}

@media (max-width:700px){
    .bm-lookup-grid{
        grid-template-columns:1fr;
    }
}

.bm-lookup-card h3{
    font-size:12.5px;
}

.bm-lookup-used-in{
    font-size:10.5px;
    color:var(--muted, #6b7280);
    margin:-6px 0 10px;
}

.bm-lookup-chips{
    display:flex;
    flex-wrap:wrap;
    gap:6px;
    margin-bottom:10px;
    min-height:22px;
}

.bm-lookup-chip{
    display:inline-flex;
    align-items:center;
    gap:5px;
    background:#f3f4f6;
    border:1px solid var(--line);
    border-radius:999px;
    padding:3px 8px;
    font-size:11px;
    color:#111827;
}

.bm-lookup-chip-other{
    background:rgba(234,88,12,.08);
    border-color:rgba(234,88,12,.25);
}

.bm-lookup-chip-badge{
    font-size:9px;
    font-weight:700;
    text-transform:uppercase;
    color:#ea580c;
}

.bm-lookup-chip-remove{
    cursor:pointer;
    font-weight:700;
    color:#6b7280;
    padding:0 2px;
}

.bm-lookup-chip-remove:hover{
    color:var(--enquiry-red, #dc2626);
}

.bm-card h4{
    margin:14px 0 8px;
    font-size:12px;
    font-weight:800;
    color:#374151;
    text-transform:uppercase;
    letter-spacing:.03em;
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:wrap;
}

/* Pushes a button/pill to the far right of a .card h3/h4 row,
   matching the wireframe's inline "style=margin-left:auto" trick. */
.bm-push-right{
    margin-left:auto;
}


/* ====================================
   FIELD ROW (matches wireframe .fieldRow)
==================================== */

.bm-field-row{
    display:flex;
    justify-content:space-between;
    padding:6px 0;
    border-bottom:1px dashed var(--line);
    font-size:12.5px;
    gap:10px;
}

.bm-field-row:last-of-type{
    border-bottom:none;
}

.bm-field-row span:first-child{
    color:#374151;
}

.bm-field-row b{
    text-align:right;
    color:#111827;
    font-weight:800;
}

.bm-muted{
    color:var(--muted);
    font-size:12.5px;
}


/* ====================================
   TABLE (matches wireframe plain table styling)
==================================== */

.bm-card table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    font-size:12.5px;
}

.bm-card th,
.bm-card td{
    text-align:left;
    border-bottom:1px solid var(--line);
    padding:8px 9px;
    vertical-align:top;
}

.bm-card th{
    color:#475569;
    background:#f8fafc;
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:.03em;
    font-weight:800;
}

.bm-card tr:hover td{
    background:#fffaf3;
}


/* ====================================
   PILLS (matches wireframe .pill/.pill.red/.amber/.gray)
==================================== */

.bm-pill{
    display:inline-flex;
    align-items:center;
    border-radius:999px;
    padding:3px 10px;
    font-size:11px;
    font-weight:800;
    border:1px solid var(--line);
    background:#fff;
    white-space:nowrap;
}

.bm-pill-red{
    color:#991b1b;
    background:#fee2e2;
    border-color:#fecaca;
}

.bm-pill-amber{
    color:#92400e;
    background:#fef3c7;
    border-color:#fde68a;
}

.bm-pill-gray{
    color:#475569;
    background:#f1f5f9;
}

.bm-pill-green{
    color:#166534;
    background:#dcfce7;
    border-color:#bbf7d0;
}


/* ====================================
   EMAIL TEMPLATES - row action icons + tooltip
   Same compact icon-button-plus-tooltip pattern used for the
   Enquiries list and Administration -> Roles & Permissions (a wide
   text-link row was flagged as wasting space there).
==================================== */

.email-template-actions{
    display:flex;
    align-items:center;
    gap:5px;
    flex-wrap:nowrap;
    white-space:nowrap;
}

.email-template-action-wrap{
    position:relative;
    display:inline-flex;
}

.email-template-actions button{
    display:flex;
    align-items:center;
    justify-content:center;
    width:26px;
    height:26px;
    border:1px solid transparent;
    border-radius:7px;
    background:transparent;
    cursor:pointer;
    transition:.15s ease;
}

.email-template-actions button:hover{
    filter:brightness(0.92);
    transform:translateY(-1px);
}

.email-template-edit{
    color:#1976d2;
    background:rgba(25,118,210,.08);
    border-color:rgba(25,118,210,.16);
}

.email-template-view{
    color:#0891b2;
    background:rgba(8,145,178,.08);
    border-color:rgba(8,145,178,.16);
}

.email-template-details{
    color:#7c3aed;
    background:rgba(124,58,237,.08);
    border-color:rgba(124,58,237,.16);
}

.email-template-send{
    color:#166534;
    background:rgba(22,163,74,.08);
    border-color:rgba(22,163,74,.16);
}

.email-template-delete{
    color:#d32f2f;
    background:rgba(211,47,47,.08);
    border-color:rgba(211,47,47,.16);
}

.email-template-action-tooltip{
    position:absolute;
    bottom:calc(100% + 6px);
    left:50%;
    transform:translateX(-50%) translateY(2px);
    background:var(--ink, #1f2937);
    color:#fff;
    font-size:11px;
    font-weight:600;
    line-height:1;
    white-space:nowrap;
    padding:5px 8px;
    border-radius:5px;
    opacity:0;
    pointer-events:none;
    transition:opacity .12s ease, transform .12s ease;
    z-index:20;
    box-shadow:0 4px 10px rgba(17,24,39,.18);
}

.email-template-action-wrap:hover .email-template-action-tooltip{
    opacity:1;
    transform:translateX(-50%) translateY(0);
}


/* ====================================
   EMAIL TEMPLATES - variables list, send form
==================================== */

.email-template-variable-row{
    display:flex;
    align-items:center;
    gap:8px;
    padding:6px 0;
    border-bottom:1px solid var(--line);
}

.email-template-variable-key{
    font-family:monospace;
    font-size:11.5px;
    background:#f3f4f6;
    padding:2px 6px;
    border-radius:4px;
}

.email-template-recipient-badge{
    font-size:9px;
    font-weight:700;
    text-transform:uppercase;
    color:#166534;
    background:#dcfce7;
    border-radius:4px;
    padding:2px 5px;
}

.email-template-var-reference{
    background:#f9fafb;
    border:1px solid var(--line);
    border-radius:8px;
    padding:10px;
    margin-top:10px;
}


/* ====================================
   BUTTONS (matches wireframe .btn/.btn.primary/.btn.ok/
   .btn.danger/.btn.xs/.btn.ghost)
==================================== */

.bm-btn{
    border:1px solid var(--line);
    background:#fff;
    border-radius:9px;
    padding:7px 12px;
    cursor:pointer;
    font-weight:750;
    font-size:12px;
    color:#374151;
}

.bm-btn:hover{
    opacity:.85;
}

.bm-btn:disabled{
    opacity:.5;
    cursor:not-allowed;
}

.bm-btn-primary{
    background:var(--orange);
    border-color:var(--orange);
    color:#fff;
}

.bm-btn-ghost{
    background:#fff;
}

.bm-btn-xs{
    padding:4px 8px;
    font-size:11px;
}

.bm-backlink{
    font-size:12px;
    font-weight:800;
    color:var(--orange);
    cursor:pointer;
    background:none;
    border:none;
    padding:0;
}


/* ====================================
   360 DETAIL VIEW (matches wireframe
   <div class="grid cols2"> — 1.3fr / .7fr, not an even split)
==================================== */

.bm-detail-grid{
    display:grid;
    grid-template-columns:1.3fr .7fr;
    gap:14px;
    margin-top:10px;
}

@media (max-width:1000px){
    .bm-detail-grid{
        grid-template-columns:1fr;
    }
}


/* ====================================
   MODAL
==================================== */

.bm-modal-overlay{
    position:fixed;
    inset:0;
    background:rgba(15,23,42,.45);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:200;
    padding:20px;
}

.bm-modal-box{
    background:#fff;
    border-radius:14px;
    padding:20px;
    width:100%;
    max-width:460px;
    max-height:85vh;
    overflow-y:auto;
    box-shadow:0 20px 45px rgba(0,0,0,.25);
}

.bm-modal-box h3{
    margin:0 0 4px;
    font-size:14.5px;
    font-weight:800;
}

.bm-modal-hint{
    margin:0 0 14px;
    font-size:12px;
    color:var(--muted);
}

.bm-formgrid{
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    gap:10px;
}

.bm-formgrid.single{
    grid-template-columns:1fr;
}

.bm-formgrid label{
    font-size:11px;
    color:#475569;
    font-weight:800;
    display:block;
    margin-bottom:4px;
}

.bm-formgrid input,
.bm-formgrid select,
.bm-formgrid textarea{
    width:100%;
    border:1px solid var(--line);
    border-radius:8px;
    padding:7px 8px;
    background:#fff;
    font:inherit;
    font-size:12.5px;
}

.bm-formgrid textarea{
    resize:vertical;
    min-height:70px;
}

.bm-modal-actions{
    display:flex;
    justify-content:flex-end;
    gap:8px;
    margin-top:16px;
}

/* Wider variant for forms with many fields (Machines/Fleet) */
.bm-modal-box-wide{
    max-width:760px;
}

.bm-formgrid h4{
    grid-column:1 / -1;
    margin:12px 0 0;
    font-size:12px;
    font-weight:800;
    color:#334155;
    border-top:1px solid var(--line);
    padding-top:10px;
}

.bm-formgrid h4:first-child{
    margin-top:0;
    border-top:none;
    padding-top:0;
}

.bm-checkbox-list{
    display:flex;
    flex-wrap:wrap;
    gap:6px 14px;
    max-height:120px;
    overflow-y:auto;
    border:1px solid var(--line);
    border-radius:8px;
    padding:8px;
}

.bm-checkbox-list label{
    display:flex;
    align-items:center;
    gap:5px;
    font-size:11.5px;
    font-weight:600;
    color:#334155;
    margin:0;
    white-space:nowrap;
}


/* ====================================
   PLACEHOLDER TABS (not built yet)
==================================== */

.bm-placeholder{
    color:var(--muted);
    font-size:12.5px;
}


/* ====================================
   FLEET & AVAILABILITY CALENDAR
   Same visual convention as the wireframe's own calWrap/calDay -
   avail/plan/block colors, just re-meaning plan/block as our real
   QUEUED/ACTIVE booking states rather than a pre-PO tentative hold.
==================================== */

.calWrap{
    display:grid;
    grid-template-columns:repeat(7,1fr);
    gap:5px;
    margin-top:8px;
}

.calHead{
    font-size:10px;
    text-transform:uppercase;
    color:var(--muted);
    text-align:center;
    font-weight:800;
}

.calDay{
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:8px 4px;
    text-align:center;
    font-size:11px;
    font-weight:700;
    background:#fff;
    cursor:pointer;
    min-height:44px;
}

.calDay.blank{
    visibility:hidden;
    cursor:default;
}

.calDay.avail{
    background:#dcfce7;
    color:#166534;
    border-color:#bbf7d0;
}

.calDay.plan{
    background:#fef3c7;
    color:#92400e;
    border-color:#fde68a;
}

.calDay.block{
    background:#fee2e2;
    color:#991b1b;
    border-color:#fecaca;
}

.calDay.pending-highlight{
    outline:3px solid var(--orange);
    outline-offset:-1px;
}
=== END ORIGINAL FILE: frontend/src/components/businessMasters/BusinessMasters.css ===

=== BEGIN ORIGINAL FILE: frontend/src/pages/BusinessMastersModule.jsx ===
import {

    useState,

    useEffect,

    useCallback

} from "react";

import "../components/businessMasters/BusinessMasters.css";

import { businessMastersTabs } from "../data/businessMastersTabs";

import CustomerListView from "../components/businessMasters/customers/CustomerListView";
import CustomerDetailView from "../components/businessMasters/customers/CustomerDetailView";
import NewCustomerModal from "../components/businessMasters/customers/NewCustomerModal";
import EditCustomerModal from "../components/businessMasters/customers/EditCustomerModal";
import EditAssetModal from "../components/businessMasters/customers/EditAssetModal";
import AddContactModal from "../components/businessMasters/customers/AddContactModal";
import SetFollowUpModal from "../components/businessMasters/customers/SetFollowUpModal";
import SendReminderModal from "../components/businessMasters/customers/SendReminderModal";
import ServiceConfigTab from "../components/businessMasters/serviceConfig/ServiceConfigTab";
import DewateringMethodsTab from "../components/businessMasters/dewatering/DewateringMethodsTab";
import AccessoriesTab from "../components/businessMasters/accessories/AccessoriesTab";
import CommercialRulesTab from "../components/businessMasters/rules/CommercialRulesTab";
import LookupListsTab from "../components/businessMasters/lookupLists/LookupListsTab";
import EmailTemplatesTab from "../components/businessMasters/emailTemplates/EmailTemplatesTab";
import QuoteTemplatesTab from "../components/businessMasters/quoteTemplates/QuoteTemplatesTab";
import HubsTab from "../components/businessMasters/hubs/HubsTab";
import FleetUnitsTab from "../components/businessMasters/fleetUnits/FleetUnitsTab";
import MachinesTab from "../components/businessMasters/machines/MachinesTab";
import MachineInventoryTab from "../components/businessMasters/machineInventory/MachineInventoryTab";
import PumpsTab from "../components/businessMasters/pumps/PumpsTab";
import PersonnelTab from "../components/businessMasters/personnel/PersonnelTab";
import HumanResourcesTab from "../components/businessMasters/hr/HumanResourcesTab";
import GstTaxTab from "../components/businessMasters/gst/GstTaxTab";

import {

    getCustomers,

    createCustomer,

    getCustomerDetail,

    addContact,

    setFollowUp,

    updateCustomerOwner,

    updateCustomer,

    deleteCustomer,

    updateAsset,

    deleteAsset,

    deleteContact

} from "../services/customerMasterService";

import { exportTab, exportCustomersReport } from "../services/businessMastersExportService";

import { getUsers } from "../services/administrationUsersService";

import { useAuth } from "../contexts/AuthContext";

import { useRemarkPrompt } from "../hooks/useRemarkPrompt";

import { formatApiError } from "../utils/apiError";

import { buildActor } from "../utils/actor";


// ====================================
// CUSTOMERS TAB
// Holds its own selectedCustomerId (list <-> 360) exactly like the
// wireframe's mastersCustomers()/customerDetail() toggle.
// ====================================

function CustomersTab({

    customers,

    loading,

    error,

    onReload

}){

    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const [detail, setDetail] = useState(null);

    const [detailLoading, setDetailLoading] = useState(false);

    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

    const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);

    const [editingAsset, setEditingAsset] = useState(null);

    const [showAddContactModal, setShowAddContactModal] = useState(false);

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);

    const [showReminderModal, setShowReminderModal] = useState(false);

    const [allUsers, setAllUsers] = useState([]);

    const { user } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    useEffect(()=>{

        getUsers()
            .then(setAllUsers)
            .catch(err=>console.error(err));

    }, []);

    const loadDetail = useCallback(async(id)=>{

        setDetailLoading(true);

        try{

            const data = await getCustomerDetail(id);

            setDetail(data);

        }

        catch(err){

            console.error(err);

        }

        finally{

            setDetailLoading(false);

        }

    }, []);

    useEffect(()=>{

        if(selectedCustomerId){

            loadDetail(selectedCustomerId);

        }

    }, [selectedCustomerId, loadDetail]);

    function handleOpenDetail(id){

        setDetail(null);

        setSelectedCustomerId(id);

    }

    function handleBack(){

        setSelectedCustomerId(null);

        setDetail(null);

    }

    async function handleCreateCustomer(payload){

        const remark = await promptForRemark("Creating this customer");

        if(remark===null){
            return;
        }

        await createCustomer({ ...payload, actor:buildActor(user), remark });

        setShowNewCustomerModal(false);

        onReload();

    }

    async function handleAddContact(payload){

        const remark = await promptForRemark("Adding this contact");

        if(remark===null){
            return;
        }

        await addContact(selectedCustomerId, { ...payload, actor:buildActor(user), remark });

        setShowAddContactModal(false);

        loadDetail(selectedCustomerId);

    }

    async function handleSetFollowUp(payload){

        const remark = await promptForRemark("Updating this follow-up");

        if(remark===null){
            return;
        }

        await setFollowUp(selectedCustomerId, { ...payload, actor:buildActor(user), remark });

        setShowFollowUpModal(false);

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleUpdateOwner(ownerUserId){

        const remark = await promptForRemark("Reassigning the Account Owner");

        if(remark===null){
            return;
        }

        await updateCustomerOwner(selectedCustomerId, { owner_user_id:ownerUserId, actor:buildActor(user), remark });

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleEditCustomer(fields){

        const remark = await promptForRemark("Editing this customer");

        if(remark===null){
            return;
        }

        await updateCustomer(selectedCustomerId, { ...fields, actor:buildActor(user), remark });

        setShowEditCustomerModal(false);

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleEditAsset(fields){

        const remark = await promptForRemark("Editing this asset");

        if(remark===null){
            return;
        }

        await updateAsset(editingAsset.id, { ...fields, actor:buildActor(user), remark });

        setEditingAsset(null);

        loadDetail(selectedCustomerId);

        onReload();

    }

    async function handleDeleteCustomer(){

        const remark = await promptForRemark("Deleting this customer");

        if(remark===null){
            return;
        }

        try{

            await deleteCustomer(selectedCustomerId, buildActor(user), remark);

            handleBack();

            onReload();

        }

        catch(err){

            alert(formatApiError(err, "Unable to delete customer."));

        }

    }

    async function handleDeleteAsset(assetId){

        const remark = await promptForRemark("Removing this asset");

        if(remark===null){
            return;
        }

        try{

            await deleteAsset(assetId, buildActor(user), remark);

            loadDetail(selectedCustomerId);

            onReload();

        }

        catch(err){

            alert(formatApiError(err, "Unable to delete asset."));

        }

    }

    async function handleDeleteContact(contactId){

        const remark = await promptForRemark("Removing this contact");

        if(remark===null){
            return;
        }

        try{

            await deleteContact(selectedCustomerId, contactId, buildActor(user), remark);

            loadDetail(selectedCustomerId);

            onReload();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove contact."));

        }

    }

    return(

        <>

            {

                selectedCustomerId ? (

                    <CustomerDetailView

                        detail={detail}

                        loading={detailLoading}

                        allUsers={allUsers}

                        onBack={handleBack}

                        onAddContact={()=>setShowAddContactModal(true)}

                        onSetFollowUp={()=>setShowFollowUpModal(true)}

                        onSendReminder={()=>setShowReminderModal(true)}

                        onUpdateOwner={handleUpdateOwner}

                        onEdit={()=>setShowEditCustomerModal(true)}

                        onDelete={handleDeleteCustomer}

                        onEditAsset={setEditingAsset}

                        onDeleteAsset={handleDeleteAsset}

                        onDeleteContact={handleDeleteContact}

                    />

                ) : (

                    <CustomerListView

                        customers={customers}

                        loading={loading}

                        error={error}

                        onOpenDetail={handleOpenDetail}

                        onNewCustomer={()=>setShowNewCustomerModal(true)}

                    />

                )

            }

            {

                showNewCustomerModal && (

                    <NewCustomerModal

                        onClose={()=>setShowNewCustomerModal(false)}

                        onCreate={handleCreateCustomer}

                    />

                )

            }

            {

                showEditCustomerModal && detail && (

                    <EditCustomerModal

                        detail={detail}

                        onClose={()=>setShowEditCustomerModal(false)}

                        onSave={handleEditCustomer}

                    />

                )

            }

            {

                editingAsset && (

                    <EditAssetModal

                        asset={editingAsset}

                        onClose={()=>setEditingAsset(null)}

                        onSave={handleEditAsset}

                    />

                )

            }

            {

                showAddContactModal && (

                    <AddContactModal

                        onClose={()=>setShowAddContactModal(false)}

                        onAdd={handleAddContact}

                    />

                )

            }

            {

                showFollowUpModal && (

                    <SetFollowUpModal

                        initialDate={detail?.next_follow_up_date}

                        initialOwner={detail?.next_follow_up_owner}

                        initialNote={detail?.next_follow_up_note}

                        onClose={()=>setShowFollowUpModal(false)}

                        onSave={handleSetFollowUp}

                    />

                )

            }

            {

                showReminderModal && detail && (

                    <SendReminderModal

                        detail={detail}

                        onClose={()=>setShowReminderModal(false)}

                        onSent={()=>{

                            setShowReminderModal(false);

                            alert(`Reminder email sent regarding ${detail.company_name}.`);

                        }}

                    />

                )

            }

            {remarkModal}

        </>

    );

}


// ====================================
// PLACEHOLDER TAB
// Honest "not built yet" - same pattern used for unbuilt Enquiry
// Workspace tabs (PO / Job Created / Execution / Audit Trail).
// ====================================

function PlaceholderTab({ label }){

    return(

        <div className="bm-card">

            <h3>{label}</h3>

            <p className="bm-placeholder">Not built yet.</p>

        </div>

    );

}


// ====================================
// PAGE
// Matches renderMasters(): .title + .tabs + tab body.
// ====================================

export default function BusinessMastersModule(){

    const [activeTab, setActiveTab] = useState("customers");

    const { permissions, hasTask } = useAuth();

    // Phase 21E: which Business Masters tabs this role can even open.
    // Falls back to "all tabs" pre-load, same accommodation already
    // used by WorkflowTabs.jsx for the Enquiry Workspace tab strip.
    const allowedBusinessMastersTabs = permissions?.businessMasterTabs?.length
        ? businessMastersTabs.filter(([key])=>permissions.businessMasterTabs.includes(`bm-tab-${key}`))
        : businessMastersTabs;

    // If the active tab isn't in the allowed set once permissions have
    // actually loaded (not just "still fetching"), the content area
    // must not keep rendering it just because the tab button is
    // hidden - land on the first tab this role can actually open.
    useEffect(()=>{

        if(!permissions?.loaded){
            return;
        }

        if(!allowedBusinessMastersTabs.some(([key])=>key===activeTab)){
            setActiveTab(allowedBusinessMastersTabs[0]?.[0] || null);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissions?.loaded, permissions?.businessMasterTabs]);

    const [customers, setCustomers] = useState([]);

    const [customersLoading, setCustomersLoading] = useState(true);

    const [customersError, setCustomersError] = useState("");

    const loadCustomers = useCallback(async()=>{

        setCustomersLoading(true);

        setCustomersError("");

        try{

            const response = await getCustomers();

            setCustomers(response.items ?? []);

        }

        catch(err){

            console.error(err);

            setCustomersError("Unable to load customers.");

        }

        finally{

            setCustomersLoading(false);

        }

    }, []);

    useEffect(()=>{

        loadCustomers();

    }, [loadCustomers]);

    const [exporting, setExporting] = useState(false);

    async function handleExportCustomersReport(){

        await exportCustomersReport();

    }

    async function handleExportSimpleTab(){

        const label = businessMastersTabs.find(([key])=>key===activeTab)?.[1] || activeTab;

        try{

            await exportTab(activeTab, label);

        }

        catch(err){

            alert(formatApiError(err, "Nothing to export for this tab yet."));

        }

    }

    async function handleExportCurrentTab(){

        setExporting(true);

        try{

            if(activeTab==="customers"){

                if(customersLoading){
                    alert("Customers are still loading — try again in a moment.");
                    return;
                }

                if(customers.length===0){
                    alert("No customers to export yet.");
                    return;
                }

                await handleExportCustomersReport();

            }

            else{

                await handleExportSimpleTab();

            }

        }

        catch(err){

            console.error(err);

            alert("Unable to export this tab right now.");

        }

        finally{

            setExporting(false);

        }

    }

    return(

        <div className="bm-module">

            <div className="bm-title">

                <div>

                    <h1>Business masters</h1>

                    <p>Every dropdown option in the system lives in Lookup Lists — nothing hardcoded inline.</p>

                </div>

                {hasTask(`bm-tab-${activeTab}`, "export_current_tab") && (

                    <button

                        className="bm-btn bm-btn-ghost"

                        onClick={handleExportCurrentTab}

                        disabled={exporting || (activeTab==="customers" && customersLoading)}

                    >

                        {exporting ? "Exporting..." : "⬇ Export current tab"}

                    </button>

                )}

            </div>

            <div className="bm-tabs">

                {

                    allowedBusinessMastersTabs.map(([key, label])=>(

                        <button

                            key={key}

                            className={activeTab===key ? "active" : ""}

                            onClick={()=>setActiveTab(key)}

                        >

                            {label}

                        </button>

                    ))

                }

            </div>

            {

                activeTab==="customers" ? (

                    <CustomersTab

                        customers={customers}

                        loading={customersLoading}

                        error={customersError}

                        onReload={loadCustomers}

                    />

                ) : activeTab==="serviceconfig" ? (

                    <ServiceConfigTab />

                ) : activeTab==="dewatering" ? (

                    <DewateringMethodsTab />

                ) : activeTab==="accessories" ? (

                    <AccessoriesTab />

                ) : activeTab==="rules" ? (

                    <CommercialRulesTab />

                ) : activeTab==="lists" ? (

                    <LookupListsTab />

                ) : activeTab==="emailtemplates" ? (

                    <EmailTemplatesTab />

                ) : activeTab==="quotetemplates" ? (

                    <QuoteTemplatesTab />

                ) : activeTab==="hubs" ? (

                    <HubsTab />

                ) : activeTab==="fleetunits" ? (

                    <FleetUnitsTab />

                ) : activeTab==="machines" ? (

                    <MachinesTab />

                ) : activeTab==="machineinventory" ? (

                    <MachineInventoryTab />

                ) : activeTab==="pumps" ? (

                    <PumpsTab />

                ) : activeTab==="personnel" ? (

                    <PersonnelTab />

                ) : activeTab==="hr" ? (

                    <HumanResourcesTab />

                ) : activeTab==="gst" ? (

                    <GstTaxTab />

                ) : (

                    <PlaceholderTab

                        label={businessMastersTabs.find(([key])=>key===activeTab)?.[1]}

                    />

                )

            }

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/pages/BusinessMastersModule.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/execution/Execution.css ===
/* ===========================================
   PAGE
   Matches the app-wide scale (BusinessMasters.css / SalesSurvey.css) -
   this file was originally built at a much larger, unrelated scale
   (42px titles, 30px card padding) before the Execution module had a
   real design pass; resized here to match everywhere else.
=========================================== */

.execution-page{

    min-height:100vh;

    padding:20px;

    background:var(--bg);

    color:var(--ink);

    font-family:Inter,"Segoe UI",Arial,sans-serif;

    font-size:14px;

}


/* ===========================================
   HEADER
=========================================== */

.execution-title{

    font-size:21px;

    font-weight:800;

    margin-bottom:14px;

    color:var(--ink);

}


/* ===========================================
   CARD
=========================================== */

.execution-card{

    background:var(--card);

    border:1px solid var(--line);

    box-shadow:0 4px 14px rgba(17,24,39,.04);

    border-radius:14px;

    padding:16px;

    margin-bottom:14px;

}


/* ===========================================
   SECTION TITLE
=========================================== */

.execution-section-title{

    font-size:14.5px;

    font-weight:800;

    margin-bottom:12px;

    color:var(--ink);

}


/* ===========================================
   SELECT
=========================================== */

.execution-selector{

    width:320px;

    max-width:100%;

    padding:7px 10px;

    border:1px solid var(--line);

    border-radius:8px;

    background:white;

    color:var(--ink);

    font-size:12.5px;

    margin-bottom:14px;

}


/* ===========================================
   SUMMARY GRID
=========================================== */

.execution-summary-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:10px;

}


.execution-summary-item{

    background:#f8fafc;

    border:1px solid var(--line);

    padding:10px 12px;

    border-radius:8px;

}


.execution-summary-item span{

    display:block;

    color:var(--muted);

    font-size:11px;

    font-weight:800;

    margin-bottom:4px;

}


.execution-summary-item strong{

    font-size:13.5px;

    color:var(--ink);

}


/* ===========================================
   METRICS
=========================================== */

.execution-metric-grid{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:10px;

    margin-bottom:14px;

}


.execution-metric{

    background:white;

    border-radius:8px;

    padding:12px;

    border:1px solid var(--line);

}


.execution-metric h5{

    margin:0 0 6px;

    color:var(--muted);

    font-size:11px;

    font-weight:800;

}


.execution-metric h2{

    margin:0;

    font-size:18px;

    font-weight:800;

    color:var(--ink);

}


/* ===========================================
   FORM
=========================================== */

.execution-form-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:10px;

}


.execution-form-group{

    display:flex;

    flex-direction:column;

}


.execution-form-group label{

    color:#475569;

    margin-bottom:4px;

    font-size:11px;

    font-weight:800;

}


.execution-input,

.execution-select,

.execution-textarea{

    width:100%;

    padding:7px 10px;

    border:1px solid var(--line);

    border-radius:8px;

    background:white;

    color:var(--ink);

    font-size:12.5px;

    font-family:inherit;

}


.execution-input:focus,

.execution-select:focus,

.execution-textarea:focus{

    outline:none;

    border-color:var(--orange);

}


.execution-textarea{

    resize:vertical;

    min-height:70px;

}


.execution-input:disabled,

.execution-input[readonly]{

    background:#f8fafc;

    border-color:var(--line);

    color:var(--muted);

    cursor:not-allowed;

}


/* ===========================================
   MAP
=========================================== */

.execution-map{

    width:100%;

    height:300px;

    border-radius:10px;

    overflow:hidden;

    border:1px solid var(--line);

    background:#f8fafc;

    display:flex;

    justify-content:center;

    align-items:center;

    margin-top:14px;

}

.execution-map-wrap{

    margin-top:14px;

    /* Leaflet's own zoom controls default to z-index:1000, which with
       no stacking context of its own here escapes straight past the
       sidebar drawer's z-index:100 (.app-sidebar) and paints on top of
       it whenever the map and an open sidebar are both on screen.
       isolation:isolate contains Leaflet's internal z-index values to
       within this wrapper - it competes at the page level only as
       this one element, well below the sidebar, with zero effect on
       the map's own internal tile/marker/control layering. */
    isolation:isolate;

}

.execution-map-wrap .execution-map{

    margin-top:0;

}

.execution-map-empty{

    color:#94a3b8;

    font-size:12px;

    text-align:center;

    padding:0 20px;

}

.execution-map-pin{

    display:block;

    width:14px;

    height:14px;

    border-radius:50%;

    border:2px solid #fff;

    box-shadow:0 1px 4px rgba(17,24,39,.35);

}

.execution-map-legend{

    display:flex;

    align-items:center;

    gap:14px;

    flex-wrap:wrap;

    margin-top:8px;

    font-size:11px;

    color:#475569;

}

.execution-map-legend span{

    display:inline-flex;

    align-items:center;

    gap:6px;

}

.execution-map-legend i{

    display:inline-block;

    width:9px;

    height:9px;

    border-radius:50%;

}

.execution-map-legend strong{

    margin-left:auto;

    color:var(--ink);

    font-size:11px;

}


/* ===========================================
   PROGRESS
=========================================== */

.execution-progress{

    width:100%;

    height:8px;

    background:#e5e7eb;

    border-radius:6px;

    overflow:hidden;

}


.execution-progress-fill{

    height:100%;

    background:var(--orange);

    transition:.35s;

}


/* ===========================================
   ACTIONS
=========================================== */

.execution-actions{

    display:flex;

    gap:10px;

    margin-top:14px;

    flex-wrap:wrap;

}


.execution-btn{

    padding:7px 14px;

    border:1px solid var(--orange);

    border-radius:9px;

    background:var(--orange);

    color:white;

    font-size:12px;

    font-weight:750;

    cursor:pointer;

    transition:.15s ease;

}


.execution-btn:hover{

    opacity:.85;

}


.execution-btn:disabled{

    opacity:.45;

    cursor:not-allowed;

}


/* ===========================================
   RESPONSIVE
=========================================== */

@media(max-width:1000px){

    .execution-summary-grid{

        grid-template-columns:1fr;

    }

    .execution-metric-grid{

        grid-template-columns:repeat(2,1fr);

    }

    .execution-form-grid{

        grid-template-columns:1fr;

    }

}

@media(max-width:700px){

    .execution-metric-grid{

        grid-template-columns:1fr;

    }

}


/* ===========================================
   PHASE 2 MEDIA (photos/videos captured during Job Execution)
   Same visual language as the Sales Survey's own media picker/gallery
   (frontend/src/components/salesSurvey/SalesSurvey.css) - deliberately
   duplicated here under the same class names rather than cross-
   imported, so the Execution module owns its own styling and isn't
   coupled to Sales Survey's stylesheet lifecycle.
=========================================== */

.media-upload-box{

    height:auto;
    min-height:44px;
    border:1.5px dashed var(--orange);
    border-radius:10px;
    display:flex;
    align-items:center;
    padding:0 14px;
    font-size:12.5px;
    cursor:pointer;
    background:#fff;
    transition:0.2s;
    color:var(--ink);

}

.media-upload-box:hover{

    border-color:var(--orange);
    background:#fff7ed;

}

.media-container{

    display:flex;
    gap:16px;
    margin-top:14px;
    align-items:flex-start;

}

.media-selector{

    width:220px;
    display:flex;
    flex-direction:column;
    gap:6px;
    max-height:280px;
    overflow-y:auto;

}

.media-item{

    padding:7px 10px;
    border:1px solid var(--line);
    cursor:pointer;
    text-align:left;
    border-radius:8px;
    font-size:12.5px;
    background:#fff;

}

.media-item.active{

    font-weight:800;
    border-color:var(--orange);
    color:var(--orange);

}

.media-preview{

    flex:1;
    display:flex;
    justify-content:center;
    align-items:center;
    height:260px;
    border-radius:10px;
    overflow:hidden;
    background:#f8fafc;
    border:1px solid var(--line);

}

.preview-image{

    max-width:400px;
    max-height:240px;
    width:auto;
    height:auto;
    object-fit:contain;
    border-radius:8px;

}

.preview-video{

    width:400px;
    height:240px;
    border-radius:8px;
    background:black;

}

.media-empty{

    display:flex;
    justify-content:center;
    align-items:center;
    height:260px;
    color:var(--muted);
    font-size:12.5px;

}


/* ===========================================
   PHASE 2 SLUDGE LOG (Flow Meter / Sample Collection daily tracking)
=========================================== */

.sludge-log-day-list{

    display:flex;
    flex-wrap:wrap;
    gap:8px;

}

.sludge-log-day-row{

    display:flex;
    flex-direction:column;
    gap:4px;
    padding:8px 12px;
    border:1.5px solid var(--line);
    border-radius:10px;
    background:white;
    cursor:pointer;
    font-size:11.5px;
    font-weight:700;
    color:var(--ink);
    text-align:left;
    min-width:120px;

}

.sludge-log-day-row.active{

    border-color:var(--orange);
    box-shadow:0 0 0 2px rgba(249,115,22,.15);

}

.sludge-log-status-pill{

    display:inline-block;
    padding:2px 8px;
    border-radius:999px;
    font-size:10.5px;
    font-weight:800;
    width:fit-content;

}

.sludge-log-status-pill.complete{

    background:#dcfce7;
    color:#166534;

}

.sludge-log-status-pill.pending{

    background:#fef3c7;
    color:#92400e;

}

.sludge-log-status-pill.invalid{

    background:#fee2e2;
    color:#991b1b;

}

.sludge-log-breakdown{

    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
    gap:10px;
    margin-top:14px;
    padding:12px;
    background:#f8fafc;
    border-radius:10px;

}

.sludge-log-breakdown div{

    display:flex;
    flex-direction:column;
    gap:2px;

}

.sludge-log-breakdown span{

    font-size:10.5px;
    font-weight:700;
    color:var(--muted);

}

.sludge-log-breakdown strong{

    font-size:13px;
    color:var(--ink);

}

.sludge-log-readings-table{

    width:100%;
    border-collapse:collapse;
    font-size:11.5px;

}

.sludge-log-readings-table th,
.sludge-log-readings-table td{

    padding:6px 8px;
    border-bottom:1px solid var(--line);
    text-align:left;
    white-space:nowrap;

}

.sludge-log-readings-table th{

    color:var(--muted);
    font-weight:800;
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:.03em;

}
=== END ORIGINAL FILE: frontend/src/components/execution/Execution.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/workspace/SurveySummary.css ===
/* ====================================
   SURVEY TAB
   Visual language ported from the RAAS DOS
   HTML wireframe (RAAS_DOS_Final_Demo.html)
==================================== */

.survey-summary-grid{
    display:grid;

    /* minmax(0, 1fr) rather than plain 1fr - a plain 1fr track still
       respects its content's intrinsic min-width, so a wide table in
       one card (e.g. Machine Scoring, Deployment Plan) can force that
       track wide and starve the others unevenly. minmax(0, 1fr) makes
       all three tracks truly equal regardless of content. */
    grid-template-columns:repeat(3, minmax(0, 1fr));

    gap:14px;
    margin-top:16px;
}

@media (max-width:1100px){
    .survey-summary-grid{
        grid-template-columns:repeat(2, minmax(0, 1fr));
    }
}

@media (max-width:720px){
    .survey-summary-grid{
        grid-template-columns:minmax(0, 1fr);
    }
}

.survey-summary-card{
    background:#ffffff;
    border:1px solid #e5e7eb;
    border-radius:14px;
    padding:16px;
    box-shadow:0 4px 14px rgba(17,24,39,.04);

    /* Belt-and-braces alongside minmax(0,1fr) above: any table that's
       still wider than its card scrolls internally instead of
       distorting the grid's column widths. */
    overflow-x:auto;
}

/* Algorithm Recommendation | Deployment Plan sit side by side,
   matching the wireframe's "grid cols2" (roughly 2:1 here, using
   our existing 3-column grid rather than a separate nested grid). */
.ops-recommendation-card{
    grid-column:span 2;
}

.ops-deployment-card{
    grid-column:span 1;
}

/* Ops Review Decision | Mid-job Amendment sit side by side too,
   same 2:1 split, instead of Decision spanning full width alone
   with a large empty gap next to its button row. */
.ops-decision-card{
    grid-column:span 2;
}

.ops-amendment-card{
    grid-column:span 1;
}

@media (max-width:1100px){
    .ops-recommendation-card,
    .ops-deployment-card,
    .ops-decision-card,
    .ops-amendment-card{
        grid-column:1 / -1;
    }
}

/* Quote & Commercial tab - true 50/50 split, matching the
   wireframe's "grid cols2" (unlike Ops Review's 2:1 split above). */
.quote-commercial-grid{
    display:grid;
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:14px;
    margin-top:16px;
}

@media (max-width:900px){
    .quote-commercial-grid{
        grid-template-columns:minmax(0, 1fr);
    }
}

.ops-subheading{
    margin:16px 0 8px;
    font-size:12px;
    font-weight:800;
    color:#374151;
    text-transform:uppercase;
    letter-spacing:.03em;
}

/* The recommendation card is full-width, so its plain fieldRows
   would otherwise stretch into very wide, sparse single-column
   rows. Pack them 2-up instead, closer to the wireframe's density. */
.ops-recommendation-card > .survey-summary-body{
    display:grid;
    grid-template-columns:repeat(2, 1fr);
    column-gap:32px;
}

@media (max-width:720px){
    .ops-recommendation-card > .survey-summary-body{
        grid-template-columns:1fr;
    }
}

.survey-summary-title{
    margin:0 0 12px;
    font-size:14.5px;
    font-weight:800;
    color:#111827;
}

.survey-summary-body{
    display:flex;
    flex-direction:column;
}

.survey-summary-row{
    display:flex;
    justify-content:space-between;
    gap:10px;
    padding:6px 0;
    border-bottom:1px dashed #e5e7eb;
    font-size:12.5px;
}

.survey-summary-row:last-child{
    border-bottom:none;
}

.survey-summary-label{
    color:#374151;
}

.survey-summary-value{
    text-align:right;
    color:#111827;
    font-weight:800;
    word-break:break-word;
    max-width:55%;
}

.survey-empty{
    color:#9ca3af;
}

/* A real, actionable error (e.g. a fleet booking rejected for a date
   clash) - deliberately NOT survey-empty's muted gray, which reads as
   a benign "nothing here yet" placeholder and let a genuine rejection
   message (e.g. "FU-019 is already scheduled until 2026-09-01.") go
   unnoticed. Matches the app's established inline-error color
   (#991b1b) already used for this exact kind of message elsewhere
   (e.g. FleetReadiness.jsx's own reschedule-conflict error). */
.survey-error{
    color:#991b1b;
    font-weight:700;
    background:#fef2f2;
    border:1px solid #fecaca;
    border-radius:6px;
    padding:8px 10px;
}

.survey-actions{
    display:flex;
    flex-wrap:wrap;
    align-items:center;
    gap:8px;
    margin-top:4px;
}

.survey-reminder-status{
    display:flex;
    align-items:center;
    gap:8px;
    font-size:11.5px;
    font-weight:650;
    color:#374151;
    background:#f9fafb;
    border:1px solid #e5e7eb;
    border-radius:9px;
    padding:6px 10px;
}

.survey-action-button{
    border:1px solid #e5e7eb;
    background:#fff;
    border-radius:9px;
    padding:7px 14px;
    font-size:12px;
    font-weight:750;
    color:#374151;
    cursor:pointer;
    transition:.15s;
}

.survey-action-button:hover{
    opacity:.85;
}

/* "Fill / Edit Survey" — matches wireframe .btn.primary */
.survey-action-button:not(.survey-create-button):not(.survey-action-button-orange):not(.survey-action-button-danger){
    background:#f58220;
    border-color:#f58220;
    color:#fff;
}

/* "Create Survey" — neutral/ghost */
.survey-create-button{
    background:#fff;
    border-color:#e5e7eb;
    color:#374151;
}

/* "Request Ops Review" — matches wireframe .btn.ok */
.survey-action-button-orange{
    background:#dcfce7;
    border-color:#bbf7d0;
    color:#166534;
}

/* "Save override" — matches wireframe .btn.danger */
.survey-action-button-danger{
    background:#fee2e2;
    border-color:#fecaca;
    color:#991b1b;
}

.survey-action-button:disabled{
    opacity:.5;
    cursor:not-allowed;
}


/* ====================================
   MACHINE SCORING TABLE
   (matches wireframe table styling)
==================================== */

.ops-scoring-table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    font-size:12.5px;
}

.ops-scoring-table th,
.ops-scoring-table td{
    text-align:left;
    border-bottom:1px solid #e5e7eb;
    padding:8px 9px;
    vertical-align:top;
}

.ops-scoring-table th{
    color:#475569;
    background:#f8fafc;
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:.03em;
    font-weight:800;
}

.ops-scoring-table tr:hover td{
    background:#fffaf3;
}

.ops-scoring-table tr.ops-scoring-top td{
    background:#fff7ed;
}


/* ====================================
   OVERRIDE FORM
==================================== */

.ops-override-form{
    display:flex;
    flex-direction:column;
    gap:8px;
    max-width:480px;
}

.ops-override-form select,
.ops-override-form input{
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:7px 8px;
    font-size:12.5px;
    font-family:inherit;
}

.ops-override-form button{
    align-self:flex-start;
}


/* ====================================
   DEPLOYMENT PLAN
==================================== */

.ops-days-grid{
    display:grid;
    grid-template-columns:repeat(4, 1fr);
    gap:10px;
    margin-top:4px;
}

.ops-days-grid label{
    display:flex;
    flex-direction:column;
    gap:4px;
    font-size:11px;
    font-weight:800;
    color:#475569;
    text-transform:uppercase;
    letter-spacing:.02em;
}

.ops-days-grid input,
.ops-days-grid select{
    border:1px solid #e5e7eb;
    border-radius:8px;
    padding:7px 8px;
    font-size:12.5px;
    font-family:inherit;
    font-weight:400;
    text-transform:none;
    color:#111827;
}

.ops-plan-table{
    width:100%;
    border-collapse:separate;
    border-spacing:0;
    font-size:12.5px;
    margin-top:4px;
}

.ops-plan-table th,
.ops-plan-table td{
    text-align:left;
    border-bottom:1px solid #e5e7eb;
    padding:6px 8px;
    vertical-align:middle;
}

.ops-plan-table th{
    color:#475569;
    background:#f8fafc;
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:.03em;
    font-weight:800;
}

.ops-plan-table input,
.ops-plan-table select{
    width:100%;
    border:1px solid #e5e7eb;
    border-radius:6px;
    padding:5px 6px;
    font-size:12.5px;
    font-family:inherit;
}

.ops-row-remove{
    border:none;
    background:transparent;
    color:#991b1b;
    font-size:16px;
    line-height:1;
    cursor:pointer;
    padding:2px 6px;
}


/* ====================================
   SURVEY MEDIA CARD
==================================== */

.survey-media-grid{
    display:grid;
    grid-template-columns:repeat(auto-fill, minmax(70px, 1fr));
    gap:8px;
    margin-top:4px;
}

.survey-media-thumb{
    display:block;
    aspect-ratio:1;
    border-radius:8px;
    overflow:hidden;
    border:1px solid #e5e7eb;
}

.survey-media-thumb img{
    width:100%;
    height:100%;
    object-fit:cover;
    display:block;
}

.survey-media-list{
    list-style:none;
    margin:4px 0 0;
    padding:0;
    display:flex;
    flex-direction:column;
    gap:6px;
}

.survey-media-list li{
    font-size:12.5px;
}

.survey-media-list a,
.survey-media-thumb{
    color:#f58220;
    text-decoration:none;
    font-weight:750;
}

.survey-media-thumb-wrap{
    position:relative;
}

.survey-media-thumb-wrap .survey-media-thumb{
    width:100%;
}

.survey-media-list-row{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:8px;
}

.survey-media-download-btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    width:22px;
    height:22px;
    padding:0;
    border:1px solid #e5e7eb;
    border-radius:6px;
    background:#fff;
    color:#f58220;
    cursor:pointer;
    flex-shrink:0;
}

.survey-media-download-btn:hover{
    background:#fff4ea;
    border-color:#f58220;
}

.survey-media-download-btn:disabled{
    opacity:0.5;
    cursor:default;
}

.survey-media-thumb-wrap .survey-media-download-btn{
    position:absolute;
    bottom:4px;
    right:4px;
    background:rgba(255,255,255,0.92);
}
=== END ORIGINAL FILE: frontend/src/components/enquiry/workspace/SurveySummary.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/quotesModule/QuotesModule.css ===
/* ===================================
   PAGE
   Standalone stylesheet at the same type scale as SalesSurvey.css /
   BusinessMasters.css / Operations.css - previously this page had no
   CSS of its own and borrowed EnquiryModuleFrontPage.css wholesale
   (34px heading, 30px card title, 999px pill tabs at 15px/700), which
   is a much larger scale than the rest of the app and not what the
   wireframe's renderQuotes() actually specifies. Deliberately kept
   fully separate from EnquiryModuleFrontPage.css (class names below
   are quotes-* not enquiry-*) so the Enquiry list page is untouched.
=================================== */

.quotes-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   HEADER
=================================== */

.quotes-header{

margin-bottom:14px;

}


.quotes-header-title{

font-size:21px;

font-weight:800;

color:var(--ink);

margin:0 0 4px 0;

}


.quotes-header-subtitle{

font-size:13px;

color:var(--muted);

margin:0;

}


/* ===================================
   TOOLBAR
=================================== */

.quotes-toolbar{

display:flex;

align-items:center;

margin-bottom:12px;

}


.quotes-toolbar-spacer{

flex:1;

}


.quotes-export-button{

border:1px solid var(--line);

background:#fff;

color:var(--ink);

border-radius:9px;

padding:7px 14px;

font-size:12px;

font-weight:750;

cursor:pointer;

transition:.15s;

}


.quotes-export-button:hover{

background:#f8fafc;

}


.quotes-export-button:disabled{

opacity:.6;

cursor:default;

}


/* ===================================
   STATUS TABS
=================================== */

.quotes-status-tabs{

display:flex;

gap:8px;

margin-bottom:12px;

}


.quotes-status-tab{

border:1px solid var(--line);

background:#fff;

color:#374151;

border-radius:999px;

padding:6px 14px;

font-size:12px;

font-weight:800;

cursor:pointer;

transition:.15s;

}


.quotes-status-tab.active{

background:var(--deep);

border-color:var(--deep);

color:#fff;

}


/* ===================================
   SEARCH BAR
=================================== */

.quotes-search-bar{

margin-bottom:14px;

}


.quotes-search-input{

width:100%;

max-width:420px;

border:1.5px solid var(--ink);

border-radius:8px;

padding:7px 10px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


.quotes-search-input:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   CARD / TABLE
=================================== */

.quotes-card{

width:100%;

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

margin-bottom:14px;

}


.quotes-table{

width:100%;

overflow-x:auto;

}


.quotes-table table{

width:100%;

border-collapse:collapse;

}


.quotes-table th{

text-align:left;

font-size:10.5px;

font-weight:800;

text-transform:uppercase;

letter-spacing:.03em;

color:#475569;

background:#f8fafc;

padding:8px 10px;

border-bottom:1px solid var(--line);

}


.quotes-table td{

font-size:12.5px;

color:var(--ink);

padding:9px 10px;

border-bottom:1px solid var(--line);

}


.quotes-table tr:last-child td{

border-bottom:none;

}


.quotes-loading,

.quotes-error,

.quotes-empty{

font-size:12.5px;

color:var(--muted);

padding:10px 0;

}


.quotes-error{

color:#b91c1c;

}


/* ===================================
   STATUS PILLS
   Matches the wireframe's own .pill / pillFor() exactly (padding
   3px 10px, 11px/800, NOT uppercase - the Enquiry list's .enquiry-
   status class this was based on before is a different, larger
   convention and isn't what the wireframe actually uses here).
=================================== */

.quotes-status{

display:inline-flex;

align-items:center;

border-radius:999px;

padding:3px 10px;

font-size:11px;

font-weight:800;

border:1px solid var(--line);

background:#fff;

white-space:nowrap;

}


.quotes-status-approved{

color:#166534;

background:#dcfce7;

border-color:#bbf7d0;

}


.quotes-status-rejected{

color:#991b1b;

background:#fee2e2;

border-color:#fecaca;

}


.quotes-status-revision{

color:#92400e;

background:#fef3c7;

border-color:#fde68a;

}


.quotes-status-default{

color:#475569;

background:#f1f5f9;

}


/* ===================================
   ROW ACTION
   Matches the wireframe's .backlink exactly - a plain bold orange
   text link ("Open →"), not a bordered/filled button.
=================================== */

.quotes-open-btn{

background:none;

border:none;

padding:0;

font-size:12px;

font-weight:800;

color:var(--orange);

cursor:pointer;

}


.quotes-open-btn:hover{

text-decoration:underline;

}


/* ===================================
   PAGINATION
   Matches the wireframe's .pager + .btn.xs exactly (left-aligned,
   not centered; small 4px 8px / 11px buttons).
=================================== */

.quotes-pagination{

display:flex;

align-items:center;

gap:10px;

margin-top:10px;

font-size:12px;

}


.quotes-pagination-button{

border:1px solid var(--line);

background:#fff;

color:#374151;

border-radius:9px;

padding:4px 8px;

font-size:11px;

font-weight:750;

cursor:pointer;

}


.quotes-pagination-button:disabled{

opacity:.4;

cursor:not-allowed;

}


.quotes-pagination-info{

font-size:12px;

color:var(--muted);

}
=== END ORIGINAL FILE: frontend/src/components/quotesModule/QuotesModule.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/Administration/administration.css ===
/* ==========================================================
   ROOT
========================================================== */

:root{

    --orange:#f58220;

    --deep:#12151c;

    --bg:#f5f6fa;

    --line:#e5e7eb;

    --text:#1f2937;

    --muted:#6b7280;

    --green:#16a34a;

    --green-bg:#dcfce7;

    --green-border:#bbf7d0;

    --red:#dc2626;

}


/* ==========================================================
   PAGE
========================================================== */

.administration-page{

    width:100%;

    min-height:100vh;

    padding:42px 48px;

    background:var(--bg);

}


/* ==========================================================
   HEADER
========================================================== */

.administration-header{

    margin-bottom:22px;

}

.administration-header h1{

    margin:0;

    font-size:34px;

    font-weight:800;

    color:var(--text);

    line-height:1.05;

}

.administration-header p{

    margin:10px 0 0;

    color:var(--muted);

    font-size:18px;

}


/* ==========================================================
   TABS
========================================================== */

.administration-tabs{

    display:flex;

    gap:12px;

    margin-bottom:26px;

}

.administration-tab{

    border:1px solid #d8dde8;

    background:white;

    color:#334155;

    border-radius:999px;

    padding:11px 24px;

    cursor:pointer;

    font-size:17px;

    font-weight:700;

    transition:.2s;

}

.administration-tab:hover{

    background:#fafafa;

}

.administration-tab.active{

    background:var(--deep);

    color:white;

    border-color:var(--deep);

}


/* ==========================================================
   CARD
========================================================== */

.administration-card{

    background:white;

    border:1px solid var(--line);

    border-radius:20px;

    padding:22px;

    box-shadow:0 5px 18px rgba(17,24,39,.06);

}

.administration-card-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

.administration-card-title{

    font-size:30px;

    font-weight:800;

    color:var(--text);

}


/* ==========================================================
   ADD BUTTON
========================================================== */

.administration-add-button{

    border:none;

    background:var(--orange);

    color:white;

    border-radius:999px;

    padding:10px 22px;

    font-size:15px;

    font-weight:700;

    cursor:pointer;

    transition:.2s;

}

.administration-add-button:hover{

    background:#df7415;

}


/* ==========================================================
   TABLE
========================================================== */

.administration-table{

    width:100%;

    border-collapse:collapse;

}

.administration-table thead{

    background:#f8fafc;

}

.administration-table th{

    padding:16px 18px;

    text-align:left;

    font-size:12px;

    text-transform:uppercase;

    letter-spacing:.04em;

    color:#475569;

    font-weight:800;

}

.administration-table td{

    padding:18px;

    font-size:15px;

    color:var(--text);

    border-top:1px solid #edf1f5;

    vertical-align:middle;

}

.administration-table tbody tr{

    transition:.15s;

}

.administration-table tbody tr:hover{

    background:#fffaf3;

}


/* ==========================================================
   STATUS
========================================================== */

.administration-status{

    display:inline-flex;

    align-items:center;

    justify-content:center;

    padding:5px 14px;

    border-radius:999px;

    background:var(--green-bg);

    border:1px solid var(--green-border);

    color:#166534;

    font-weight:700;

    font-size:13px;

}


/* ==========================================================
   ACTIONS
========================================================== */

.administration-actions{

    display:flex;

    gap:10px;

    align-items:center;

}

.administration-edit{

    border:none;

    background:none;

    color:var(--orange);

    font-weight:700;

    cursor:pointer;

    font-size:14px;

}

.administration-edit:hover{

    text-decoration:underline;

}

.administration-delete{

    border:none;

    background:none;

    color:var(--red);

    font-weight:700;

    cursor:pointer;

    font-size:14px;

}

.administration-delete:hover{

    text-decoration:underline;

}


/* ==========================================================
   EMPTY / LOADING
========================================================== */

.administration-empty{

    padding:40px;

    text-align:center;

    color:var(--muted);

    font-size:16px;

}


/* ==========================================================
   DIALOG
========================================================== */

.administration-dialog-overlay{

    position:fixed;

    inset:0;

    background:rgba(0,0,0,.45);

    display:flex;

    justify-content:center;

    align-items:center;

    z-index:999;

}

.administration-dialog{

    width:640px;

    max-width:95%;

    background:white;

    border-radius:18px;

    padding:28px;

    box-shadow:0 18px 45px rgba(0,0,0,.25);

}

.administration-dialog h2{

    margin:0 0 22px;

    font-size:26px;

    font-weight:800;

}

.administration-form{

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:18px;

}

.administration-form-group{

    display:flex;

    flex-direction:column;

}

.administration-form-group.full{

    grid-column:1 / -1;

}

.administration-form-group label{

    margin-bottom:6px;

    font-size:13px;

    font-weight:700;

    color:#475569;

}

.administration-form-group input,

.administration-form-group select{

    height:42px;

    border:1px solid #d9dee8;

    border-radius:8px;

    padding:0 12px;

    font-size:14px;

    outline:none;

}

.administration-form-group input:focus,

.administration-form-group select:focus{

    border-color:var(--orange);

}

.administration-dialog-footer{

    display:flex;

    justify-content:flex-end;

    gap:12px;

    margin-top:28px;

}

.administration-button{

    border:none;

    border-radius:8px;

    padding:10px 18px;

    cursor:pointer;

    font-weight:700;

}

.administration-button.primary{

    background:var(--orange);

    color:white;

}

.administration-button.secondary{

    background:#f1f5f9;

}


/* ==========================================================
   RESPONSIVE
========================================================== */

@media(max-width:900px){

    .administration-page{

        padding:24px;

    }

    .administration-header h1{

        font-size:42px;

    }

    .administration-form{

        grid-template-columns:1fr;

    }

    .administration-card{

        overflow-x:auto;

    }

    .administration-table{

        min-width:900px;

    }

}

.administration-form-grid{

    display:grid;

    grid-template-columns:1fr 1fr;

    gap:22px;

    margin-top:18px;

}

.administration-form-group{

    display:flex;

    flex-direction:column;

}

.administration-form-group label{

    font-size:15px;

    font-weight:700;

    color:#475569;

    margin-bottom:8px;

}

.administration-form-group input,

.administration-form-group select{

    height:36px;

    border:1px solid #d9dee8;

    border-radius:12px;

    padding:0 16px;

    font-size:16px;

    outline:none;

}

.administration-form-group input:focus,

.administration-form-group select:focus{

    border-color:var(--orange);

}

.administration-user-checkbox{

    margin-top:22px;

}

.administration-user-actions{

    display:flex;

    justify-content:flex-end;

    gap:14px;

    margin-top:30px;

}
=== END ORIGINAL FILE: frontend/src/components/Administration/administration.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/auditTrail/AuditTrail.css ===
/* ===================================
   PAGE
   Standalone stylesheet at the same type scale as QuotesModule.css /
   BusinessMasters.css - mirrors the wireframe's renderAudit() (Case,
   Customer, Module, Field, From, To, By, Date columns; Reason is
   dropped - see plan notes) at the app's established scale.
=================================== */

.audit-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   HEADER
=================================== */

.audit-title-row{

display:flex;

justify-content:space-between;

align-items:flex-start;

gap:16px;

margin-bottom:16px;

flex-wrap:wrap;

}

.audit-header-title{

font-size:21px;

font-weight:800;

color:var(--ink);

margin:0 0 4px 0;

}

.audit-header-subtitle{

font-size:13px;

color:var(--muted);

margin:0;

}

.audit-export-button{

border:1px solid var(--line);

background:#fff;

color:var(--ink);

border-radius:9px;

padding:7px 14px;

font-size:12px;

font-weight:750;

cursor:pointer;

transition:.15s;

white-space:nowrap;

}

.audit-export-button:hover{

background:var(--bg);

}

.audit-export-button:disabled{

opacity:.55;

cursor:not-allowed;

}


/* ===================================
   FILTER BAR (date range only, per plan)
=================================== */

.audit-filterbar{

display:flex;

gap:10px;

align-items:center;

margin-bottom:12px;

flex-wrap:wrap;

}

.audit-filterbar label{

font-size:11px;

font-weight:800;

color:var(--muted);

}

.audit-filterbar input{

height:32px;

padding:0 10px;

border:1.5px solid var(--line);

border-radius:8px;

font-size:12.5px;

color:var(--ink);

}

.audit-filterbar button{

height:32px;

padding:0 14px;

border:1px solid var(--line);

border-radius:8px;

background:#fff;

color:var(--ink);

font-size:12px;

font-weight:750;

cursor:pointer;

}

.audit-filterbar button:hover{

background:var(--bg);

}


/* ===================================
   TABLE CARD
=================================== */

.audit-card{

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

overflow-x:auto;

}

.audit-table{

width:100%;

border-collapse:separate;

border-spacing:0;

}

.audit-table th,
.audit-table td{

text-align:left;

border-bottom:1px solid var(--line);

padding:8px 9px;

font-size:12.5px;

vertical-align:top;

white-space:nowrap;

}

.audit-table th{

font-size:11px;

font-weight:800;

color:var(--muted);

text-transform:uppercase;

letter-spacing:.03em;

}

.audit-table td.audit-old{

color:#991b1b;

text-decoration:line-through;

background:#fef2f2;

}

.audit-table td.audit-new{

color:#166534;

font-weight:700;

background:#f0fdf4;

}

.audit-backlink{

font-size:12px;

font-weight:800;

color:var(--orange);

cursor:pointer;

background:none;

border:none;

padding:0;

}

.audit-muted{

color:var(--muted);

}

.audit-empty-row td{

text-align:center;

padding:30px;

color:var(--muted);

font-weight:600;

}
=== END ORIGINAL FILE: frontend/src/components/auditTrail/AuditTrail.css ===

=== BEGIN ORIGINAL FILE: frontend/src/pages/InvoiceDashboard.jsx ===
import { useEffect, useState } from "react";

import "../components/dashboard/overview/DashboardOverview.css";
import "../components/businessMasters/BusinessMasters.css";

import { getInvoiceDashboardKpi } from "../services/invoiceDashboardService";

import RevenueTab from "../components/invoiceDashboard/RevenueTab";
import DeploymentTab from "../components/invoiceDashboard/DeploymentTab";


function inr(value){
    if(value===null || value===undefined) return "-";
    return "Rs " + Math.round(value).toLocaleString("en-IN");
}


// ====================================
// INVOICE DASHBOARD
// Everything but Total PO revenue is resolved by walking the real
// Enquiry -> Invoice -> Execution -> machine reference chain (Phase 39) -
// no parallel lookups anywhere in this module.
// ====================================

export default function InvoiceDashboard(){

    const [kpi, setKpi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("revenue");

    useEffect(()=>{

        (async ()=>{
            setLoading(true);
            const data = await getInvoiceDashboardKpi();
            setKpi(data);
            setLoading(false);
        })();

    }, []);

    const tiles = kpi ? [
        { title: "Total PO Revenue", value: inr(kpi.total_po_revenue) },
        { title: "Expected Invoice Revenue", value: inr(kpi.expected_invoice_revenue) },
        { title: "Collected Invoice Revenue", value: inr(kpi.collected_invoice_revenue) },
        { title: "Total Machines", value: kpi.total_machines },
        { title: "Deployed Machines", value: kpi.deployed_machines }
    ] : [];

    return(

        <div className="ovw-page">

            <div className="ovw-title">
                <div>
                    <h1>Invoice Dashboard</h1>
                    <p>Revenue and machine deployment, resolved live from the real job/execution reference chain.</p>
                </div>
            </div>

            {loading ? (
                <p className="bm-muted">Loading...</p>
            ) : (
                <div className="ovw-grid-6" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
                    {tiles.map(tile=>(
                        <div className="ovw-kpi" key={tile.title}>
                            <b>{tile.value}</b>
                            <span>{tile.title}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="bm-tabs" style={{margin:"16px 0"}}>
                <button
                    className={activeTab==="revenue" ? "active" : ""}
                    onClick={()=>setActiveTab("revenue")}
                >
                    Revenue
                </button>
                <button
                    className={activeTab==="deployment" ? "active" : ""}
                    onClick={()=>setActiveTab("deployment")}
                >
                    Deployment
                </button>
            </div>

            {activeTab==="revenue" ? <RevenueTab/> : <DeploymentTab/>}

        </div>

    );

}
=== END ORIGINAL FILE: frontend/src/pages/InvoiceDashboard.jsx ===

=== BEGIN ORIGINAL FILE: frontend/src/components/enquiry/EnquiryModuleFrontPage.css ===
/* ==========================================================
   ROOT
========================================================== */

:root{

    --enquiry-orange:#f58220;

    --enquiry-deep:#12151c;

    --enquiry-background:#f5f6fa;

    --enquiry-line:#e5e7eb;

    --enquiry-text:#1f2937;

    --enquiry-muted:#6b7280;

    --enquiry-green:#16a34a;

    --enquiry-green-bg:#dcfce7;

    --enquiry-green-border:#bbf7d0;

    --enquiry-red:#dc2626;

    --enquiry-red-bg:#fee2e2;

    --enquiry-red-border:#fecaca;

    --enquiry-blue:#2563eb;

    --enquiry-blue-bg:#dbeafe;

    --enquiry-blue-border:#bfdbfe;

    --enquiry-purple:#7c3aed;

    --enquiry-purple-bg:#ede9fe;

    --enquiry-purple-border:#ddd6fe;

    --enquiry-grey-bg:#f3f4f6;

}


/* ==========================================================
   MODULE
========================================================== */

.enquiry-module-front-page{

    width:100%;

    min-height:100vh;

    padding:42px 48px;

    background:var(--enquiry-background);

    box-sizing:border-box;

}


/* ==========================================================
   HEADER
========================================================== */

.enquiry-header{

    margin-bottom:22px;

}

.enquiry-header-title{

    margin:0;

    font-size:34px;

    font-weight:800;

    color:var(--enquiry-text);

    line-height:1.05;

}

.enquiry-header-subtitle{

    margin:10px 0 0;

    color:var(--enquiry-muted);

    font-size:18px;

}


/* ==========================================================
   STATUS TABS
========================================================== */

.enquiry-status-tabs{

    display:flex;

    gap:12px;

    flex-wrap:wrap;

    margin-bottom:26px;

}

.enquiry-status-tab{

    border:1px solid #d8dde8;

    background:white;

    color:#334155;

    border-radius:999px;

    padding:11px 24px;

    cursor:pointer;

    font-size:15px;

    font-weight:700;

    transition:.2s;

}

.enquiry-status-tab:hover{

    background:#fafafa;

}

.enquiry-status-tab.active{

    background:var(--enquiry-deep);

    color:white;

    border-color:var(--enquiry-deep);

}


/* ==========================================================
   SEARCH
========================================================== */

.enquiry-search-bar{

    display:flex;

    justify-content:flex-start;

    align-items:center;

    margin-bottom:22px;

}

.enquiry-search-input{

    width:420px;

    max-width:100%;

    height:42px;

    border:1px solid #d9dee8;

    border-radius:12px;

    background:white;

    padding:0 16px;

    font-size:15px;

    outline:none;

    transition:.2s;

}

.enquiry-search-input:focus{

    border-color:var(--enquiry-orange);

}


/* ==========================================================
   CARD
========================================================== */

.enquiry-card{

    background:white;

    border:1px solid var(--enquiry-line);

    border-radius:20px;

    padding:22px;

    box-shadow:0 5px 18px rgba(17,24,39,.06);

}

.enquiry-card-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

.enquiry-card-title{

    font-size:30px;

    font-weight:800;

    color:var(--enquiry-text);

}


/* ==========================================================
   TABLE WRAPPER
========================================================== */

.enquiry-table{

    width:100%;

    overflow-x:auto;

    /* table-layout:fixed makes the <colgroup> percentages in
       EnquiryTable.jsx authoritative - without it, the browser's
       default auto layout still expands a column past its given
       width to fit its longest unbroken content (e.g. a Job On value
       with no wrap points), forcing the whole table wider than its
       container and triggering exactly the horizontal scroll this
       is meant to avoid. Long values wrap within their fixed column
       instead (see the word-wrap rule on td below). */
    table-layout:fixed;

    border-collapse:collapse;

}


/* ==========================================================
   TABLE HEADER
========================================================== */

.enquiry-table thead{

    background:#f8fafc;

}

.enquiry-table th{

    padding:16px 12px;

    text-align:left;

    font-size:12px;

    text-transform:uppercase;

    letter-spacing:.04em;

    color:#475569;

    /* Narrower columns (Enquiry ID, Aging, Owner, Created) can't fit
       their header label on one line under table-layout:fixed - by
       default an overflowing header just visually bleeds into the
       next column's space instead of wrapping, reading as garbled
       overlapping text. Wrapping (and allowing a mid-word break as a
       last resort) keeps each header cleanly inside its own column. */
    overflow-wrap:break-word;

    font-weight:800;

}


/* ==========================================================
   TABLE BODY
========================================================== */

.enquiry-table td{

    padding:18px;

    font-size:15px;

    color:var(--enquiry-text);

    border-top:1px solid #edf1f5;

    vertical-align:middle;

    /* table-layout:fixed above makes column widths strict - long
       unbroken values (a combined Job On string, a long customer
       name) must wrap within that fixed width rather than forcing
       the column, and therefore the table, wider. */
    overflow-wrap:break-word;

}

.enquiry-table tbody tr{

    transition:.15s;

}

.enquiry-table tbody tr:hover{

    background:#fffaf3;

}

/* ==========================================================
   STATUS BADGES
========================================================== */

.enquiry-status{

    display:inline-flex;

    align-items:center;

    justify-content:center;

    padding:5px 14px;

    border-radius:999px;

    font-size:13px;

    font-weight:700;

    border:1px solid transparent;

    text-transform:uppercase;

}

.enquiry-status-open{

    background:var(--enquiry-green-bg);

    border-color:var(--enquiry-green-border);

    color:#166534;

}

.enquiry-status-closed{

    background:var(--enquiry-blue-bg);

    border-color:var(--enquiry-blue-border);

    color:#1d4ed8;

}

.enquiry-status-lost{

    background:var(--enquiry-red-bg);

    border-color:var(--enquiry-red-border);

    color:#b91c1c;

}

.enquiry-status-archived{

    background:var(--enquiry-grey-bg);

    border:1px solid #d1d5db;

    color:#4b5563;

}


/* ==========================================================
   ACTIONS
========================================================== */

.enquiry-actions{

    display:flex;

    align-items:center;

    gap:5px;

    /* Wraps onto a second line within the cell rather than forcing
       the column (and, under table-layout:fixed, the whole table)
       wider than its allotted percentage - a taller row is fine,
       horizontal overflow isn't. */
    flex-wrap:wrap;

}

.enquiry-action-wrap{

    position:relative;

    display:inline-flex;

}

.enquiry-actions button{

    display:flex;

    align-items:center;

    justify-content:center;

    width:28px;

    height:28px;

    border:1px solid transparent;

    border-radius:7px;

    background:transparent;

    cursor:pointer;

    transition:.15s ease;

}

.enquiry-actions button:hover{

    filter:brightness(0.92);

    transform:translateY(-1px);

}

.enquiry-actions button:active{

    transform:translateY(0);

}

.enquiry-edit{

    color:#b45309;

    background:rgba(180,83,9,.08);

    border-color:rgba(180,83,9,.16);

}

.enquiry-view{

    color:var(--enquiry-blue);

    background:rgba(37,99,235,.08);

    border-color:rgba(37,99,235,.16);

}

.enquiry-archive{

    color:var(--enquiry-purple);

    background:rgba(124,58,237,.08);

    border-color:rgba(124,58,237,.16);

}

.enquiry-restore{

    color:var(--enquiry-green);

    background:rgba(22,163,74,.08);

    border-color:rgba(22,163,74,.16);

}

.enquiry-lost{

    color:#ea580c;

    background:rgba(234,88,12,.08);

    border-color:rgba(234,88,12,.16);

}

.enquiry-close{

    color:#0891b2;

    background:rgba(8,145,178,.08);

    border-color:rgba(8,145,178,.16);

}

.enquiry-delete{

    color:var(--enquiry-red);

    background:rgba(220,38,38,.08);

    border-color:rgba(220,38,38,.16);

}


/* ==========================================================
   ACTION TOOLTIP
   Custom tooltip, not the native `title` attribute - browser-native
   tooltips have an inconsistent OS-controlled delay/position, this
   shows immediately and consistently on hover instead.
========================================================== */

.enquiry-action-tooltip{

    position:absolute;

    bottom:calc(100% + 6px);

    left:50%;

    transform:translateX(-50%) translateY(2px);

    background:var(--ink, #1f2937);

    color:#fff;

    font-size:11px;

    font-weight:600;

    line-height:1;

    white-space:nowrap;

    padding:5px 8px;

    border-radius:5px;

    opacity:0;

    pointer-events:none;

    transition:opacity .12s ease, transform .12s ease;

    z-index:20;

    box-shadow:0 4px 10px rgba(17,24,39,.18);

}

.enquiry-action-wrap:hover .enquiry-action-tooltip{

    opacity:1;

    transform:translateX(-50%) translateY(0);

}


/* ==========================================================
   LOADING / EMPTY / ERROR
========================================================== */

.enquiry-loading,

.enquiry-empty,

.enquiry-error{

    padding:40px;

    text-align:center;

    font-size:16px;

    font-weight:600;

    color:var(--enquiry-muted);

}

.enquiry-error{

    color:var(--enquiry-red);

}


/* ==========================================================
   PAGINATION
========================================================== */

.enquiry-pagination{

    display:flex;


    align-items:center;

    margin-top:8px;

    gap:15px;

    flex-wrap:wrap;

}

.enquiry-pagination-info{

    color:var(--enquiry-muted);

    font-size:15px;

    font-weight:600;

}

.enquiry-pagination-button{

    border:none;

    border-radius:999px;

    background:var(--enquiry-orange);

    color:white;

    padding:10px 22px;

    cursor:pointer;

    font-size:15px;

    font-weight:700;

    transition:.2s;

}

.enquiry-pagination-button:hover:not(:disabled){

    background:#df7415;

}

.enquiry-pagination-button:disabled{

    background:#cbd5e1;

    cursor:not-allowed;

}


/* ==========================================================
   TABLE UTILITIES
========================================================== */

.enquiry-table td:first-child{

    font-weight:700;

}

.enquiry-table td:nth-child(2){

    font-weight:600;

}

/* min-width removed - the Actions column's width now comes solely
   from EnquiryTable.jsx's <colgroup> under table-layout:fixed; a
   min-width here would fight that and could force the table wider
   than its container again. .enquiry-actions wraps its buttons onto
   a second line instead if the column is ever too narrow for all of
   them on one row. */


/* ==========================================================
   SCROLLBAR
========================================================== */

.enquiry-table::-webkit-scrollbar{

    height:8px;

}

.enquiry-table::-webkit-scrollbar-thumb{

    background:#d4d8e0;

    border-radius:999px;

}

.enquiry-table::-webkit-scrollbar-track{

    background:transparent;

}


/* ==========================================================
   RESPONSIVE
========================================================== */

@media(max-width:900px){

    .enquiry-module-front-page{

        padding:24px;

    }

    .enquiry-header-title{

        font-size:28px;

    }

    .enquiry-search-input{

        width:100%;

    }

    .enquiry-card{

        overflow-x:auto;

    }

    .enquiry-table table{

        min-width:1200px;

    }

}

@media(max-width:768px){

    .enquiry-status-tabs{

        flex-direction:column;

        align-items:stretch;

    }

    .enquiry-status-tab{

        width:100%;

    }

    .enquiry-pagination{

        flex-direction:column;

        align-items:flex-start;

    }

}

/* ==========================================================
   TOOLBAR
========================================================== */

.enquiry-toolbar{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:18px;

}

.enquiry-toolbar-spacer{

    flex:1;

}

.enquiry-toolbar-actions{

    display:flex;

    align-items:center;

    gap:12px;

}

.enquiry-export-button{

    border:1px solid #d8dde8;

    background:white;

    color:#374151;

    border-radius:12px;

    padding:10px 18px;

    cursor:pointer;

    font-size:14px;

    font-weight:700;

    transition:.2s;

}

.enquiry-export-button:hover{

    background:#f8fafc;

}

.enquiry-new-button{

    border:none;

    background:#f58220;

    color:white;

    border-radius:12px;

    padding:10px 18px;

    cursor:pointer;

    font-size:14px;

    font-weight:700;

    transition:.2s;

}

.enquiry-new-button:hover{

    background:#df7415;

}
=== END ORIGINAL FILE: frontend/src/components/enquiry/EnquiryModuleFrontPage.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/operations/Operations.css ===
/* ===================================
   PAGE
   Resized to the same scale as SalesSurvey.css / BusinessMasters.css
   (h1 21px, card header 14.5px, field text 12.5px, buttons 12px) -
   this file previously ran on its own much larger scale (56px
   heading, 24px card headers, 18px table cells, 28px card radius),
   which is what made Ops Selector look like a different product from
   the rest of the app.
=================================== */

.ops-selector-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   PAGE HEADER
=================================== */

.ops-page-header{

margin-bottom:16px;

}


.ops-page-header h1{

font-size:21px;

font-weight:800;

color:var(--ink);

margin:0 0 6px 0;

}


.ops-page-header p{

font-size:13px;

color:var(--muted);

margin:0;

max-width:640px;

line-height:1.5;

}


/* ===================================
   GRID
=================================== */

.ops-grid{

display:grid;

grid-template-columns:repeat(2,minmax(0,1fr));

gap:14px;

margin-bottom:14px;

}


/* ===================================
   CARD
=================================== */

.ops-card{

width:100%;

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

}


.ops-header{

margin-bottom:12px;

}


.ops-header h2{

font-size:14.5px;

font-weight:800;

color:var(--ink);

margin:0;

}


/* ===================================
   TABLE
   Not a real <table> - a 3-column grid (label / value / unit) shared
   by OpsInputs, OpsDecision, and OpsDaysManpower.
=================================== */

.ops-table{

width:100%;

}


.ops-table-header{

display:grid;

grid-template-columns:1fr 1.4fr .7fr;

gap:10px;

padding:0 0 8px 0;

border-bottom:1px solid var(--line);

}


.ops-table-header > div{

font-size:10.5px;

font-weight:800;

text-transform:uppercase;

letter-spacing:.03em;

color:#475569;

}


.ops-table-row{

display:grid;

grid-template-columns:1fr 1.4fr .7fr;

gap:10px;

align-items:center;

padding:8px 0;

border-bottom:1px dashed var(--line);

}


.ops-table-row:last-child{

border-bottom:none;

}


.ops-label{

font-size:12px;

font-weight:700;

color:var(--ink);

}


.ops-value{

font-size:12.5px;

color:var(--ink);

}


.ops-unit{

font-size:11px;

color:var(--muted);

}


/* ===================================
   INPUTS
=================================== */

.ops-input,

.ops-select{

width:100%;

border:1.5px solid var(--ink);

border-radius:8px;

padding:6px 8px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


.ops-input:focus,

.ops-select:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   ACTIONS CARD
=================================== */

.ops-action-text{

font-size:12.5px;

color:var(--muted);

margin:0 0 14px 0;

line-height:1.5;

}


.ops-primary-btn,

.ops-secondary-btn{

display:block;

width:100%;

border-radius:9px;

padding:8px 16px;

font-size:12px;

font-weight:750;

cursor:pointer;

margin-bottom:10px;

border:1px solid var(--line);

}


.ops-primary-btn:last-child,

.ops-secondary-btn:last-child{

margin-bottom:0;

}


.ops-primary-btn{

background:var(--orange);

border-color:var(--orange);

color:#fff;

}


.ops-secondary-btn{

background:#fff;

color:var(--ink);

}


.ops-secondary-btn:hover{

background:#f8fafc;

}


/* ===================================
   RESPONSIVE
=================================== */

@media (max-width: 900px){

.ops-grid{

grid-template-columns:1fr;

}

}
=== END ORIGINAL FILE: frontend/src/components/operations/Operations.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/dashboard/Dashboard.css ===
/* ====================================
   PAGE
==================================== */

.dashboard-page{

    width:100%;

    min-height:100vh;

    padding:32px 40px 60px;

    background:var(--bg);


    overflow-y:auto;

}


/* ====================================
   PAGE HEADER
==================================== */

.dashboard-header{

    margin-bottom:36px;

}

.dashboard-header h1{

    margin:0;

    font-size:54px;

    font-weight:800;

    color:var(--ink);

}

.dashboard-header p{

    margin-top:10px;

    font-size:18px;

    color:var(--muted);

}


/* ====================================
   SECTION
==================================== */

.dashboard-section{

    margin-bottom:28px;

}


/* ====================================
   SECTION TITLE
==================================== */

.dashboard-section h2{

    margin:0 0 18px;

    font-size:24px;

    font-weight:800;

    color:var(--ink);

}


/* ====================================
   PLACEHOLDER CARD
==================================== */

.dashboard-placeholder{

    width:100%;

    min-height:90px;

    display:flex;

    align-items:center;

    padding:24px;

    border-radius:24px;

    background:var(--card);

    border:1px solid var(--line);

    box-shadow:0 4px 14px rgba(17,24,39,.04);

    color:#d9e4ee;

    font-size:18px;

}


/* ====================================
   RESPONSIVE
==================================== */

@media(max-width:900px){

.dashboard-page{

    padding:24px;

}

.dashboard-header h1{

    font-size:40px;

}

}

/* ====================================
   DASHBOARD STATISTICS
==================================== */

.dashboard-stats{

    display:grid;

    grid-template-columns:repeat(6,1fr);

    gap:20px;

}

.dashboard-stat-card{

    background:var(--card);

    border:1px solid var(--line);

    border-radius:24px;

    padding:24px;

    min-height:140px;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    box-shadow:0 4px 14px rgba(17,24,39,.04);

}

.dashboard-stat-value{

    font-size:46px;

    font-weight:800;

    color:var(--ink);

    margin-bottom:14px;

}

.dashboard-stat-title{

    font-size:17px;

    text-align:center;

    color:var(--ink);

    font-weight:700;

}

@media(max-width:1300px){

.dashboard-stats{

    grid-template-columns:repeat(3,1fr);

}

}

@media(max-width:768px){

.dashboard-stats{

    grid-template-columns:repeat(2,1fr);

}

}



/* ====================================
   CUSTOMER BROWSER
==================================== */

.dashboard-browser{

display:flex;

flex-direction:column;

gap:22px;

}

.dashboard-browser-top{

display:flex;

align-items:center;

gap:20px;

}

.dashboard-customer-strip{

display:flex;

gap:14px;

flex:1;

justify-content:center;

}

.dashboard-customer{

height:62px;

padding:0 28px;

border:none;

border-radius:18px;

cursor:pointer;

font-size:18px;

font-weight:700;

background:white;

color:var(--ink);

transition:.2s;

}

.dashboard-customer:hover{

transform:translateY(-2px);

}

.dashboard-customer.active{

background:var(--orange);

color:white;

}

.dashboard-nav-button{

width:64px;

height:64px;

border:none;

border-radius:18px;

background:#174d62;

color:white;

font-size:24px;

cursor:pointer;

}

.dashboard-browser-bottom select{

width:100%;

height:64px;

border-radius:18px;

padding:0 18px;

font-size:17px;

background:white;

color:var(--ink);

border:1px solid rgba(255,255,255,.12);

}

.dashboard-browser-bottom select{

    background:white;

    color:var(--ink);

}


.dashboard-dropdown-button{

width:100%;

height:64px;

border:none;

border-radius:18px;

padding:0 24px;

display:flex;

justify-content:space-between;

align-items:center;

font-size:18px;

font-weight:600;

cursor:pointer;

background:white;

color:var(--ink);

}

.dashboard-dropdown-list{

    margin-top:10px;

    max-height:320px;

    overflow-y:scroll;

    overflow-x:hidden;

    scrollbar-gutter:stable;

    border-radius:18px;

    background:white;

    border:1px solid rgba(255,255,255,.12);

}

.dashboard-dropdown-item{

padding:18px 24px;

font-size:17px;

color:var(--ink);

cursor:pointer;

transition:.15s;

}

.dashboard-dropdown-item:hover{

background:white;

}

.dashboard-dropdown-item.active{

background:#1d8a83;

font-weight:700;

}


/* ====================================
   SUMMARY CARD
==================================== */

.dashboard-summary-card{

    width:100%;

    background:var(--card);

    border:1px solid var(--line);

    border-radius:28px;

    padding:28px;

    margin-bottom:28px;

    box-shadow:0 4px 14px rgba(17,24,39,.04);

}


/* ====================================
   SUMMARY HEADER
==================================== */

.dashboard-summary-header{

    margin-bottom:24px;

}

.dashboard-summary-header h3{

    margin:0;

    font-size:26px;

    font-weight:800;

    color:var(--ink);

}


/* ====================================
   SUMMARY GRID
==================================== */

.dashboard-summary-grid{

    display:grid;

    grid-template-columns:

        repeat(
            3,
            minmax(0,1fr)
        );

    gap:22px;

}


/* ====================================
   SUMMARY ITEM
==================================== */

.dashboard-summary-item{

    display:flex;

    flex-direction:column;

    padding:18px;

    border-radius:18px;

    background:white;

    border:1px solid rgba(255,255,255,.08);

}

.dashboard-summary-item span{

    font-size:14px;

    color:var(--muted);

    margin-bottom:8px;

}

.dashboard-summary-item strong{

    font-size:18px;

    color:var(--ink);

    word-break:break-word;

}


/* ====================================
   RESPONSIVE
==================================== */

@media(max-width:1000px){

    .dashboard-summary-grid{

        grid-template-columns:

            repeat(
                2,
                1fr
            );

    }

}

@media(max-width:700px){

    .dashboard-summary-grid{

        grid-template-columns:1fr;

    }

}

/* ==================================== */
/* SURVEY BUTTONS */
/* ==================================== */

.dashboard-survey{

    min-width:96px;

    height:58px;

    border:none;

    border-radius:18px;

    background:white;

    color:var(--ink);

    font-size:18px;

    font-weight:700;

    cursor:pointer;

    transition:.2s;

}

.dashboard-survey:hover{

    background:white;

}

.dashboard-survey.active{

    background:var(--orange);

    color:white;

}

/* ====================================
PRIMARY ACTION
==================================== */

.dashboard-primary-action{

    min-width:260px;

    height:60px;

    border:none;

    border-radius:18px;

    background:var(--orange);

    color:#ffffff;

    font-size:18px;

    font-weight:700;

    cursor:pointer;

    transition:.2s;

}

.dashboard-primary-action:hover{

    transform:translateY(-2px);

}

/* ====================================
WORK QUEUE
==================================== */

.dashboard-workqueue{

    display:flex;

    flex-direction:column;

    gap:12px;

}

.dashboard-work-item{

    border:1px solid #d9d9d9;

    border-radius:12px;

    padding:16px;

    cursor:pointer;

    transition:.2s;

    background:#ffffff;

}

.dashboard-work-item:hover{

    border-color:var(--orange);

}

.dashboard-work-item.active{

    border:2px solid var(--orange);

    background:#eefcf9;

}

.dashboard-work-header{

    display:flex;

    justify-content:space-between;

    margin-bottom:10px;

}

.dashboard-work-body{

    display:flex;

    flex-direction:column;

    gap:4px;

}

.dashboard-work-footer{

    margin-top:10px;

    font-weight:600;

    color:var(--orange);

}

/* ====================================
WORKFLOW TRACKER
==================================== */

.dashboard-workflow{

display:flex;

justify-content:space-between;

align-items:center;

gap:20px;

padding:24px;

background:white;

border-radius:22px;

}

.workflow-node{

flex:1;

display:flex;

flex-direction:column;

align-items:center;

gap:10px;

opacity:.35;

}

.workflow-node.active{

opacity:1;

}

.workflow-circle{

width:22px;

height:22px;

border-radius:50%;

background:#607d8b;

}

.workflow-node.active .workflow-circle{

background:var(--orange);

box-shadow:0 0 18px var(--orange);

}

.workflow-node span{

font-size:14px;

font-weight:700;

color:var(--ink);

}


/* ====================================
WORKFLOW TRACKER
==================================== */

.workflow-card{

    width:100%;

    padding:28px;

    border-radius:24px;

    background:var(--card);

    border:1px solid var(--line);

    box-shadow:0 4px 14px rgba(17,24,39,.04);

}

.workflow-title{

    font-size:24px;

    font-weight:700;

    color:var(--ink);

    margin-bottom:28px;

}

.workflow-stage-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:12px;

    flex-wrap:wrap;

}

.workflow-stage{

    flex:1;

    min-width:120px;

    height:58px;

    display:flex;

    align-items:center;

    justify-content:center;

    border-radius:30px;

    background:white;

    border:2px solid rgba(255,255,255,.08);

    color:var(--ink);

    font-weight:700;

    position:relative;

}

.workflow-stage::after{

    content:"";

    position:absolute;

    right:-14px;

    top:50%;

    width:28px;

    height:2px;

    background:#6d8e98;

}

.workflow-stage:last-child::after{

    display:none;

}

.workflow-stage.active{

    background:var(--orange);

    border-color:var(--orange);

    color:#fff;

    box-shadow:0 0 20px rgba(42,182,168,.45);

}

.workflow-footer{

    margin-top:28px;

    color:var(--ink);

    font-size:17px;

}

.workflow-footer strong{

    margin-left:10px;

    color:var(--ink);

}

/* ====================================
   ENQUIRY SUMMARY
==================================== */

.dashboard-enquiry-table{

    width:100%;

    border-collapse:collapse;

    table-layout:fixed;

    overflow:hidden;

    border-radius:18px;

}

.dashboard-enquiry-table thead{

    background:white;

}

.dashboard-enquiry-table th{

    padding:16px 12px;

    text-align:center;

    font-size:15px;

    font-weight:700;

    color:var(--muted);

    border-bottom:1px solid rgba(255,255,255,.10);

}

.dashboard-enquiry-table td{

    padding:18px 12px;

    text-align:center;

    font-size:16px;

    font-weight:600;

    color:var(--ink);

    background:white;

    border-bottom:1px solid rgba(255,255,255,.08);

    word-break:break-word;

}

.dashboard-enquiry-table tbody tr:hover td{

    background:white;

}

.dashboard-enquiry-status{

    display:inline-flex;

    align-items:center;

    justify-content:center;

    min-width:110px;

    height:34px;

    border-radius:18px;

    padding:0 16px;

    font-size:14px;

    font-weight:700;

    color:#ffffff;

}

.dashboard-enquiry-status.pending{

    background:#d4a017;

}

.dashboard-enquiry-status.completed{

    background:var(--orange);

}

.dashboard-enquiry-status.approved{

    background:#2f80ed;

}

.dashboard-enquiry-status.rejected{

    background:#d64545;

}

.dashboard-enquiry-status.inprogress{

    background:#7b61ff;

}

@media(max-width:1200px){

    .dashboard-summary-card{

        overflow-x:auto;

    }

    .dashboard-enquiry-table{

        min-width:1100px;

    }

}

.workflow-success{

    background:#28a745;

    color:white;

    padding:14px;

    border-radius:8px;

    margin-bottom:18px;

    font-weight:600;

}

.workflow-error{

    background:#dc3545;

    color:white;

    padding:14px;

    border-radius:8px;

    margin-bottom:18px;

    font-weight:600;

}

/* ==================================== */
/* DASHBOARD TABS */
/* ==================================== */

.dashboard-tabs{

    display:flex;

    gap:16px;

    margin-bottom:32px;

}

.dashboard-tab{

    background:#1b5560;

    color:white;

    border:none;

    padding:12px 28px;

    border-radius:12px;

    cursor:pointer;

    font-size:16px;

    font-weight:600;

    transition:.25s;

}

.dashboard-tab:hover{

    background:#236c79;

}

.dashboard-tab-active{

    background:var(--orange);

    color:white;

}



/* ==================================== */
/* INVOICE SUMMARY */
/* ==================================== */

.invoice-summary-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:24px;

}

.invoice-summary-card{

    background:var(--card);

    border:1px solid var(--line);

    border-radius:24px;

    padding:28px;

}

.invoice-summary-card h3{

    margin-bottom:18px;

    color:var(--ink);

    font-size:22px;

}

.invoice-summary-item{

    margin-bottom:16px;

}

.invoice-summary-item span{

    display:block;

    font-size:14px;

    color:var(--muted);

    margin-bottom:6px;

}

.invoice-summary-item strong{

    color:white;

    font-size:18px;

}

.dashboard-section-title{

    color:var(--ink);

    margin-top:40px;

    margin-bottom:20px;

}

.summary-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:20px;

    margin-bottom:40px;

}

.dashboard-summary-section{

        background:var(--card);

    border:1px solid rgba(255,255,255,.08);

    border-radius:28px;

    padding:35px;

    margin-bottom:35px;

}

/* ==========================================
   INVOICE JOB TAB
   (Same Style as Execution Tab)
========================================== */

.invoice-grid{

    display:grid;

    grid-template-columns:repeat(2,minmax(320px,1fr));

    gap:22px;

    margin-top:30px;

}

.invoice-grid-item{

    background:white;

    border:1px solid rgba(255,255,255,.08);

    border-radius:20px;

    padding:22px;

    min-height:92px;

    display:flex;

    flex-direction:column;

    justify-content:center;

    transition:.2s;

}

.invoice-grid-item:hover{

    border-color:#41d8d0;

    transform:translateY(-2px);

}

.invoice-label{

    font-size:15px;

    color:#9ebfc7;

    margin-bottom:10px;

    font-weight:600;

}

.invoice-value{

    font-size:18px;

    color:var(--ink);

    font-weight:700;

    word-break:break-word;

}


/* ==========================================
   RESPONSIVE
========================================== */

@media(max-width:1100px){

    .invoice-grid{

        grid-template-columns:1fr;

    }

}
=== END ORIGINAL FILE: frontend/src/components/dashboard/Dashboard.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/jobCreation/JobCreation.css ===
/* ===================================
   PAGE
   Full rewrite matching the wireframe's own scale (same tokens as
   Ops Selector / Quotes / Techno-Commercial Quote) - this file
   previously ran on a much larger, disconnected scale (56px inputs/
   buttons, 26-28px card radii/padding, no page heading at all) built
   around a 4-card structure (Header/Allocation/Manpower/Readiness)
   that didn't match the wireframe's actual single stage-gated card.
=================================== */

.job-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   PAGE HEADER
=================================== */

.job-page-header{

margin-bottom:16px;

}


.job-page-header h1{

font-size:21px;

font-weight:800;

color:var(--ink);

margin:0 0 6px 0;

}


.job-page-header p{

font-size:13px;

color:var(--muted);

margin:0;

max-width:640px;

line-height:1.5;

}


/* ===================================
   QUOTE SELECTOR BAR
=================================== */

.job-selector-bar{

margin-bottom:14px;

max-width:420px;

}


.job-selector-bar label{

font-size:11px;

font-weight:800;

color:#475569;

display:block;

margin-bottom:4px;

}


.job-selector-bar select{

width:100%;

border:1.5px solid var(--ink);

border-radius:8px;

padding:7px 10px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


.job-selector-bar select:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   CARD
=================================== */

.job-card{

width:100%;

max-width:640px;

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

}


.job-card-header{

margin-bottom:12px;

}


.job-card-header h2{

display:flex;

align-items:center;

gap:10px;

font-size:14.5px;

font-weight:800;

color:var(--ink);

margin:0;

}


/* ===================================
   STATUS PILLS
   Matches the wireframe's own .pill exactly.
=================================== */

.job-pill{

display:inline-flex;

align-items:center;

border-radius:999px;

padding:3px 10px;

font-size:11px;

font-weight:800;

border:1px solid var(--line);

background:#fff;

white-space:nowrap;

}


.job-pill-green{

color:#166534;

background:#dcfce7;

border-color:#bbf7d0;

}


.job-pill-amber{

color:#92400e;

background:#fef3c7;

border-color:#fde68a;

}


/* ===================================
   FIELD ROW
   Matches the wireframe's .fieldRow exactly.
=================================== */

.job-field-row{

display:flex;

justify-content:space-between;

padding:6px 0;

border-bottom:1px dashed var(--line);

font-size:12.5px;

gap:10px;

}


.job-field-row:last-child{

border-bottom:none;

}


.job-field-row span{

color:var(--muted);

}


.job-field-row b{

font-weight:700;

color:var(--ink);

text-align:right;

}


/* ===================================
   MUTED TEXT
=================================== */

.job-muted{

font-size:12.5px;

color:var(--muted);

margin:0 0 14px 0;

line-height:1.5;

}


/* ===================================
   FORM GRID
=================================== */

.job-formgrid{

display:grid;

grid-template-columns:repeat(2,minmax(0,1fr));

gap:12px;

margin-bottom:14px;

}


.job-field label{

font-size:11px;

font-weight:800;

color:#475569;

display:block;

margin-bottom:4px;

}


.job-field input,

.job-field select{

width:100%;

border:1.5px solid var(--ink);

border-radius:8px;

padding:7px 10px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


.job-field input:focus,

.job-field select:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   SUBHEADING
   Matches the wireframe's .card h4 exactly.
=================================== */

.job-subheading{

margin:14px 0 8px;

font-size:12px;

font-weight:800;

color:#374151;

text-transform:uppercase;

letter-spacing:.03em;

}


/* ===================================
   PRIMARY BUTTON
=================================== */

.job-primary-btn{

width:100%;

margin-top:14px;

border:1px solid var(--orange);

background:var(--orange);

color:#fff;

border-radius:9px;

padding:8px 16px;

font-size:12px;

font-weight:750;

cursor:pointer;

transition:.15s;

}


.job-primary-btn:hover{

background:#d96b0d;

border-color:#d96b0d;

}


.job-primary-btn:disabled{

opacity:.6;

cursor:default;

}
=== END ORIGINAL FILE: frontend/src/components/jobCreation/JobCreation.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/allocation/Allocation.css ===
/* ===========================================
   PAGE
=========================================== */

.allocation-page{

    min-height:100vh;

    padding:40px;

    background:var(--bg);

    color:var(--ink);

    font-family:Inter,sans-serif;

}


/* ===========================================
   HEADER
=========================================== */

.allocation-title{

    font-size:42px;

    font-weight:700;

    margin-bottom:30px;

    color:var(--ink);

}


/* ===========================================
   CARD
=========================================== */

.allocation-card{

    background:var(--card);

    border:1px solid var(--line);

    box-shadow:0 4px 14px rgba(17,24,39,.04);

    border-radius:24px;

    padding:30px;

    margin-bottom:30px;

    backdrop-filter:blur(12px);

}


/* ===========================================
   DROPDOWN
=========================================== */

.job-selector{

    width:340px;

    padding:12px 16px;

    border:1px solid var(--line);

    border-radius:10px;

    background:white;

    color:var(--ink);

    font-size:16px;

    margin-bottom:25px;

}


/* ===========================================
   SECTION TITLES
=========================================== */

.section-title{

    font-size:28px;

    margin-bottom:20px;

    font-weight:700;

    color:var(--ink);

}


/* ===========================================
   SUMMARY GRID
=========================================== */

.summary-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:20px;

}


.summary-item{

    background:#f8fafc;

    padding:18px;

    border-radius:16px;

    border:1px solid var(--line);

}


.summary-item span{

    display:block;

    color:var(--muted);

    font-size:13px;

    margin-bottom:8px;

}


.summary-item strong{

    font-size:18px;

    color:var(--ink);

}


/* ===========================================
   RESOURCE GRID
=========================================== */

.resource-grid{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(380px,1fr));

    gap:18px;

}


/* ===========================================
   MACHINE / PERSONNEL CARD
=========================================== */

.resource-card{

    background:white;

    border-radius:18px;

    padding:18px;

    border:1px solid var(--line);

    transition:.25s;

}


.resource-card:hover{

    transform:translateY(-4px);

    border-color:var(--orange);

    box-shadow:0 8px 20px rgba(17,24,39,.08);

}


.resource-card label{

    display:flex;

    align-items:flex-start;

    gap:12px;

    cursor:pointer;

}


.resource-card input{

    margin-top:6px;

    transform:scale(1.2);

}


.resource-name{

    font-size:18px;

    font-weight:700;

    margin-bottom:8px;

    color:var(--ink);

}


.resource-info{

    color:var(--muted);

    line-height:1.7;

    font-size:14px;

}


/* ===========================================
   FORM
=========================================== */

.form-grid{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:20px;

}


.form-group{

    display:flex;

    flex-direction:column;

}


.form-group label{

    margin-bottom:8px;

    color:var(--muted);

}


.form-group input{

    padding:12px;

    border:1px solid var(--line);

    border-radius:10px;

    background:white;

    color:var(--ink);

}


/* ===========================================
   BUTTON
=========================================== */

.allocate-btn{

    margin-top:30px;

    padding:16px 40px;

    border:none;

    border-radius:12px;

    background:var(--orange);

    color:white;

    font-size:18px;

    font-weight:700;

    cursor:pointer;

    transition:.25s;

}


.allocate-btn:hover{

    transform:translateY(-2px);

    background:#d96b0d;

}


/* ===========================================
   MOBILE
=========================================== */

@media(max-width:900px){

    .summary-grid{

        grid-template-columns:1fr;

    }

    .resource-grid{

        grid-template-columns:1fr;

    }

    .form-grid{

        grid-template-columns:1fr;

    }

}
=== END ORIGINAL FILE: frontend/src/components/allocation/Allocation.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/quote/TechnoCommercialQuote.css ===
/* ===================================
   PAGE
   Resized to the same scale as SalesSurvey.css / Operations.css /
   QuotesModule.css - previously this file ran on its own much larger
   scale (56px heading, 28px card headers, 22px inputs, a 360x72px
   Save button) with no CSS variables actually defined anywhere in its
   own scope, which is what made this page look like a different
   product from the rest of the app.
=================================== */

.quote-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   HEADER
=================================== */

.quote-header{

margin-bottom:16px;

}


.quote-header h1{

font-size:21px;

font-weight:800;

color:var(--ink);

margin:0 0 6px 0;

}


.quote-header p{

font-size:13px;

color:var(--muted);

margin:0;

max-width:640px;

line-height:1.5;

}


/* ===================================
   OPS SELECTOR BAR
=================================== */

.quote-selector-bar{

margin-bottom:14px;

max-width:420px;

}


.quote-ops-select{

width:100%;

border:1.5px solid var(--ink);

border-radius:8px;

padding:7px 10px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


.quote-ops-select:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   GRID
=================================== */

.quote-grid{

display:grid;

grid-template-columns:repeat(2,minmax(0,1fr));

gap:14px;

}


@media (max-width: 900px){

.quote-grid{

grid-template-columns:1fr;

}

}


/* ===================================
   CARD
=================================== */

.quote-card{

width:100%;

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

}


.quote-card-header{

margin-bottom:12px;

}


.quote-card-header h2{

font-size:14.5px;

font-weight:800;

color:var(--ink);

margin:0;

}


/* ===================================
   TABLE
   Not a real <table> - a grid (label / value[/value]) shared by
   TechnicalSummaryCard (2-col) and CommercialEstimateCard (2-col and
   3-col min/max rows).
=================================== */

.quote-table{

width:100%;

}


.quote-table-header{

display:grid;

grid-template-columns:1fr 1fr;

gap:10px;

padding:0 0 8px 0;

border-bottom:1px solid var(--line);

font-size:10.5px;

font-weight:800;

text-transform:uppercase;

letter-spacing:.03em;

color:#475569;

}


.quote-table-header-3{

display:grid;

grid-template-columns:1.2fr .9fr .9fr;

gap:10px;

padding:0 0 8px 0;

border-bottom:1px solid var(--line);

font-size:10.5px;

font-weight:800;

text-transform:uppercase;

letter-spacing:.03em;

color:#475569;

}


.quote-table-row{

display:grid;

grid-template-columns:1fr 1fr;

gap:10px;

align-items:center;

padding:8px 0;

border-bottom:1px dashed var(--line);

}


.quote-table-row-3{

display:grid;

grid-template-columns:1.2fr .9fr .9fr;

gap:10px;

align-items:center;

padding:8px 0;

border-bottom:1px dashed var(--line);

}


.quote-table-row:last-child,

.quote-table-row-3:last-child{

border-bottom:none;

}


.quote-label{

font-size:12px;

font-weight:700;

color:var(--ink);

}


.quote-value{

font-size:12.5px;

color:var(--ink);

}


/* ===================================
   INPUTS
=================================== */

.quote-input{

width:100%;

border:1.5px solid var(--ink);

border-radius:8px;

padding:6px 8px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

text-align:right;

}

.quote-actions .quote-input{

text-align:left;

}


.quote-input:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


/* ===================================
   ACTIONS
=================================== */

.quote-actions{

display:flex;

align-items:center;

gap:8px;

margin-top:14px;

}


.quote-actions .quote-input{

flex:1;

}


.quote-primary-btn{

border:1px solid var(--orange);

background:var(--orange);

color:#fff;

border-radius:9px;

padding:8px 16px;

font-size:12px;

font-weight:750;

cursor:pointer;

white-space:nowrap;

transition:.15s;

}


.quote-primary-btn:hover{

background:#d96b0d;

border-color:#d96b0d;

}
=== END ORIGINAL FILE: frontend/src/components/quote/TechnoCommercialQuote.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/approval/ApprovalBoard.css ===
/* ====================================
   PAGE
==================================== */

.approval-page{

    width:100%;

    min-height:100vh;

    padding:32px 40px 60px;

    background:var(--bg);

}


/* ====================================
   HEADER
==================================== */

.approval-header{

    margin-bottom:36px;

}

.approval-header h1{

    margin:0;

    font-size:52px;

    font-weight:800;

    color:var(--ink);

}

.approval-header p{

    margin-top:10px;

    color:var(--muted);

    font-size:18px;

}


/* ====================================
   APPROVAL LIST
==================================== */

.approval-list{

    display:flex;

    flex-direction:column;

    gap:24px;

}


/* ====================================
   CARD
==================================== */

.approval-card{

    width:100%;

    background:var(--card);

    border-radius:26px;

    border:1px solid var(--line);

    padding:28px;

    box-shadow:0 4px 14px rgba(17,24,39,.04);

}


/* ====================================
   HEADER
==================================== */

.approval-card-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:24px;

}

.approval-title{

    font-size:28px;

    font-weight:800;

    color:var(--ink);

}

.approval-flag{

    padding:10px 18px;

    border-radius:999px;

    background:var(--orange);

    color:white;

    font-size:14px;

    font-weight:700;

}


/* ====================================
   BODY
==================================== */

.approval-body{

    display:grid;

    grid-template-columns:repeat(3,1fr);

    gap:24px;

    margin-bottom:28px;

}

.approval-field{

    display:flex;

    flex-direction:column;

    padding:18px;

    border-radius:18px;

    background:#f8fafc;

    border:1px solid var(--line);

}

.approval-field span{

    color:var(--muted);

    font-size:14px;

    margin-bottom:10px;

}

.approval-field strong{

    color:var(--ink);

    font-size:18px;

    word-break:break-word;

}


/* ====================================
   BUTTON
==================================== */

.approval-actions{

    display:flex;

    justify-content:flex-end;

}

.approval-button{

    min-width:180px;

    height:56px;

    border:none;

    border-radius:16px;

    cursor:pointer;

    font-size:17px;

    font-weight:700;

    color:white;

    background:var(--orange);

    transition:.2s;

}

.approval-button:hover{

    transform:translateY(-2px);

    background:#d96b0d;

}


/* ====================================
   RESPONSIVE
==================================== */

@media(max-width:900px){

    .approval-body{

        grid-template-columns:1fr;

    }

}
.approval-success{

    background:#28a745;

    color:white;

    padding:14px 18px;

    border-radius:10px;

    margin-bottom:20px;

    font-weight:600;

}

.approval-error{

    background:#dc3545;

    color:white;

    padding:14px 18px;

    border-radius:10px;

    margin-bottom:20px;

    font-weight:600;

}

.verified{

    color:#39d98a;

    font-weight:700;

}

.pending{

    color:#ffb84d;

    font-weight:700;

}

.resource-detail{

    margin-top:6px;

    font-size:15px;

}

.queue-details{

    margin-top:14px;

}

.queue-details summary{

    cursor:pointer;

    color:var(--orange);

    font-weight:600;

}

.queue-item{

    margin-top:10px;

    padding:10px;

    border-radius:10px;

    background:#f8fafc;

    border:1px solid var(--line);

}
=== END ORIGINAL FILE: frontend/src/components/approval/ApprovalBoard.css ===

=== BEGIN ORIGINAL FILE: frontend/src/components/salesSurvey/SalesSurvey.css ===
/* ===================================
   GLOBAL APP LAYOUT FIX
=================================== */

html,
body,
#root{

width:100%;

height:100%;

margin:0;

padding:0;

overflow:hidden;

}

*{

box-sizing:border-box;

}


/* ===================================
   PAGE
   Resized to the same scale as EnquiryWorkspace.css /
   SurveySummary.css / BusinessMasters.css - this file used to run
   much larger than the rest of the app (52px headings, 64px tall
   inputs), which is what made Customer Request / Sales Survey look
   like they belonged to a different product.
=================================== */

.sales-survey-page{

    --orange:#f58220;
    --deep:#12151c;
    --ink:#1f2937;
    --muted:#6b7280;
    --line:#e5e7eb;
    --card:#fff;

width:100%;

min-height:100vh;

padding:20px;

background:var(--bg);

overflow-y:auto;

font-family:Inter,"Segoe UI",Arial,sans-serif;

color:var(--ink);

font-size:14px;

}


/* ===================================
   SURVEY HEADER
=================================== */

.survey-progress-container{

display:flex;

justify-content:space-between;

align-items:flex-start;

margin-bottom:16px;

padding:0;

width:100%;

gap:16px;

flex-wrap:wrap;

}


.survey-progress-left{

width:100%;

max-width:none;

display:flex;

flex-direction:column;

align-items:flex-start;

}


.survey-sheet-title{

font-size:11px;

font-weight:800;

letter-spacing:1.5px;

color:var(--orange);

margin-bottom:6px;

text-transform:uppercase;

}


/* ===================================
   MAIN TITLE
=================================== */

.survey-progress-left h1{

font-size:21px;

font-weight:800;

color:var(--ink);

line-height:1.2;

margin:0 0 6px 0;

}


.survey-progress-left p{

font-size:13px;

line-height:1.5;

color:var(--muted);

max-width:none;

text-align:left;

margin-top:0;

}


/* ===================================
   COMPLETION CARD
=================================== */

.survey-completion-card{

width:auto;

height:44px;

border-radius:999px;

border:1px solid var(--line);

background:white;

box-shadow:0 6px 18px rgba(17,24,39,.12);

display:flex;

align-items:center;

justify-content:space-between;

padding:0 18px;

gap:10px;

font-size:12.5px;

font-weight:700;

color:var(--ink);

flex-shrink:0;

position:fixed;

top:96px;

right:28px;

z-index:50;

}

.survey-completion-card span {

font-size: 12px;

}

.survey-completion-card strong{

font-size:14.5px;

}


/* ===================================
   SURVEY CARD
=================================== */

.survey-card{

width:100%;

background:var(--card);

border:1px solid var(--line);

border-radius:14px;

padding:16px;

margin-bottom:14px;

box-shadow:0 4px 14px rgba(17,24,39,.04);

}


/* ===================================
   SECTION HEADER
=================================== */

.survey-header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:14px;

flex-wrap:wrap;

gap:8px;

}


.survey-header h2{

font-size:14.5px;

font-weight:800;

color:var(--ink);

margin:0;

}


.survey-header span{

font-size:12px;

color:var(--muted);

}


/* ===================================
   GRID
=================================== */

.survey-grid,

.survey-row{

display:grid;

grid-template-columns:repeat(3,minmax(0,1fr));

gap:14px;

width:100%;

}


/* ===================================
   FIELD
=================================== */

.survey-field{

display:flex;

flex-direction:column;

width:100%;

min-width:0;

}


/* ===================================
   LABEL
=================================== */

.survey-field label{

font-size:11px;

font-weight:800;

color:#475569;

margin-bottom:4px;

text-align:left;

}


/* ===================================
   INPUTS
   Default border is neutral/black - it only turns orange when the
   field is actually invalid (see .field-error below). Previously
   every field was permanently orange regardless of validity, which
   gave no signal about what was actually wrong with the form.
=================================== */

.survey-field input,

.survey-field select{

width:100%;

height:auto;

border:1.5px solid var(--ink);

border-radius:8px;

padding:7px 10px;

font-size:12.5px;

font-family:inherit;

background:#fff;

color:var(--ink);

outline:none;

}


/* ===================================
   PHONE INPUT
   Country-code select + a fixed-width digits field, sitting side by
   side inside the same .survey-field wrapper every other field uses.
=================================== */

.phone-input-row{

display:flex;

gap:6px;

}

.phone-input-country{

flex:0 0 110px;

width:110px;

min-width:0;

max-width:110px;

}

.phone-input-digits{

flex:1 1 auto;

min-width:0;

letter-spacing:0.5px;

}


/* ===================================
   FIELD ERROR
   Orange border + small inline message - the one signal reserved
   for "this field is missing or malformed".
=================================== */

.survey-field.field-error input,

.survey-field.field-error select{

border-color:var(--orange);

}

.field-error-message{

display:block;

color:var(--orange);

font-size:10.5px;

font-weight:600;

margin-top:3px;

}

.required-asterisk{

color:var(--orange);

font-weight:700;

margin-left:1px;

}


/* ====================================
   MEDIA UPLOAD TOAST
==================================== */

.media-upload-toast{

position:fixed;

bottom:24px;

right:24px;

background:var(--ink, #1f2937);

color:#fff;

font-size:12.5px;

font-weight:600;

padding:12px 18px;

border-radius:8px;

box-shadow:0 8px 20px rgba(17,24,39,.25);

z-index:50;

animation:mediaToastIn .15s ease;

}

@keyframes mediaToastIn{

from{ opacity:0; transform:translateY(8px); }

to{ opacity:1; transform:translateY(0); }

}


/* ====================================
   LOOKUP SELECT - "Other" free-text mode
==================================== */

.lookup-select-other-wrap{

position:relative;

}

.lookup-select-back-link{

background:none;

border:none;

color:var(--orange);

font-size:10.5px;

font-weight:600;

cursor:pointer;

padding:2px 0 0;

margin-top:2px;

}

.lookup-select-back-link:hover{

text-decoration:underline;

}


/* ===================================
   INLINE FIELD LINK
   Small text-button next to a label (e.g. "Choose existing
   customer" toggle) - not a full button, just a link-styled action.
=================================== */

.field-inline-link{

background:none;

border:none;

padding:0;

margin-left:8px;

font-size:10.5px;

font-weight:700;

color:var(--orange);

cursor:pointer;

text-decoration:underline;

}

.survey-field select option{

background:#ffffff;

color:#0d1730;

}

.survey-field input::placeholder{

color:var(--muted);

opacity:1;

}

.survey-field input:focus,

.survey-field select:focus{

border-color:var(--orange);

box-shadow:0 0 0 3px rgba(245,130,32,.18);

}


.survey-field select{

cursor:pointer;

}


.survey-field input{

cursor:text;

}


.survey-field input[readonly]{

background:#f8fafc;

border-color:var(--line);

cursor:not-allowed;

}

.survey-field.disabled {

    opacity: 0.55;

}

.survey-field.disabled input,

.survey-field.disabled select {

    background: #f8fafc;

    border-color:var(--line);

    cursor: not-allowed;

}


/* ===================================
   MEDIA UPLOAD
=================================== */

.media-upload-box{

height:auto;

min-height:44px;

border:1.5px dashed var(--orange);

border-radius:10px;

display:flex;

align-items:center;

padding:0 14px;

font-size:12.5px;

cursor:pointer;

background:#fff;

transition:0.2s;

color:var(--ink);

}


.media-upload-box:hover{

border-color:var(--orange);

background:#fff7ed;

}


/* ===================================
   ACTION BUTTONS
=================================== */

.survey-actions{

display:flex;

justify-content:flex-start;

gap:8px;

padding:16px 0 30px;

flex-wrap:wrap;

}


.survey-btn{

border:1px solid var(--line);

cursor:pointer;

height:auto;

padding:8px 16px;

border-radius:9px;

font-size:12px;

font-weight:750;

}


.save-btn{

background:var(--orange);

border-color:var(--orange);

color:white;

}


.ops-btn{

background:var(--deep);

border-color:var(--deep);

color:white;

}


.info-btn{

background:#e9edf3;

border:1px solid var(--line);

color:var(--ink);

}


/* ===================================
   SCROLL TO TOP
   Fixed bottom-right, shown once the user has scrolled past the
   top-of-page metric cards - lets them jump back up to see those
   without manually scrolling through the whole form.
=================================== */

.survey-scroll-top-btn{

position:fixed;

right:28px;

bottom:28px;

width:44px;

height:44px;

border:none;

border-radius:50%;

background:var(--orange);

color:white;

display:flex;

align-items:center;

justify-content:center;

cursor:pointer;

box-shadow:0 8px 20px rgba(245,130,32,.35);

transition:.15s ease;

z-index:50;

}

.survey-scroll-top-btn:hover{

background:#d96b0d;

transform:translateY(-2px);

}


/* ===================================
   RESPONSIVE
=================================== */

@media(max-width:1200px){

.survey-grid,

.survey-row{

grid-template-columns:repeat(2,1fr);

}

.survey-progress-container{

flex-direction:column;

gap:12px;

}

.survey-actions{

flex-direction:column;

}

}


/* ====================================
MEDIA CONTAINER
==================================== */

.media-container{

display:flex;

gap:16px;

margin-top:14px;

align-items:flex-start;

}


/* ====================================
SELECTOR
==================================== */

.media-selector{

width:220px;

display:flex;

flex-direction:column;

gap:6px;

max-height:280px;

overflow-y:auto;

}


/* ====================================
BUTTONS
==================================== */

.media-item{

padding:7px 10px;

border:1px solid var(--line);

cursor:pointer;

text-align:left;

border-radius:8px;

font-size:12.5px;

background:#fff;

}


.media-item.active{

font-weight:800;

border-color:var(--orange);

color:var(--orange);

}


/* ====================================
PREVIEW AREA
==================================== */

.media-preview{

flex:1;

display:flex;

justify-content:center;

align-items:center;

height:260px;

border-radius:10px;

overflow:hidden;

background:#f8fafc;

border:1px solid var(--line);

}


/* ====================================
IMAGE
==================================== */

.preview-image{

max-width:400px;

max-height:240px;

width:auto;

height:auto;

object-fit:contain;

border-radius:8px;

}


/* ====================================
VIDEO
==================================== */

.preview-video{

width:400px;

height:240px;

border-radius:8px;

background:black;

}


/* ====================================
EMPTY
==================================== */

.media-empty{

display:flex;

justify-content:center;

align-items:center;

height:260px;

color:var(--muted);

font-size:12.5px;

}

.customer-select{

    height:auto;

}

.survey-id{

    font-weight:700;

    font-size:11px;

    color:var(--muted);

    display:flex;

    align-items:center;

    gap:6px;

}

.survey-id label{

    font-size:11px;

    font-weight:700;

}

.survey-id select{

    height:auto;

    padding:4px 8px;

    font-size:11px;

    border:1.5px solid var(--orange);

    border-radius:6px;

}

.survey-btn:disabled{

    opacity:0.5;
    cursor:not-allowed;

}
=== END ORIGINAL FILE: frontend/src/components/salesSurvey/SalesSurvey.css ===
