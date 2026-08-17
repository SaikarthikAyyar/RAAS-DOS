import { useEffect, useState } from "react";

import {

    getTaskMatrix,
    saveTaskMatrix

} from "../../services/rolePermissionsService";

import "./RoleNavigationMatrix.css";

// ====================================
// COMPONENT
// Scoped to one selected role - one table per module group ("Business
// Masters", "Enquiries"), rows = that group's real tabs. Two columns
// per row: "Tab Access" (a single checkbox, same can_view mechanism
// already proven for workspace tabs since Phase 4) and "Task Access"
// (every real action button in that tab as its own checkbox, wrapped
// into a 2-row-tall grid so a long task list flows sideways instead
// of down - per the exact "keep two checkboxes vertically and just
// keep adding this two row vertically columns" instruction).
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

                        <div className="role-nav-matrix-scroll">

                            <table className="role-nav-matrix-table role-task-matrix-table">

                                <thead>

                                    <tr>
                                        <th className="role-nav-matrix-sticky-col">Tab</th>
                                        <th>Tab Access</th>
                                        <th>Task Access</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        group.tabs.map((tab, tabIndex)=>(

                                            <tr key={tab.module_id}>

                                                <td className="role-nav-matrix-sticky-col">
                                                    <span className="role-nav-matrix-role-name">{tab.module_name}</span>
                                                </td>

                                                <td className="role-nav-matrix-cell">

                                                    <label className="role-nav-matrix-checkbox-row">

                                                        <input

                                                            type="checkbox"
                                                            checked={tab.can_view}
                                                            onChange={()=>toggleTabAccess(groupIndex, tabIndex)}

                                                        />

                                                        <span>Accessible</span>

                                                    </label>

                                                </td>

                                                <td className="role-task-matrix-task-cell">

                                                    {
                                                        tab.tasks.length===0 ? (
                                                            <span className="role-nav-matrix-role-type">No tasks yet.</span>
                                                        ) : (

                                                            <div className="role-task-matrix-task-grid">

                                                                {
                                                                    tab.tasks.map((task, taskIndex)=>(

                                                                        <label
                                                                            key={task.module_task_id}
                                                                            className="role-nav-matrix-checkbox-row"
                                                                        >

                                                                            <input

                                                                                type="checkbox"
                                                                                checked={task.allowed}
                                                                                onChange={()=>toggleTask(groupIndex, tabIndex, taskIndex)}

                                                                            />

                                                                            <span>{task.task_label}</span>

                                                                        </label>

                                                                    ))
                                                                }

                                                            </div>

                                                        )
                                                    }

                                                </td>

                                            </tr>

                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>

                    </div>

                ))
            }

        </div>

    );

}
