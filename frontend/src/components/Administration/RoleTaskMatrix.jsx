import { useEffect, useState } from "react";

import {

    getTaskMatrix,
    saveTaskMatrix

} from "../../services/rolePermissionsService";

import { MODULE_META } from "../../config/navigation";

import "./RoleNavigationMatrix.css";

// ====================================
// DERIVED NAV GROUP MAP
// Nav module_key -> the group_name whose tabs it derives Accessible
// from. Mirrors backend/repositories/role_permissions_repository.py's
// DERIVED_NAV_MODULES - kept as a small local map here purely so the
// UI can recompute derived access live as tabs are toggled, before any
// save round-trips to the server.
// ====================================

const DERIVED_GROUP_BY_NAV_KEY = {

    "/business-master": "Business Masters",
    "/enquiry": "Enquiries"

};


// ====================================
// TASK PAIRING
// Chunks a tab's task list into columns of (up to) 2, top-to-bottom -
// "keep two checkboxes vertically and just keep adding this two row
// vertically columns" per the original instruction. Each pair is its
// own independent flex column (not a shared CSS Grid track), so one
// tab's long/wrapping labels never distort another row's spacing -
// every pair gets the exact same gap regardless of what else is on
// the page.
// ====================================

function chunkPairs(tasks){

    const pairs = [];

    for(let i=0; i<tasks.length; i+=2){
        pairs.push(tasks.slice(i, i+2));
    }

    return pairs;

}


// ====================================
// COMPONENT
// Scoped to one selected role. Two areas:
//   1. Navigation Access - every nav module for this role. Modules
//      that decompose into tabs below ("/business-master", "/enquiry")
//      show a live, read-only DERIVED Accessible state (computed from
//      the tab groups' own can_view values as they're edited, not
//      independently settable). Every other nav module keeps a plain
//      Accessible + Landing page pair, same as the old standalone
//      Navigation Access matrix this replaces.
//   2. Business Masters / Enquiries tab+task groups - one row per real
//      tab ("Business Masters", "Enquiries"), Tab Access cascades to
//      every task under it both directions (checking a tab defaults
//      all its tasks on, the user can then uncheck specific ones;
//      unchecking a tab forces every task off) - enforced here
//      client-side for immediate feedback, and again server-side on
//      save as a hard invariant.
// Approve/Reject/Accept/Send-back-style buttons are never represented
// here - those are governed by hub_approvers (Phase 21C), not this
// matrix. Reuses RoleNavigationMatrix's own CSS classes throughout,
// per direct instruction, rather than a new visual language.
// ====================================

