import { useEffect, useState } from "react";

import {

    getNavMatrix,
    saveNavMatrix

} from "../../services/rolePermissionsService";

import { MODULE_META } from "../../config/navigation";

import "./RoleNavigationMatrix.css";

// ====================================
// HELPERS
// ====================================

function cellKey(roleId, moduleId){
    return `${roleId}:${moduleId}`;
}

function normalizeCells(cells){

    const byKey = {};

    for(const cell of cells){
        byKey[cellKey(cell.role_id, cell.module_id)] = {
            can_view: cell.can_view,
            is_landing_page: cell.is_landing_page
        };
    }

    return byKey;

}


// ====================================
// COMPONENT
// Rows = every role, columns = every nav-type module (the full
// cross-product from GET /role-permissions/nav-matrix - a role with
// zero saved permissions still shows a complete, unchecked row, which
// is what makes a brand-new role show up here ready to configure with
// no extra wiring). Two checkboxes per cell:
//   - Accessible (can_view)
//   - Landing page (is_landing_page) - single-select per role, and
//     coupled to Accessible both ways: checking it force-checks
//     Accessible; unchecking Accessible on the current landing-page
//     cell clears Landing page too, since a role can't land on a page
//     it can't see.
// Edits are held in local state until "Save changes" - with ~15
// roles x 18 modules, autosave-per-click would be a request storm.
// ====================================

export default function RoleNavigationMatrix(){

    const [roles, setRoles] = useState([]);

    const [modules, setModules] = useState([]);

    const [cells, setCells] = useState({});

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState(null);

    async function load(){

        setLoading(true);

        try{

            const data = await getNavMatrix();

            setRoles(data.roles);
            setModules(data.modules);
            setCells(normalizeCells(data.cells));

        }
        catch(error){

            console.error("[RoleNavigationMatrix] Failed to load matrix", error);
            setMessage({ type:"error", text:"Unable to load the navigation matrix." });

        }
        finally{

            setLoading(false);

        }

    }

    useEffect(()=>{

        load();

    }, []);

    function getCell(roleId, moduleId){

        return cells[cellKey(roleId, moduleId)] || { can_view:false, is_landing_page:false };

    }

    function toggleAccessible(roleId, moduleId){

        setCells(prev=>{

            const key = cellKey(roleId, moduleId);
            const current = prev[key] || { can_view:false, is_landing_page:false };
            const nextCanView = !current.can_view;

            return {
                ...prev,
                [key]: {
                    can_view: nextCanView,
                    // A role can't land on a page it can't see.
                    is_landing_page: nextCanView ? current.is_landing_page : false
                }
            };

        });

    }

    function toggleLandingPage(roleId, moduleId){

        setCells(prev=>{

            const key = cellKey(roleId, moduleId);
            const current = prev[key] || { can_view:false, is_landing_page:false };
            const turningOn = !current.is_landing_page;

            const next = { ...prev };

            // Single-select per role: clear every other module's
            // landing-page flag for this role first.
            for(const module of modules){

                const otherKey = cellKey(roleId, module.id);

                if(otherKey === key) continue;

                if(next[otherKey]?.is_landing_page){
                    next[otherKey] = { ...next[otherKey], is_landing_page:false };
                }

            }

            next[key] = {
                can_view: turningOn ? true : current.can_view,
                is_landing_page: turningOn
            };

            return next;

        });

    }

    async function handleSave(){

        setSaving(true);
        setMessage(null);

        try{

            const payload = [];

            for(const role of roles){
                for(const module of modules){

                    const cell = getCell(role.id, module.id);

                    payload.push({
                        role_id: role.id,
                        module_id: module.id,
                        can_view: cell.can_view,
                        is_landing_page: cell.is_landing_page
                    });

                }
            }

            const data = await saveNavMatrix(payload);

            setRoles(data.roles);
            setModules(data.modules);
            setCells(normalizeCells(data.cells));

            setMessage({ type:"success", text:"Navigation access saved." });

        }
        catch(error){

            setMessage({ type:"error", text: error?.detail || "Unable to save navigation access." });

        }
        finally{

            setSaving(false);

        }

    }

    if(loading){
        return <p className="role-nav-matrix-status">Loading navigation matrix...</p>;
    }

    return(

        <div className="role-nav-matrix-wrap">

            <div className="role-nav-matrix-header">

                <p className="role-nav-matrix-hint">

                    Accessible controls whether a role sees this module in the sidebar. Landing page is where the role lands right after login - one per role.

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

            <div className="role-nav-matrix-scroll">

                <table className="role-nav-matrix-table">

                    <thead>

                        <tr>

                            <th className="role-nav-matrix-sticky-col">Role</th>

                            {
                                modules.map(module=>(
                                    <th key={module.id}>
                                        {MODULE_META[module.module_key]?.title ?? module.module_name}
                                    </th>
                                ))
                            }

                        </tr>

                    </thead>

                    <tbody>

                        {
                            roles.map(role=>(

                                <tr key={role.id}>

                                    <td className="role-nav-matrix-sticky-col">

                                        <div className="role-nav-matrix-role-cell">

                                            <span className="role-nav-matrix-role-name">{role.name}</span>

                                            <span className="role-nav-matrix-role-type">{role.role_type}</span>

                                        </div>

                                    </td>

                                    {
                                        modules.map(module=>{

                                            const cell = getCell(role.id, module.id);

                                            return(

                                                <td key={module.id} className="role-nav-matrix-cell">

                                                    <label className="role-nav-matrix-checkbox-row">

                                                        <input

                                                            type="checkbox"
                                                            checked={cell.can_view}
                                                            onChange={()=>toggleAccessible(role.id, module.id)}

                                                        />

                                                        <span>Accessible</span>

                                                    </label>

                                                    <label className="role-nav-matrix-checkbox-row role-nav-matrix-landing">

                                                        <input

                                                            type="checkbox"
                                                            checked={cell.is_landing_page}
                                                            onChange={()=>toggleLandingPage(role.id, module.id)}

                                                        />

                                                        <span>Landing page</span>

                                                    </label>

                                                </td>

                                            );

                                        })
                                    }

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}
