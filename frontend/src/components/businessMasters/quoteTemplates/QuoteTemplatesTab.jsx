import { useState, useEffect, useCallback } from "react";

import { Pencil, SlidersHorizontal, FileDown, Trash2 } from "lucide-react";

import {

    getQuoteTemplates,
    deleteQuoteTemplate,
    updateQuoteTemplate,
    quoteTemplatePreviewUrl

} from "../../../services/quoteTemplatesService";

import EditQuoteTemplateModal from "./EditQuoteTemplateModal";
import QuoteTemplateVariablesModal from "./QuoteTemplateVariablesModal";

import { formatApiError } from "../../../utils/apiError";

import { useAuth } from "../../../contexts/AuthContext";

import { useRemarkPrompt } from "../../../hooks/useRemarkPrompt";

import { buildActor } from "../../../utils/actor";


// ====================================
// ACTION BUTTON
// Same icon+tooltip pattern as EmailTemplatesTab.jsx.
// ====================================

function ActionButton({ icon: Icon, label, className, onClick }){

    return(

        <span className="email-template-action-wrap">

            <button
                type="button"
                className={className}
                aria-label={label}
                onClick={onClick}
            >
                <Icon size={14} strokeWidth={2}/>
            </button>

            <span className="email-template-action-tooltip">
                {label}
            </span>

        </span>

    );

}


// ====================================
// ACTION LINK
// Same styling as ActionButton, but a real <a href> so the browser's
// native download (Content-Disposition: attachment) fires directly -
// no fetch/blob juggling needed.
// ====================================

function ActionLink({ icon: Icon, label, className, href }){

    return(

        <span className="email-template-action-wrap">

            <a
                href={href}
                className={className}
                aria-label={label}
            >
                <Icon size={14} strokeWidth={2}/>
            </a>

            <span className="email-template-action-tooltip">
                {label}
            </span>

        </span>

    );

}


// ====================================
// TAB
// ====================================

export default function QuoteTemplatesTab(){

    const [templates, setTemplates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [editingTemplate, setEditingTemplate] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);

    const [detailsTemplate, setDetailsTemplate] = useState(null);

    const { user, hasTask } = useAuth();

    const { promptForRemark, remarkModal } = useRemarkPrompt();

    const load = useCallback(async()=>{

        setLoading(true);

        setError("");

        try{

            const data = await getQuoteTemplates();

            setTemplates(data ?? []);

        }

        catch(err){

            console.error(err);

            setError("Unable to load quote templates.");

        }

        finally{

            setLoading(false);

        }

    }, []);

    useEffect(()=>{ load(); }, [load]);

    async function handleToggleActive(template){

        const remark = await promptForRemark(template.active ? "Deactivating this quote template" : "Activating this quote template");

        if(remark===null){
            return;
        }

        try{

            await updateQuoteTemplate(template.id, { active: !template.active, actor:buildActor(user), remark });

            load();

        }

        catch(err){

            alert(formatApiError(err, "Unable to update status."));

        }

    }

    async function handleDelete(template){

        const remark = await promptForRemark(`Removing "${template.name}"`);

        if(remark===null){
            return;
        }

        try{

            await deleteQuoteTemplate(template.id, buildActor(user), remark);

            load();

        }

        catch(err){

            alert(formatApiError(err, "Unable to remove template."));

        }

    }

    function handleSaved(){

        setShowEditModal(false);
        setEditingTemplate(null);
        load();

    }

    return(

        <div className="bm-card">

            <h3>

                Quote templates

                {hasTask("bm-tab-quotetemplates", "add_quote_template") && (

                    <button

                        className="bm-btn bm-btn-primary bm-btn-xs bm-push-right"

                        onClick={()=>{ setEditingTemplate(null); setShowEditModal(true); }}

                    >

                        + Add template

                    </button>

                )}

            </h3>

            <p className="bm-muted" style={{marginBottom:10}}>

                The active template's body is what "Accept and Generate Quote Release" turns into a real
                .docx document — edit its content, add {"{token}"} placeholders, and use
                {" {tank_machine_table} "} / {"{commercial_table} "}
                for the dynamic tables.

            </p>

            {

                loading ? (

                    <p className="bm-muted">Loading quote templates...</p>

                ) : error ? (

                    <p className="bm-muted">{error}</p>

                ) : templates.length===0 ? (

                    <p className="bm-muted">No quote templates yet — add the first one.</p>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>Name</th>

                                <th>Status</th>

                                <th></th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                templates.map(t=>(

                                    <tr key={t.id}>

                                        <td>{t.name}</td>

                                        <td>

                                            {hasTask("bm-tab-quotetemplates", "toggle_quote_template_active") ? (

                                                <span

                                                    className={t.active ? "bm-pill bm-pill-green" : "bm-pill bm-pill-gray"}

                                                    style={{cursor:"pointer"}}

                                                    onClick={()=>handleToggleActive(t)}

                                                >

                                                    {t.active ? "Active" : "Inactive"}

                                                </span>

                                            ) : (

                                                <span className={t.active ? "bm-pill bm-pill-green" : "bm-pill bm-pill-gray"}>

                                                    {t.active ? "Active" : "Inactive"}

                                                </span>

                                            )}

                                        </td>

                                        <td className="email-template-actions">

                                            {hasTask("bm-tab-quotetemplates", "edit_quote_template") && (
                                                <ActionButton
                                                    icon={Pencil}
                                                    label="Edit"
                                                    className="email-template-edit"
                                                    onClick={()=>{ setEditingTemplate(t); setShowEditModal(true); }}
                                                />
                                            )}

                                            {hasTask("bm-tab-quotetemplates", "view_quote_template_variables") && (
                                                <ActionButton
                                                    icon={SlidersHorizontal}
                                                    label="Details (variables)"
                                                    className="email-template-details"
                                                    onClick={()=>setDetailsTemplate(t)}
                                                />
                                            )}

                                            {hasTask("bm-tab-quotetemplates", "download_quote_template_sample") && (
                                                <ActionLink
                                                    icon={FileDown}
                                                    label="Download sample .docx"
                                                    className="email-template-view"
                                                    href={quoteTemplatePreviewUrl(t.id)}
                                                />
                                            )}

                                            {hasTask("bm-tab-quotetemplates", "remove_quote_template") && (
                                                <ActionButton
                                                    icon={Trash2}
                                                    label="Remove"
                                                    className="email-template-delete"
                                                    onClick={()=>handleDelete(t)}
                                                />
                                            )}

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

            {

                showEditModal && (

                    <EditQuoteTemplateModal

                        template={editingTemplate}

                        onClose={()=>{ setShowEditModal(false); setEditingTemplate(null); }}

                        onSaved={handleSaved}

                    />

                )

            }

            {

                detailsTemplate && (

                    <QuoteTemplateVariablesModal

                        template={detailsTemplate}

                        onClose={()=>{ setDetailsTemplate(null); load(); }}

                    />

                )

            }

            {remarkModal}

        </div>

    );

}
