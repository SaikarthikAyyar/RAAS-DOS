import { useState, useEffect, useCallback } from "react";

import {

    getCommercialRules,
    updateCommercialRules,
    getCustomerCategories,
    createCustomerCategory,
    deleteCustomerCategory

} from "../../../services/commercialRulesService";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { formatApiError } from "../../../utils/apiError";

import { buildActor } from "../../../utils/actor";


// ====================================
// RULES FORM FIELDS
// The three *_pct fields are stored in the DB as decimal fractions
// (0.25 = 25%) but edited here as whole percentages for readability -
// converted at the load/save boundary only.
// ====================================

const RULES_FIELDS = [

    { key:"mobilisation_rate", label:"Mobilisation rate (₹)" },
    { key:"setup_rate", label:"Setup rate (₹)" },
    { key:"demob_rate", label:"Demobilisation rate (₹)" },
    { key:"overhead_pct", label:"Overhead (%)", isPct:true },
    { key:"margin_pct", label:"Margin (%)", isPct:true },
    { key:"contingency_pct", label:"Contingency (%)", isPct:true },
    { key:"documentation_buffer", label:"Documentation buffer (₹)" },
    { key:"access_support_buffer", label:"Access support buffer (₹)" }

];


function blankForm(){

    const form = {};

    RULES_FIELDS.forEach(f=>{ form[f.key] = ""; });

    return form;

}


function toFormValues(rules){

    const form = {};

    RULES_FIELDS.forEach(f=>{

        const raw = rules[f.key];

        form[f.key] = f.isPct ? Number(raw) * 100 : Number(raw);

    });

    return form;

}


function toPayload(form){

    const payload = {};

    RULES_FIELDS.forEach(f=>{

        const value = Number(form[f.key]);

        payload[f.key] = f.isPct ? value / 100 : value;

    });

    return payload;

}


// ====================================
// TAB
// ====================================

export default function CommercialRulesTab(){

    const [rules, setRules] = useState(null);

    const [form, setForm] = useState(blankForm());

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [saveMessage, setSaveMessage] = useState("");

    const [categories, setCategories] = useState([]);

    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [newCategoryName, setNewCategoryName] = useState("");

    const [newCategoryMargin, setNewCategoryMargin] = useState("");

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const loadRules = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getCommercialRules();

            if(data){

                setRules(data);

                setForm(toFormValues(data));

            }

        }

        catch(err){

            console.error(err);

            setError("Unable to load commercial rules.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    const loadCategories = useCallback(async()=>{

        setCategoriesLoading(true);

        try{

            const data = await getCustomerCategories();

            setCategories(data ?? []);

        }

        catch(err){

            console.error(err);

        }

        finally{

            setCategoriesLoading(false);

        }

    }, []);

    useEffect(()=>{ loadRules(); loadCategories(); }, [loadRules, loadCategories]);

    function handleFieldChange(key, value){

        setForm(prev=>({ ...prev, [key]: value }));

        setSaveMessage("");

    }

    async function handleSaveRules(){

        const remark = await promptForRemark("Updating commercial rules");

        if(remark===null){
            return;
        }

        setSaving(true);

        setError("");

        setSaveMessage("");

        try{

            const updated = await updateCommercialRules({ ...toPayload(form), actor:buildActor(user), remark });

            setRules(updated);

            setForm(toFormValues(updated));

            setSaveMessage("Changes saved.");

        }

        catch(err){

            setError(formatApiError(err, "Unable to save commercial rules."));

        }

        finally{

            setSaving(false);

        }

    }

    async function handleAddCategory(){

        if(!newCategoryName.trim() || newCategoryMargin===""){

            alert("Category name and margin % are required.");

            return;

        }

        const remark = await promptForRemark("Adding this customer category");

        if(remark===null){
            return;
        }

        try{

            await createCustomerCategory({

                category: newCategoryName.trim(),
                margin_pct: Number(newCategoryMargin) / 100,
                actor: buildActor(user),
                remark

            });

            setNewCategoryName("");

            setNewCategoryMargin("");

            loadCategories();

        }

        catch(err){

            alert(formatApiError(err, "Unable to add customer category."));

        }

    }

    async function handleRemoveCategory(id){

        const remark = await promptForRemark("Removing this customer category");

        if(remark===null){
            return;
        }

        try{

            await deleteCustomerCategory(id, buildActor(user), remark);

            loadCategories();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove customer category."));

        }

    }

    return(

        <>

            <div className="bm-card">

                <h3>Commercial rules</h3>

                {

                    loading ? (

                        <p className="bm-muted">Loading commercial rules...</p>

                    ) : error && !rules ? (

                        <p className="bm-muted">{error}</p>

                    ) : (

                        <>

                            <div className="bm-formgrid">

                                {

                                    RULES_FIELDS.map(f=>(

                                        <div key={f.key}>

                                            <label>{f.label}</label>

                                            <input

                                                type="number"

                                                value={form[f.key]}

                                                onChange={e=>handleFieldChange(f.key, e.target.value)}

                                            />

                                        </div>

                                    ))

                                }

                            </div>

                            {error && <p className="bm-modal-hint" style={{color:"#991b1b"}}>{error}</p>}

                            {saveMessage && <p className="bm-modal-hint" style={{color:"#166534"}}>{saveMessage}</p>}

                            {hasTask("bm-tab-rules", "save_commercial_rules") && (

                                <button

                                    className="bm-btn bm-btn-primary"

                                    onClick={handleSaveRules}

                                    disabled={saving}

                                >

                                    {saving ? "Saving..." : "Save changes"}

                                </button>

                            )}

                        </>

                    )

                }

            </div>

            <div className="bm-card">

                <h3>Customer categories</h3>

                {

                    categoriesLoading ? (

                        <p className="bm-muted">Loading customer categories...</p>

                    ) : (

                        <>

                            <table>

                                <thead>

                                    <tr>

                                        <th>Category</th>

                                        <th>Margin (%)</th>

                                        <th></th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {

                                        categories.map(c=>(

                                            <tr key={c.id}>

                                                <td>{c.category}</td>

                                                <td>{(Number(c.margin_pct) * 100).toFixed(2)}</td>

                                                <td>

                                                    {hasTask("bm-tab-rules", "remove_customer_category") && (

                                                        <button

                                                            className="bm-backlink"

                                                            onClick={()=>handleRemoveCategory(c.id)}

                                                        >

                                                            Remove

                                                        </button>

                                                    )}

                                                </td>

                                            </tr>

                                        ))

                                    }

                                    <tr>

                                        <td>

                                            <input

                                                value={newCategoryName}

                                                onChange={e=>setNewCategoryName(e.target.value)}

                                                placeholder="New category"

                                            />

                                        </td>

                                        <td>

                                            <input

                                                type="number"

                                                value={newCategoryMargin}

                                                onChange={e=>setNewCategoryMargin(e.target.value)}

                                                placeholder="Margin %"

                                            />

                                        </td>

                                        <td>

                                            {hasTask("bm-tab-rules", "add_customer_category") && (

                                                <button

                                                    className="bm-btn bm-btn-primary bm-btn-xs"

                                                    onClick={handleAddCategory}

                                                >

                                                    + Add

                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                </tbody>

                            </table>

                        </>

                    )

                }

            </div>

            {remarkModal}

        </>

    );

}