export default function RoleTaskMatrix({ role }){

    const [groups, setGroups] = useState([]);

    const [navModules, setNavModules] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState(null);

    async function load(){

        setLoading(true);
        setMessage(null);

        try{

            const data = await getTaskMatrix(role.id);

            setGroups(data.groups);
            setNavModules(data.nav_modules || []);

        }
        catch(error){

            console.error("[RoleTaskMatrix] Failed to load matrix", error);
            setMessage({ type:"error", text:"Unable to load the task matrix for this role." });

        }
        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        load();

    }, [role.id]);


    // Live-derived Accessible state for a nav module, computed from the
    // CURRENT (possibly just-edited, not-yet-saved) tab groups - this
    // is what makes toggling a tab immediately update the module's
    // Accessible state above it, with no round-trip needed.
    function derivedAccessible(navModuleKey){

        const groupName = DERIVED_GROUP_BY_NAV_KEY[navModuleKey];

        if(!groupName) return null;

        const group = groups.find(g=>g.group_name===groupName);

        if(!group) return false;

        return group.tabs.some(tab=>tab.can_view);

    }

    // Whenever a tab toggle changes derived accessibility, a derived
    // module that was the landing page but is no longer reachable must
    // drop that flag - mirrors the same "can't land on a page you
    // can't see" rule the old nav matrix already enforced.
    useEffect(()=>{

        setNavModules(prev=>{

            let changed = false;

            const next = prev.map(module=>{

                if(!module.derived || !module.is_landing_page) return module;

                if(derivedAccessible(module.module_key)) return module;

                changed = true;

                return { ...module, is_landing_page:false };

            });

            return changed ? next : prev;

        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groups]);


    function toggleTabAccess(groupIndex, tabIndex){

        setGroups(prev=>{

            const next = prev.map(g=>({ ...g, tabs:[...g.tabs] }));
            const tab = { ...next[groupIndex].tabs[tabIndex] };

            const nextCanView = !tab.can_view;

            tab.can_view = nextCanView;

            // Cascade: checking a tab defaults every task under it to
            // allowed (the user can then uncheck specific ones);
            // unchecking a tab forces every task under it off.
            tab.tasks = tab.tasks.map(task=>({ ...task, allowed: nextCanView }));

            next[groupIndex].tabs[tabIndex] = tab;

            return next;

        });

    }

    function setAllTabsInGroup(groupIndex, value){

        setGroups(prev=>{

            const next = prev.map((g, gi)=>{

                if(gi !== groupIndex) return g;

                return {
                    ...g,
                    tabs: g.tabs.map(tab=>({
                        ...tab,
                        can_view: value,
                        tasks: tab.tasks.map(task=>({ ...task, allowed: value }))
                    }))
                };

            });

            return next;

        });

    }

    function toggleTask(groupIndex, tabIndex, taskIndex){

        setGroups(prev=>{

            const next = prev.map(g=>({ ...g, tabs:[...g.tabs] }));
            const tab = { ...next[groupIndex].tabs[tabIndex] };

            if(!tab.can_view) return prev;

            tab.tasks = tab.tasks.map((task, i)=>
                i===taskIndex ? { ...task, allowed: !task.allowed } : task
            );

            next[groupIndex].tabs[tabIndex] = tab;

            return next;

        });

    }

    function toggleNavAccessible(moduleId){

        setNavModules(prev=>prev.map(module=>{

            if(module.module_id !== moduleId || module.derived) return module;

            const nextCanView = !module.can_view;

            return {
                ...module,
                can_view: nextCanView,
                is_landing_page: nextCanView ? module.is_landing_page : false
            };

        }));

    }

    function toggleNavLandingPage(moduleId){

        setNavModules(prev=>{

            const target = prev.find(m=>m.module_id===moduleId);

            if(!target) return prev;

            const accessible = target.derived ? derivedAccessible(target.module_key) : target.can_view;

            if(!accessible) return prev;

            const turningOn = !target.is_landing_page;

            return prev.map(module=>{

                if(module.module_id === moduleId){
                    return { ...module, is_landing_page: turningOn };
                }

                // Single-select per role: clear every other module's
                // landing-page flag.
                return module.is_landing_page ? { ...module, is_landing_page:false } : module;

            });

        });

    }

    async function handleSave(){

        setSaving(true);
        setMessage(null);

        try{

            const tabs = groups.flatMap(group=>

                group.tabs.map(tab=>({
                    module_id: tab.module_id,
                    can_view: tab.can_view,
                    tasks: tab.tasks.map(task=>({
                        module_task_id: task.module_task_id,
                        allowed: task.allowed
                    }))
                }))

            );

            const navPayload = navModules.map(module=>({
                module_id: module.module_id,
                can_view: module.derived ? derivedAccessible(module.module_key) : module.can_view,
                is_landing_page: module.is_landing_page
            }));

            const data = await saveTaskMatrix(role.id, tabs, navPayload);

            setGroups(data.groups);
            setNavModules(data.nav_modules || []);

            setMessage({ type:"success", text:"Role-based access saved." });

        }
        catch(error){

            setMessage({ type:"error", text: error?.detail || "Unable to save role-based access." });

        }
        finally{

            setSaving(false);

        }

    }

    if(loading){
        return <p className="role-nav-matrix-status">Loading task matrix...</p>;
    }

    return(

        <div className="role-nav-matrix-wrap">

            <div className="role-nav-matrix-header">

                <p className="role-nav-matrix-hint">

                    Navigation Access controls which modules {role.name} sees in the sidebar - Business Masters and
                    Enquiries are derived from their tabs below, every other module is set directly here. Tab Access
                    controls whether a tab can be opened at all; checking it grants every task under it by default,
                    the individual checkboxes below let you pull specific ones back. Approve/Reject/Accept/Send-back
                    actions aren't listed here - those are governed by each hub's approval standing instead.

                </p>

                <button

                    type="button"
                    className="administration-button primary"
                    onClick={handleSave}
                    disabled={saving}

                >

                    {saving ? "Saving..." : "Save changes"}

                </button>

            </div>

            {
                message && (
                    <p className={`role-nav-matrix-message ${message.type}`}>
                        {message.text}
                    </p>
                )
            }

            <div className="role-nav-section">

                <h4 className="role-task-matrix-group-title">Navigation Access</h4>

                <div className="role-nav-grid">

                    {
                        navModules.map(module=>{

                            const accessible = module.derived
                                ? derivedAccessible(module.module_key)
                                : module.can_view;

                            const title = MODULE_META[module.module_key]?.title ?? module.module_name;

                            return(

                                <div
                                    key={module.module_id}
                                    className={module.derived ? "role-nav-cell derived" : "role-nav-cell"}
                                >

                                    <span className="role-nav-cell-title">{title}</span>

                                    {
                                        module.derived ? (
                                            <span
                                                className={
                                                    accessible
                                                        ? "role-nav-derived-badge on"
                                                        : "role-nav-derived-badge off"
                                                }
                                            >
                                                {accessible ? "Accessible (from tabs)" : "Not accessible - no tabs on"}
                                            </span>
                                        ) : (
                                            <label className="role-nav-matrix-checkbox-row">

                                                <input

                                                    type="checkbox"
                                                    checked={module.can_view}
                                                    onChange={()=>toggleNavAccessible(module.module_id)}

                                                />

                                                <span>Accessible</span>

                                            </label>
                                        )
                                    }

                                    <label
                                        className={
                                            accessible
                                                ? "role-nav-matrix-checkbox-row role-nav-matrix-landing"
                                                : "role-nav-matrix-checkbox-row role-nav-matrix-landing disabled"
                                        }
                                    >

                                        <input

                                            type="checkbox"
                                            checked={module.is_landing_page}
                                            disabled={!accessible}
                                            onChange={()=>toggleNavLandingPage(module.module_id)}

                                        />

                                        <span>Landing page</span>

                                    </label>

                                </div>

                            );

                        })
                    }

                </div>

            </div>

            {
                groups.map((group, groupIndex)=>{

                    const totalTabs = group.tabs.length;
                    const accessibleTabs = group.tabs.filter(t=>t.can_view).length;

                    return(

                        <div key={group.group_name} className="role-task-matrix-group">

                            <div className="role-task-matrix-group-header">

                                <h4 className="role-task-matrix-group-title">

                                    {group.group_name}
                                    <span className="role-task-matrix-group-count">
                                        {accessibleTabs} / {totalTabs} tabs accessible
                                    </span>

                                </h4>

                                <div className="role-task-matrix-bulk-actions">

                                    <button
                                        type="button"
                                        className="role-task-matrix-bulk-link"
                                        onClick={()=>setAllTabsInGroup(groupIndex, true)}
                                    >
                                        Select all
                                    </button>

                                    <button
                                        type="button"
                                        className="role-task-matrix-bulk-link"
                                        onClick={()=>setAllTabsInGroup(groupIndex, false)}
                                    >
                                        Clear all
                                    </button>

                                </div>

                            </div>

                            <div className="role-task-matrix-rows">

                                <div className="role-task-matrix-header-row">
                                    <div className="role-task-matrix-col-tab">Tab</div>
                                    <div className="role-task-matrix-col-access">Tab Access</div>
                                    <div className="role-task-matrix-col-tasks">Task Access</div>
                                </div>

                                {
                                    group.tabs.map((tab, tabIndex)=>(

                                        <div key={tab.module_id} className="role-task-matrix-row">

                                            <div className="role-task-matrix-col-tab">
                                                <span className="role-nav-matrix-role-name">{tab.module_name}</span>
                                            </div>

                                            <div className="role-task-matrix-col-access">

                                                <label className="role-nav-matrix-checkbox-row">

                                                    <input

                                                        type="checkbox"
                                                        checked={tab.can_view}
                                                        onChange={()=>toggleTabAccess(groupIndex, tabIndex)}

                                                    />

                                                    <span>Accessible</span>

                                                </label>

                                            </div>

                                            <div className="role-task-matrix-col-tasks">

                                                {
                                                    tab.tasks.length===0 ? (
                                                        <span className="role-nav-matrix-role-type">No tasks yet.</span>
                                                    ) : (

                                                        <div className="role-task-matrix-task-flow">

                                                            {
                                                                chunkPairs(tab.tasks).map((pair, pairIndex)=>(

                                                                    <div key={pairIndex} className="role-task-matrix-task-pair">

                                                                        {
                                                                            pair.map(task=>(

                                                                                <label

                                                                                    key={task.module_task_id}
                                                                                    className={
                                                                                        tab.can_view
                                                                                            ? "role-nav-matrix-checkbox-row"
                                                                                            : "role-nav-matrix-checkbox-row disabled"
                                                                                    }

                                                                                >

                                                                                    <input

                                                                                        type="checkbox"
                                                                                        checked={task.allowed}
                                                                                        disabled={!tab.can_view}
                                                                                        onChange={()=>toggleTask(
                                                                                            groupIndex,
                                                                                            tabIndex,
                                                                                            tab.tasks.indexOf(task)
                                                                                        )}

                                                                                    />

                                                                                    <span>{task.task_label}</span>

                                                                                </label>

                                                                            ))
                                                                        }

                                                                    </div>

                                                                ))
                                                            }

                                                        </div>

                                                    )
                                                }

                                            </div>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    );

                })
            }

        </div>

    );

}
