import { useEffect, useState } from "react";

import {

    getTaskMatrix,
    saveTaskMatrix

} from "../../services/rolePermissionsService";

import "./RoleNavigationMatrix.css";

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
// Scoped to one selected role - one group per module ("Business
// Masters", "Enquiries"), rows = that group's real tabs. Each row is
// a plain flex row (not an HTML <table>) so its width hugs its own
// content - a table forces every row's Task Access column to share
// the width of the row with the MOST tasks, leaving huge dead space
// on every shorter row.
// Approve/Reject/Accept/Send-back-style buttons are never represented
// here - those are governed by hub_approvers (Phase 21C), not this
// matrix. Reuses RoleNavigationMatrix's own CSS classes throughout,
// per direct instruction, rather than a new visual language.
// ====================================

export default function RoleTaskMatrix({ role }){

    const [groups, setGroups] = useState([]);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState(null);

    async function load(){

        setLoading(true);
        setMessage(null);

        try{

            const data = await getTaskMatrix(role.id);

            setGroups(data.groups);

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

    function toggleTabAccess(groupIndex, tabIndex){

        setGroups(prev=>{

            const next = prev.map(g=>({ ...g, tabs:[...g.tabs] }));
            const tab = { ...next[groupIndex].tabs[tabIndex] };

            tab.can_view = !tab.can_view;

            next[groupIndex].tabs[tabIndex] = tab;

            return next;

        });

    }

    function toggleTask(groupIndex, tabIndex, taskIndex){

        setGroups(prev=>{

            const next = prev.map(g=>({ ...g, tabs:[...g.tabs] }));
            const tab = { ...next[groupIndex].tabs[tabIndex] };

            tab.tasks = tab.tasks.map((task, i)=>
                i===taskIndex ? { ...task, allowed: !task.allowed } : task
            );

            next[groupIndex].tabs[tabIndex] = tab;

            return next;

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

            const data = await saveTaskMatrix(role.id, tabs);

            setGroups(data.groups);

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

                    Tab Access controls whether {role.name} can open the tab at all. Task Access controls which
                    buttons inside it are usable - Approve/Reject/Accept/Send-back actions aren't listed here,
                    those are governed by each hub's approval standing instead.

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

            {
                groups.map((group, groupIndex)=>(

                    <div key={group.group_name} className="role-task-matrix-group">

                        <h4 className="role-task-matrix-group-title">{group.group_name}</h4>

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
                                                                                className="role-nav-matrix-checkbox-row"
                                                                            >

                                                                                <input

                                                                                    type="checkbox"
                                                                                    checked={task.allowed}
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

                ))
            }

        </div>

    );

}
